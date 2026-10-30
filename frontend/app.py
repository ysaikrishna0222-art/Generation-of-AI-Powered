import os
from typing import Any

import requests
import streamlit as st


API_BASE = os.getenv("API_BASE_URL", "http://127.0.0.1:8000")

st.set_page_config(
	page_title="Synthetic User Research",
	page_icon="◈",
	layout="wide",
	initial_sidebar_state="expanded",
)

st.markdown(
	"""
	<style>
	@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');
	:root { --ink: #18222d; --muted: #6b7785; --line: #d9e0e5; --mint: #d7f2e7; --coral: #f27c67; --navy: #193246; }
	html, body, [class*="css"] { font-family: 'DM Sans', sans-serif; color: var(--ink); }
	h1, h2, h3 { font-family: 'Space Grotesk', sans-serif; letter-spacing: 0; }
	h1 { font-size: 2.45rem !important; line-height: 1.05 !important; }
	h2 { font-size: 1.45rem !important; }
	[data-testid="stSidebar"] { background: #f3f6f5; border-right: 1px solid var(--line); }
	[data-testid="stSidebar"] h2 { font-size: 1.05rem !important; }
	.eyebrow { color: var(--coral); font-size: .73rem; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; margin-bottom: .55rem; }
	.lead { color: var(--muted); font-size: 1.02rem; max-width: 700px; }
	.metric-strip { display: flex; gap: 12px; margin: 1.25rem 0 1.8rem; }
	.metric { border: 1px solid var(--line); background: #fff; padding: 14px 18px; min-width: 132px; }
	.metric strong { display: block; font: 700 1.55rem 'Space Grotesk', sans-serif; color: var(--navy); }
	.metric span { color: var(--muted); font-size: .78rem; }
	.persona-card { border: 1px solid var(--line); border-top: 4px solid var(--coral); background: #fff; padding: 18px; min-height: 310px; margin-bottom: 8px; }
	.persona-card h3 { margin: 0 0 3px; color: var(--navy); }
	.persona-meta { color: var(--muted); font-size: .83rem; margin-bottom: 14px; }
	.tag { display: inline-block; background: var(--mint); color: #255848; font-size: .73rem; padding: 4px 8px; margin: 2px 3px 2px 0; }
	.section-rule { border-top: 1px solid var(--line); margin: 1.4rem 0; }
	.chat-researcher { background: #edf3f5; border-left: 3px solid #8aa2ae; padding: 12px 15px; margin: 8px 0; }
	.chat-persona { background: #fff8f4; border-left: 3px solid var(--coral); padding: 12px 15px; margin: 8px 0 16px; }
	.chat-label { color: var(--muted); font-size: .72rem; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; }
	.notice { border: 1px solid #efd2c9; background: #fff8f4; padding: 12px 14px; color: #7c493d; }
	.stButton > button { border-radius: 3px; font-weight: 600; }
	</style>
	""",
	unsafe_allow_html=True,
)


def api_request(method: str, path: str, payload: dict[str, Any] | None = None) -> dict[str, Any] | None:
	try:
		response = requests.request(method, f"{API_BASE}{path}", json=payload, timeout=15)
		response.raise_for_status()
		return response.json()
	except requests.RequestException as error:
		st.error(f"Backend is unavailable: {error}")
		return None


def initialize_state() -> None:
	st.session_state.setdefault("experiment", None)
	st.session_state.setdefault("selected_persona_id", None)
	st.session_state.setdefault("messages", {})


