# PRODUCT REQUIREMENTS DOCUMENT (PRD)

## AI Persona Research Platform — Task 3: Survey Mode, Interview Mode & Insight Extraction

| Field | Detail |
|---|---|
| Document Version | 1.0 |
| Date | 2026-10-01 |
| Author | [Your Name] — Infosys Springboard Internship |
| Project | AI-Powered Simulated User Research Platform |
| Scope | Task 3: Survey Mode, Interview Mode, Insight Extraction Agent, "Would Use This Product?" Scoring |
| Status | Ready for Development |

---

## 1. EXECUTIVE SUMMARY

The AI Persona Research Platform allows product teams to conduct user research without recruiting real humans. Users define research questions and a set of AI personas (synthetic users with demographic, psychographic, and behavioral profiles). The platform runs two research modes:

- **Survey Mode** — one question set answered simultaneously by all selected personas, displayed side-by-side for comparison.
- **Interview Mode** — a conversational, multi-turn chat with a selected persona, who stays in character and remembers the conversation.

An **Insight Extraction Agent** then analyzes all survey and interview responses to surface themes, sentiment, agreement patterns, behavioral trends, and an aggregated **"Would Use This Product?"** score per persona segment.

**Primary users:** Product managers, UX researchers, founders, and students conducting simulated user research.

---

## 2. BACKGROUND & PROBLEM STATEMENT

Recruiting real users for research is slow, expensive, and often impossible in early-stage product development. Simulated persona research provides a fast, low-cost first signal — before validating with real users. The risks of simulation (inconsistency, generic answers, hallucinated personas) must be actively engineered against. Task 3 builds the research execution and analysis layer of the platform.

---

## 3. GOALS & OBJECTIVES

| # | Objective (from Task 3) | Success Criteria |
|---|---|---|
| 1 | Build Survey Mode with parallel persona responses | All selected personas respond simultaneously; responses render side-by-side; p95 generation time ≤ 60s for 8 personas × 5 questions |
| 2 | Validate persona consistency & response realism | Consistency score ≥ 90% on a persona-consistency test suite across question types and ≥ 3 product domains |
| 3 | Test Survey Mode across diverse persona sets & categories | Platform validated with ≥ 4 persona-set archetypes and ≥ 3 product categories using scripted experiment scenarios |
| 4 | Build Interview Mode with multi-turn in-character chat | Persona maintains character and memory across ≥ 10 turns; behavioral consistency rated ≥ 85% by evaluators |
| 5 | Develop Insight Extraction Agent | Extracts themes, sentiment breakdown, agreement patterns, behavioral trends from any experiment run |
| 6 | Implement "Would use this product?" scoring | Per-persona-group score (0–100 or Likelihood scale) with natural-language reasoning for each segment |
| 7 | Validate insight extraction quality & theme relevance | Theme relevance rated ≥ 85% by human evaluators across varied experiment scenarios; extraction reproducible run-to-run |

---

## 4. USERS & USE CASES

| User | Use Case |
|---|---|
| Product Manager | Run a survey across 6 personas to compare feature preferences before a sprint |
| UX Researcher | Interview a "frustrated power user" persona for 15 minutes to probe pain points |
| Founder | Get a "Would use this product?" score per segment for a new app idea |
| Intern/Student (Springboard) | Execute Task 3 experiment scenarios and validate the platform |

---

## 5. FUNCTIONAL REQUIREMENTS

### 5.1 Survey Mode (Sub-task 1)

**FR-1.1 — Survey Creation.** User can create a survey with a title, description, target product/domain, and a list of questions. Supported question types:
- Open-ended (free text)
- Single-choice (radio)
- Multiple-choice (checkbox)
- Likert scale (5 or 7 point)
- Ranking
- Yes/No with follow-up justification

**FR-1.2 — Persona Selection.** User selects ≥ 2 personas from the persona library to participate. Each persona's profile snapshot (name, age, role, key traits) is shown.

**FR-1.3 — Parallel Generation.** All selected personas generate responses **simultaneously** (concurrent API calls / parallel workers), each response conditioned on the persona's full profile and the survey context.

**FR-1.4 — Side-by-Side Display.** Responses are rendered in a comparison grid: one column per persona (or one row per question), enabling direct comparison. Each response must visibly carry its persona's name/avatar.

**FR-1.5 — Response Export.** Surveys and responses exportable as JSON/CSV/PDF for downstream analysis.

### 5.2 Persona Consistency & Response Realism Validation (Sub-task 2)

**FR-2.1 — Consistency Checks.** The system validates that:
- (a) Responses are stylistically and attitudinally consistent with the persona profile (no contradictions with declared traits).
- (b) A persona's answers are internally consistent across questions within one survey (e.g., doesn't rank price as top priority then praise high price).
- (c) Responses exhibit persona-specific realism (language, knowledge level, concerns), not generic model answers.

