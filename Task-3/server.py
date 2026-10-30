"""Small standard-library API server for Fieldnotes persona research."""

from __future__ import annotations

import json
import os
import re
import time
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import urlparse
from urllib.request import Request, urlopen
ROOT = Path(__file__).resolve().parent
MAX_BODY_BYTES = 1_000_000
DEFAULT_BASE_URL = "https://api.openai.com/v1"


def model_config() -> tuple[str, str, str]:
    base_url = os.environ.get("OPENAI_BASE_URL", DEFAULT_BASE_URL).rstrip("/")
    model = os.environ.get("OPENAI_MODEL", "gpt-4o-mini")
    api_key = os.environ.get("OPENAI_API_KEY", os.environ.get("MODEL_API_KEY", ""))
    local_provider = urlparse(base_url).hostname in {"localhost", "127.0.0.1", "::1"}
    return base_url, model, api_key if api_key or local_provider else ""


def call_model(messages: list[dict], temperature: float = 0.25) -> tuple[str, dict]:
    base_url, model, api_key = model_config()
    if not api_key and urlparse(base_url).hostname not in {"localhost", "127.0.0.1", "::1"}:
        raise RuntimeError("No model credentials configured.")

    payload = json.dumps({
        "model": model,
        "temperature": temperature,
        "messages": messages,
        "response_format": {"type": "json_object"},
    }).encode("utf-8")
    headers = {"Content-Type": "application/json"}
    if api_key:
        headers["Authorization"] = f"Bearer {api_key}"
    request = Request(f"{base_url}/chat/completions", data=payload, headers=headers, method="POST")
    started = time.perf_counter()
    try:
        with urlopen(request, timeout=50) as response:
            result = json.loads(response.read().decode("utf-8"))
    except (HTTPError, URLError, TimeoutError, json.JSONDecodeError) as error:
        raise RuntimeError("The configured model endpoint did not return a valid response.") from error

    choices = result.get("choices") or []
    content = choices[0].get("message", {}).get("content") if choices else None
    if not isinstance(content, str) or not content.strip():
        raise RuntimeError("The model returned an empty response.")
    usage = result.get("usage") or {}
    usage["latencyMs"] = round((time.perf_counter() - started) * 1000)
    usage["model"] = result.get("model", model)
    return content, usage


def profile_prompt(profile: dict) -> str:
    return (
        "You are answering as a synthetic research persona, never as a real human. "
        "Stay consistent with the full profile below. Do not invent personal facts, "
        "credentials, or lived experiences outside it. Be specific, natural, concise, "
        "and candid; use the persona's vocabulary, constraints, and decision style. "
        "Do not give medical, financial, or other professional advice.\n\n"
        f"PROFILE JSON:\n{json.dumps(profile, ensure_ascii=False)}"
    )


def make_survey_response(body: dict) -> dict:
    profile = body.get("persona")
    survey = body.get("survey") or {}
    questions = body.get("questions") or []
    if not isinstance(profile, dict) or not isinstance(questions, list) or not questions:
        raise ValueError("A persona and at least one question are required.")

    question_context = [{key: question.get(key) for key in ("id", "type", "prompt", "options")} for question in questions]
    instructions = (
        "Respond to every question using the product and research context. For Likert "
        "questions give one integer on the requested scale plus brief reasoning. For "
        "choice questions choose only from the supplied options; for ranking include "
        "every option once. For yes/no questions answer yes or no and explain why. "
        "Return only a JSON object with an `answers` array. Each answer must contain "
        "the exact `questionId` and a concise `text` response. Do not add other keys.\n\n"
        f"STUDY CONTEXT:\n{json.dumps(survey, ensure_ascii=False)}\n\n"
        f"QUESTIONS:\n{json.dumps(question_context, ensure_ascii=False)}"
    )
    started = time.perf_counter()
    content, usage = call_model([
        {"role": "system", "content": profile_prompt(profile)},
        {"role": "user", "content": instructions},
    ])
    content = re.sub(r"^```(?:json)?\s*|\s*```$", "", content.strip(), flags=re.IGNORECASE)
    try:
        parsed = json.loads(content)
        answers = parsed.get("answers")
        expected = {str(question.get("id")) for question in questions}
        received = {str(answer.get("questionId")) for answer in answers or [] if isinstance(answer, dict)}
        if not isinstance(answers, list) or received != expected:
            raise ValueError("The model did not answer every question exactly once.")
        normalized = []
        for answer in answers:
            text = answer.get("text")
            if not isinstance(text, str) or not text.strip():
                raise ValueError("The model returned a blank answer.")
            normalized.append({"questionId": str(answer["questionId"]), "text": text.strip()})
    except (json.JSONDecodeError, AttributeError, TypeError, KeyError) as error:
        raise ValueError("The model response was not valid structured JSON.") from error

    return {"answers": normalized, "latencyMs": round((time.perf_counter() - started) * 1000), "usage": usage}