def render_metric_strip(experiment: dict[str, Any]) -> None:
	objectives = len(experiment.get("research_objectives", []))
	personas = len(experiment.get("personas", []))
	turns = sum(len(messages) // 2 for messages in st.session_state.messages.values())
	st.markdown(
		f"<div class='metric-strip'><div class='metric'><strong>{personas}</strong><span>synthetic users</span></div>"
		f"<div class='metric'><strong>{objectives}</strong><span>research objectives</span></div>"
		f"<div class='metric'><strong>{turns}</strong><span>completed interviews</span></div></div>",
		unsafe_allow_html=True,
	)


def render_persona_card(persona: dict[str, Any], selected: bool) -> None:
	tags = "".join(f"<span class='tag'>{trait}</span>" for trait in persona["personality_traits"])
	st.markdown(
		f"<div class='persona-card'><h3>{persona['name']}</h3><div class='persona-meta'>{persona['age']} · {persona['occupation']} · {persona['location']}</div>"
		f"<div>{tags}</div><div class='section-rule'></div><b>Decision style</b><br><small>{persona['decision_making_style']}</small>"
		f"<br><br><b>Motivated by</b><br><small>{', '.join(persona['motivations'])}</small>"
		f"<br><br><b>Watch for</b><br><small>{', '.join(persona['concerns'])}</small></div>",
		unsafe_allow_html=True,
	)
	label = "Selected" if selected else "Open interview"
	if st.button(label, key=f"select-{persona['id']}", use_container_width=True, disabled=selected):
		st.session_state.selected_persona_id = persona["id"]
		st.rerun()


def render_setup() -> None:
	st.markdown("<div class='eyebrow'>Research workspace · milestone 2</div>", unsafe_allow_html=True)
	st.title("Synthetic user research, with memory.")
	st.markdown(
		"<p class='lead'>Frame a study, meet a deliberately diverse panel, and carry each interview forward with the persona's preferences and opinions intact.</p>",
		unsafe_allow_html=True,
	)
	st.markdown("<div class='section-rule'></div>", unsafe_allow_html=True)
	st.subheader("Start a study")
	st.caption("The local simulation works without an API key and is ready for a mentor demonstration.")
	product = st.text_area(
		"Product description",
		value="AI-powered fitness application that provides personalized workout plans and diet recommendations.",
		height=100,
	)
	audience = st.text_input(
		"Target audience",
		value="College students and young working professionals aged 18-30.",
	)
	objectives_text = st.text_area(
		"Research objectives",
		value="Understand user interest in the product.\nIdentify important features.\nUnderstand pricing expectations.\nIdentify possible concerns.\nEvaluate purchase intention.",
		height=130,
		help="Use one objective per line.",
	)
	count = st.slider("Panel size", min_value=3, max_value=6, value=5)
	if st.button("Create experiment and generate panel", type="primary", use_container_width=True):
		objectives = [line.strip() for line in objectives_text.splitlines() if line.strip()]
		if not product.strip() or not audience.strip() or not objectives:
			st.warning("Add a product, audience, and at least one research objective.")
			return
		experiment = api_request(
			"POST",
			"/api/experiments",
			{
				"product_description": product,
				"target_audience": audience,
				"research_objectives": objectives,
				"persona_count": count,
			},
		)
		if experiment:
			st.session_state.experiment = experiment
			st.session_state.selected_persona_id = experiment["personas"][0]["id"]
			st.session_state.messages = {}
			st.rerun()


def render_sidebar(experiment: dict[str, Any]) -> None:
	with st.sidebar:
		st.markdown("<div class='eyebrow'>Study control</div>", unsafe_allow_html=True)
		st.markdown("### Current experiment")
		st.caption(experiment["product_description"])
		st.markdown("**Audience**")
		st.caption(experiment["target_audience"])
		st.markdown("**Objectives**")
		for objective in experiment["research_objectives"]:
			st.markdown(f"- {objective}")
		st.divider()
		if st.button("Start a new experiment", use_container_width=True):
			st.session_state.experiment = None
			st.session_state.selected_persona_id = None
			st.session_state.messages = {}
			st.rerun()


def render_workspace(experiment: dict[str, Any]) -> None:
	render_sidebar(experiment)
	st.markdown("<div class='eyebrow'>Experiment workspace</div>", unsafe_allow_html=True)
	st.title("Meet the panel")
	st.markdown(
		f"<p class='lead'>{experiment['target_audience']} · generated from your study brief</p>",
		unsafe_allow_html=True,
	)
	render_metric_strip(experiment)
	columns = st.columns(min(3, len(experiment["personas"])))
	for index, persona in enumerate(experiment["personas"]):
		with columns[index % len(columns)]:
			render_persona_card(persona, persona["id"] == st.session_state.selected_persona_id)


def render_conversation(experiment: dict[str, Any]) -> None:
	persona = next(
		item for item in experiment["personas"] if item["id"] == st.session_state.selected_persona_id
	)
	messages = st.session_state.messages.setdefault(persona["id"], [])
	st.markdown("<div class='eyebrow'>Persona interview</div>", unsafe_allow_html=True)
	st.title(f"Conversation with {persona['name']}")
	left, right = st.columns([1, 2])
	with left:
		st.subheader("Persona profile")
		st.markdown(f"**{persona['age']} · {persona['occupation']}**")
		st.caption(f"{persona['education']} · {persona['income_range']} · {persona['location']}")
		st.markdown("**Personality**")
		st.write(", ".join(persona["personality_traits"]))
		st.markdown("**Behavior**")
		for item in persona["shopping_behavior"]:
			st.markdown(f"- {item}")
		st.markdown("**Motivations**")
		for item in persona["motivations"]:
			st.markdown(f"- {item}")
		st.markdown("**Memory status**")
		st.caption(f"{len(messages) // 2} exchanges retained for this interview.")
	with right:
		if not messages:
			st.markdown(
				"<div class='notice'>Start with a realistic research question. Ask about interest, features, pricing, privacy, or purchase intent.</div>",
				unsafe_allow_html=True,
			)
		for message in messages:
			style = "chat-researcher" if message["role"] == "researcher" else "chat-persona"
			label = "Researcher" if message["role"] == "researcher" else persona["name"]
			st.markdown(
				f"<div class='{style}'><div class='chat-label'>{label}</div>{message['content']}</div>",
				unsafe_allow_html=True,
			)
		with st.form(f"message-form-{persona['id']}", clear_on_submit=True):
			question = st.text_input(
				"Research question",
				placeholder="Would you pay INR 1,500 per month for this?",
				label_visibility="collapsed",
			)
			submitted = st.form_submit_button("Send question", type="primary", use_container_width=True)
		if submitted and question.strip():
			result = api_request(
				"POST",
				f"/api/experiments/{experiment['id']}/personas/{persona['id']}/messages",
				{"content": question.strip()},
			)
			if result:
				messages.extend(
					[
						{"role": "researcher", "content": question.strip()},
						{"role": "persona", "content": result["reply"]["content"]},
					]
				)
				st.rerun()


def render_readout(experiment: dict[str, Any]) -> None:
	st.markdown("<div class='eyebrow'>Research readout</div>", unsafe_allow_html=True)
	st.title("What the panel is telling you")
	st.markdown("Use the objective list as your analysis checklist while interviews accumulate.")
	completed = sum(len(messages) // 2 for messages in st.session_state.messages.values())
	if completed == 0:
		st.info("Complete at least one interview to populate the readout.")
	for objective in experiment["research_objectives"]:
		st.markdown(f"### {objective}")
		st.caption("Interview evidence will appear here as you ask the panel.")
	st.markdown("<div class='section-rule'></div>", unsafe_allow_html=True)
	st.subheader("Interview evidence")
	for persona in experiment["personas"]:
		messages = st.session_state.messages.get(persona["id"], [])
		if messages:
			st.markdown(f"**{persona['name']}**")
			st.write(messages[-1]["content"])


initialize_state()
if st.session_state.experiment is None:
	render_setup()
else:
	experiment = st.session_state.experiment
	render_workspace(experiment)
	tabs = st.tabs(["Interviews", "Research readout"])
	with tabs[0]:
		render_conversation(experiment)
	with tabs[1]:
		render_readout(experiment)