**FR-2.2 — Validation Matrix.** Consistency is tested across question types (open-ended, Likert, ranking, choice) and product domains (e.g., fintech, health/wellness, e-commerce, SaaS productivity, food delivery).

**FR-2.3 — Consistency Scoring.** A dedicated evaluation prompt chain (LLM-as-judge + rule checks) produces a 0–100 consistency score per persona per survey; results logged to an evaluation dashboard.

### 5.3 Survey Mode Experiment Scenarios (Sub-task 3)

**FR-3.1 — Scenario Runner.** A scripted scenario mode that runs pre-defined experiments:
- **Scenario A:** Diverse demographic set (5 personas spanning age, income, geography) × food-delivery app concept.
- **Scenario B:** Persona set spanning tech-savviness (digital-native student, mid-career professional, retiree) × personal-finance app.
- **Scenario C:** Role-based B2B personas (admin, end user, buyer) × SaaS productivity tool.
- **Scenario D:** Contrasting value-orientation personas (budget-driven vs. premium/quality-driven) × D2C wellness brand.

**FR-3.2 — Scenario Report.** Each scenario auto-generates a report: response matrix, consistency scores, and initial observations.

### 5.4 Interview Mode (Sub-task 4)

**FR-4.1 — Conversational Interface.** Chat UI where the user asks free-form questions to a **selected persona** one-on-one.

**FR-4.2 — In-Character Memory.** The persona maintains:
- (a) **Profile consistency** — answers never contradict its demographic/psychographic profile.
- (b) **Conversation memory** — references earlier turns, remembers user's questions, builds on prior answers.
- (c) **Behavioral consistency** — expresses attitudes, emotions, and decision heuristics characteristic of the persona archetype.

**FR-4.3 — Turn Management.** Conversation supports ≥ 10+ turns per session; context window managed via rolling summary so memory survives long interviews.

**FR-4.4 — Interview Controls.** Start/end session, view transcript, export transcript, optional "probe deeper" suggestions (AI-generated follow-up question hints for the interviewer).

### 5.5 Insight Extraction Agent (Sub-task 5)

**FR-5.1 — Ingestion.** Agent ingests all survey responses and interview transcripts from an experiment run.

**FR-5.2 — Theme Extraction.** Surfaces recurring themes across personas (e.g., "privacy concern," "price sensitivity," "onboarding friction"), each theme with supporting quote-evidence and the personas/segments where it appears.

**FR-5.3 — Sentiment Breakdown.** Per-persona and per-question sentiment analysis (positive / neutral / negative, or finer-grained), with aggregate breakdown.

**FR-5.4 — Agreement Patterns.** Detects where personas agree/disagree; flags polarizing questions (e.g., 3 personas love feature X, 2 reject it) with divergence summaries.

**FR-5.5 — Behavioral Trends.** Identifies behavioral signals: stated purchase triggers, deal-breakers, usage contexts, channel preferences, and persona-specific decision styles.

**FR-5.6 — Output Format.** Structured JSON + human-readable insight report (themes, charts-ready aggregates, ranked findings).

### 5.6 "Would Use This Product?" Scoring (Sub-task 6)

**FR-6.1 — Per-Persona Score.** Each persona outputs a likelihood score (0–100 or Low/Medium/High) of using the product, derived from its survey answers + interview session.

**FR-6.2 — Segment Aggregation.** Scores aggregated per persona segment (e.g., by archetype, age band, tech-savviness) with distribution (mean, spread).

**FR-6.3 — Reasoning Per Segment.** For each segment, the system generates natural-language reasoning grounded in that segment's actual responses (quotes/themes referenced).

**FR-6.4 — Composite Verdict.** Overall "Would use this product?" score with a one-paragraph executive summary and key adoption blockers/drivers.

### 5.7 Insight Quality Validation (Sub-task 7)

**FR-7.1 — Validation Harness.** Run the Insight Extraction Agent across the Task-3 experiment scenarios plus at least 2 additional varied scenarios.

**FR-7.2 — Human/LLM Evaluation.** Each extracted theme is rated for relevance; each sentiment label spot-checked; target: ≥ 85% relevance. Scores logged per run for comparison.

---

## 6. NON-FUNCTIONAL REQUIREMENTS

| Category | Requirement |
|---|---|
| Performance | Survey: all persona responses returned in ≤ 60s (p95) for 8 personas × 5 questions via parallel generation |
| Scalability | Support up to 20 personas per survey; 50 concurrent interviews |
| Reliability | Graceful degradation if one persona generation fails (retry ×2, then partial results) |
| Observability | Every generation logged (prompt, model, persona, latency, token usage) for debugging and evaluation |
| Safety | Guardrails: personas must not claim to be real humans; sensitive-category handling; refusal behavior consistent with persona |
| UX | Side-by-side grid responsive; interview chat mobile-friendly; reports exportable (PDF/Markdown) |