def make_interview_response(body: dict) -> dict:
    profile = body.get("persona")
    transcript = body.get("messages") or []
    if not isinstance(profile, dict) or not isinstance(transcript, list) or not transcript:
        raise ValueError("A persona and interview transcript are required.")
    summary = str(body.get("summary") or "")[:5000]
    safe_transcript = [
        {"role": "assistant" if item.get("role") == "assistant" else "user", "content": str(item.get("content", ""))[:4000]}
        for item in transcript[-24:] if isinstance(item, dict)
    ]
    system = profile_prompt(profile) + (
        "\n\nThis is a continuing interview. Use the transcript and rolling summary "
        "to remember earlier answers, refer back naturally when relevant, and never "
        "contradict the persona profile. Answer the latest interviewer question only. "
        "Return only a JSON object with a single `reply` string field."
        + (f"\n\nROLLING SUMMARY:\n{summary}" if summary else "")
    )
    started = time.perf_counter()
    content, usage = call_model([{"role": "system", "content": system}, *safe_transcript], temperature=0.4)
    try:
        parsed = json.loads(re.sub(r"^```(?:json)?\s*|\s*```$", "", content.strip(), flags=re.IGNORECASE))
        text = parsed.get("reply")
        if not isinstance(text, str) or not text.strip():
            raise ValueError("The model returned no interview reply.")
    except (json.JSONDecodeError, AttributeError, TypeError) as error:
        raise ValueError("The model response was not valid JSON.") from error
    return {"text": text.strip(), "latencyMs": round((time.perf_counter() - started) * 1000), "usage": usage}


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def do_GET(self):
        if urlparse(self.path).path == "/api/status":
            base_url, model, api_key = model_config()
            local_provider = urlparse(base_url).hostname in {"localhost", "127.0.0.1", "::1"}
            ready = bool(api_key) or local_provider
            self.send_json(200, {"mode": "hosted" if ready else "local", "model": model if ready else "Fieldnotes Local Persona Engine · v1.0", "ready": ready})
            return
        return super().do_GET()

    def do_POST(self):
        route = urlparse(self.path).path
        if route not in {"/api/respond", "/api/interview"}:
            self.send_json(404, {"error": "Not found."})
            return
        try:
            length = int(self.headers.get("Content-Length", "0"))
            if length <= 0 or length > MAX_BODY_BYTES:
                raise ValueError("Request body is empty or too large.")
            body = json.loads(self.rfile.read(length).decode("utf-8"))
            result = make_survey_response(body) if route == "/api/respond" else make_interview_response(body)
            self.send_json(200, result)
        except (ValueError, json.JSONDecodeError) as error:
            self.send_json(400, {"error": str(error)})
        except RuntimeError as error:
            self.send_json(503, {"error": str(error), "retryable": True})
        except Exception:
            self.send_json(500, {"error": "The model request could not be completed.", "retryable": True})

    def send_json(self, status: int, body: dict):
        encoded = json.dumps(body, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(encoded)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(encoded)

    def log_message(self, format, *args):
        print(f"[{self.log_date_time_string()}] {format % args}")


def main():
    server = ThreadingHTTPServer(("127.0.0.1", int(os.environ.get("PORT", "4173"))), Handler)
    print(f"Fieldnotes running at http://127.0.0.1:{server.server_port}")
    print("Mode: local deterministic fallback" if model_config()[2] == "" and urlparse(model_config()[0]).hostname not in {"localhost", "127.0.0.1", "::1"} else f"Mode: OpenAI-compatible model ({model_config()[1]})")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping Fieldnotes.")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
