# Fieldnotes Persona Research Platform

A browser-based implementation of the Task 3 PRD for survey research, persona interviews, insight extraction, adoption scoring, and validation.

## Run locally

No package installation or build step is required. For the local deterministic engine, start the included server:

```powershell
py server.py
```

Open <http://localhost:4173>. If `py` is unavailable, use `python server.py`.

### Optional live model

The app can use an OpenAI-compatible chat-completions endpoint. Configure credentials in the server's environment, then restart it:

```powershell
$env:OPENAI_API_KEY = "your-key"
$env:OPENAI_MODEL = "gpt-4o-mini"
py server.py
```

For a local OpenAI-compatible server, set `OPENAI_BASE_URL` (for example, `http://localhost:11434/v1`) and `OPENAI_MODEL`; no browser-side key is used. See `.env.example`. If no provider is configured, the app stays in clearly labeled local simulation mode. Model-provider costs and access are separate from this project.

## Included workflows

- Create surveys with open response, single choice, multiple choice, 5/7-point Likert, ranking, and yes/no-with-justification questions.
- Select from eight profile-rich personas. Responses are generated concurrently and compared in a side-by-side matrix.
- Run six scenarios: QuickBite, FinFlow, TeamSync, PureGlow, CarePath, and NestShare.
- Interview any persona across persistent turns, with profile-conditioned replies, transcript memory, probe suggestions, and transcript export.
- Extract evidence-linked themes, keyword-based sentiment, agreement/divergence, behavior signals, per-segment adoption scores, and an executive summary.
- Export response CSV/JSON, insight Markdown/JSON, and interview transcripts. Browser print can save a report as PDF.
- Review response latency, estimated tokens, profile-consistency checks, scenario coverage, and interview memory in Evaluation.

## Model transparency

Without a provider, this build uses a deterministic, profile-conditioned local engine. It is reproducible and works without credentials, but is not a hosted LLM and does not generate human research data. With a configured endpoint, persona survey calls run concurrently and interview calls include profile and rolling transcript context. Sentiment and theme extraction use transparent keyword rules; consistency checks are rule-based. The displayed evaluation thresholds are targets, not independent human-evaluation results. Validate findings with real participants before making product decisions.

Workspace data is stored in this browser's local storage. Use the same browser profile to continue a study.

When live mode is enabled, persona profiles, survey questions, and interview transcripts are sent to the configured model endpoint. Do not include real participant data or sensitive personal information.