---

## 7. SYSTEM DESIGN (High Level)

```
User
  ├── Survey Builder → Survey Orchestrator → Parallel Persona Responders (LLM × N)
  │                     └── Response Matrix Store
  ├── Interview Chat → Persona Dialogue Engine (profile + rolling summary + memory)
  │                     └── Transcript Store
  └── Insight Extraction Agent
        ├── Theme/Sentiment/Agreement/Trend Analyzers
        ├── "Would Use?" Scoring Engine (per persona → segment aggregation)
        └── Insight Report Generator (+ evaluation harness)
```

**Core design rules:**
1. Every response is conditioned on the **full persona profile** + **product context**, with an explicit consistency instruction.
2. Interview memory = raw transcript + rolling structured summary (attitudes expressed, facts stated, emotional tone).
3. Insight extraction runs on stored artifacts only (deterministic, re-runnable).
4. LLM-as-judge evaluations are separated from product runtime so validation is repeatable.

---

## 8. USER STORIES & ACCEPTANCE CRITERIA (Selected)

| Story | Acceptance Criteria |
|---|---|
| As a PM, I create a 5-question survey and pick 6 personas, then see all answers side-by-side | All 6 personas answer all 5 questions in parallel; grid renders within 60s; each answer carries persona identity |
| As a researcher, I run consistency validation on a fintech survey | Consistency score per persona displayed; contradictions flagged with explanations |
| As a founder, I interview a "budget-conscious student" persona for 12 turns | Persona references earlier answers, never contradicts its profile, stays in character throughout |
| As an analyst, I generate insights from a completed experiment | Report contains ≥ 3 themes with evidence, sentiment breakdown, agreement map, and behavioral trends |
| As a PM, I check "Would use this product?" scores | Per-segment scores with reasoning, plus composite verdict, all grounded in actual responses |

---

## 9. SUCCESS METRICS

| Metric | Target |
|---|---|
| Survey response generation p95 latency | ≤ 60s (8 personas × 5 questions) |
| Persona consistency score | ≥ 90% |
| Interview in-character rating (evaluator-scored) | ≥ 85% |
| Insight theme relevance | ≥ 85% |
| Extraction reproducibility (run-to-run agreement) | ≥ 90% |
| Scenario coverage validated | ≥ 4 persona archetypes × ≥ 3 product domains |

---

## 10. RISKS & MITIGATIONS

| Risk | Mitigation |
|---|---|
| Generic, undifferentiated persona answers | Persona profiles with specific details (pain points, vocabulary, constraints) + consistency instruction + evaluation suite |
| Persona contradiction across turns | Rolling summary + periodic consistency self-check each turn |
| LLM hallucination of insights | Ground every insight in quoted evidence; citation to response IDs |
| Insight extraction variance | Fixed extraction prompt versions; seed control; run-to-run logging |
| Overclaiming simulated research | UI disclaimer: "Simulated research — validate with real users before decisions" |

---

## 11. DELIVERY PLAN (Suggested 2–3 Week Sprint)

| Phase | Deliverables | Task Coverage |
|---|---|---|
| Phase 1 (Days 1–5) | Survey Mode build + side-by-side UI | Sub-task 1 |
| Phase 2 (Days 4–9) | Consistency validation framework + scenario runner | Sub-tasks 2, 3 |
| Phase 3 (Days 7–12) | Interview Mode with memory | Sub-task 4 |
| Phase 4 (Days 10–15) | Insight Extraction Agent + "Would Use?" scoring | Sub-tasks 5, 6 |
| Phase 5 (Days 13–18) | Full validation across scenarios + evaluation report | Sub-task 7 |

---

## 12. SAMPLE EXPERIMENT SCENARIOS (Ready-to-Run)

1. **Scenario A — "QuickBite" food delivery app:** personas = college student, working parent, fitness enthusiast, budget retiree, busy professional. Questions cover ordering frequency, delivery fee tolerance, feature priorities. Interview the budget retiree on deal-breakers.
2. **Scenario B — "FinFlow" personal finance app:** personas spanning tech-savviness. Focus on trust, security, budgeting habits. Interview the skeptical mid-career user.
3. **Scenario C — "TeamSync" B2B SaaS:** admin, daily end-user, and budget-owner personas; survey on collaboration pain points; interview the end-user on workflow fit.
4. **Scenario D — "PureGlow" D2C skincare:** budget-driven vs. premium-driven persona sets; survey on brand trust, ingredient awareness, price elasticity; run "Would use?" scoring by segment.

---

*End of PRD — ready for build.*
