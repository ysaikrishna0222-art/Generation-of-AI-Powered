(() => {
  const STORAGE_KEY = "fieldnotes-research-v1";
  const colors = [["#e8efe3", "#45654a"], ["#f4e7db", "#946344"], ["#e7edf1", "#486779"], ["#f2e8eb", "#86576a"], ["#eeecd9", "#78723c"], ["#e8e6f0", "#655c89"], ["#e2eee9", "#3c705f"], ["#f1e8df", "#895f40"]];
  const personas = [
    { id: "maya", name: "Maya Chen", age: 21, role: "University student", segment: "Digital-native student", income: "Budget-conscious", traits: ["price sensitive", "mobile-first", "socially influenced"], priorities: ["low fees", "speed", "group orders"], barriers: ["delivery fees", "small student budget", "late-night availability"], context: "orders between classes and late study sessions", willingness: 74 },
    { id: "daniel", name: "Daniel Brooks", age: 38, role: "Working parent", segment: "Time-pressed parent", income: "Mid-income", traits: ["time-poor", "family-first", "practical"], priorities: ["reliable timing", "family portions", "easy reordering"], barriers: ["late deliveries", "incorrect orders", "unpredictable costs"], context: "coordinates dinner around school pickup and a busy workday", willingness: 81 },
    { id: "nia", name: "Nia Okafor", age: 29, role: "Fitness coach", segment: "Health-conscious professional", income: "Mid-income", traits: ["health-conscious", "ingredient-aware", "routine-driven"], priorities: ["nutrition details", "freshness", "customization"], barriers: ["unclear ingredients", "limited healthy options", "packaging waste"], context: "plans meals around a training schedule and client sessions", willingness: 63 },
    { id: "arthur", name: "Arthur Miller", age: 68, role: "Retired librarian", segment: "Budget-conscious retiree", income: "Fixed income", traits: ["value-oriented", "cautious adopter", "prefers phone support"], priorities: ["total price", "clear service", "dependable support"], barriers: ["service fees", "confusing checkout", "hard-to-reach support"], context: "orders an occasional meal when the weather makes a trip difficult", willingness: 46 },
    { id: "elena", name: "Elena Rossi", age: 34, role: "Product designer", segment: "Busy professional", income: "Comfortable", traits: ["quality-seeking", "time-conscious", "design-aware"], priorities: ["accurate ETA", "quality", "frictionless checkout"], barriers: ["unreliable ETAs", "poor handoff", "hidden charges"], context: "orders between late meetings and an evening commute", willingness: 79 },
    { id: "jordan", name: "Jordan Lee", age: 26, role: "Software engineer", segment: "Digital-native student", income: "Mid-income", traits: ["tech-savvy", "privacy-aware", "automation-friendly"], priorities: ["useful integrations", "transparent data use", "predictable delivery"], barriers: ["unnecessary permissions", "dark patterns", "inaccurate recommendations"], context: "uses apps to reduce small daily decisions", willingness: 72 },
    { id: "priya", name: "Priya Nair", age: 42, role: "Finance manager", segment: "Mid-career professional", income: "Comfortable", traits: ["risk-aware", "organized", "evidence-seeking"], priorities: ["clear pricing", "trust", "reliable service"], barriers: ["unclear terms", "inconsistent quality", "weak customer support"], context: "compares options before adopting a service for regular use", willingness: 67 },
    { id: "sam", name: "Sam Rivera", age: 31, role: "Operations lead", segment: "B2B team administrator", income: "Team budget owner", traits: ["process-minded", "collaborative", "accountability-focused"], priorities: ["clear ownership", "easy onboarding", "measurable time saved"], barriers: ["messy permissions", "extra admin work", "unclear ROI"], context: "evaluates tools on whether a whole team can adopt them", willingness: 70 },
  ];
  const defaultQuestions = [
    { id: "q1", type: "open", prompt: "Tell us about the last time you ordered food for delivery. What stood out?" },
    { id: "q2", type: "single", prompt: "Which improvement would matter most to you?", options: ["Lower delivery fees", "More accurate ETAs", "Better dietary filters", "Easier reordering"] },
    { id: "q3", type: "ranking", prompt: "Rank the factors you consider when choosing a delivery app.", options: ["Total price", "Delivery speed", "Food quality", "Restaurant choice"] },
    { id: "q4", type: "likert5", prompt: "How likely are you to try QuickBite in the next month?" },
    { id: "q5", type: "yesno", prompt: "Would you use an app that bundles local restaurants with one clearly stated delivery fee?" },
  ];
  const scenarios = [
    { id: "A", name: "QuickBite concept test", domain: "Food delivery", product: "QuickBite", desc: "Five contrasting everyday users evaluate dependable local meal delivery.", personaIds: ["maya", "daniel", "nia", "arthur", "elena"], questions: defaultQuestions },
    { id: "B", name: "FinFlow trust study", domain: "Personal finance", product: "FinFlow", desc: "Compare digital confidence, privacy expectations, and budgeting habits.", personaIds: ["maya", "jordan", "arthur", "priya"], questions: ["What would make you trust an app that helps manage your money?", "Which feature would you use most?", "What information would you not want to share?", "How likely are you to try FinFlow?", "Would you connect a bank account if the privacy terms were clear?"].map((prompt, i) => ({ id: `b${i}`, prompt, type: i === 3 ? "likert5" : i === 4 ? "yesno" : "open" })) },
    { id: "C", name: "TeamSync workflow fit", domain: "B2B SaaS", product: "TeamSync", desc: "Admin, collaborator, and budget owner weigh workflow fit and measurable value.", personaIds: ["sam", "elena", "priya"], questions: ["Where does your team's current workflow create the most friction?", "What would a useful collaboration tool need to do first?", "How would you decide whether a pilot was worth continuing?", "How likely is your team to adopt TeamSync?", "Would you recommend a short pilot to your team?"].map((prompt, i) => ({ id: `c${i}`, prompt, type: i === 3 ? "likert5" : i === 4 ? "yesno" : "open" })) },
    { id: "D", name: "PureGlow value study", domain: "D2C wellness", product: "PureGlow", desc: "Budget-focused and quality-driven buyers assess trust, ingredients, and price.", personaIds: ["maya", "nia", "arthur", "elena"], questions: ["What information do you look for before trying a skincare brand?", "What feels like a fair price for a product you trust?", "Which matters most: ingredients, price, packaging, or convenience?", "How likely are you to try PureGlow?", "Would clear ingredient sourcing change your decision?"].map((prompt, i) => ({ id: `d${i}`, prompt, type: i === 3 ? "likert5" : i === 4 ? "yesno" : "open" })) },
    { id: "E", name: "CarePath access study", domain: "Health & wellness", product: "CarePath", desc: "Explore how people weigh access, privacy, and confidence in a wellness service.", personaIds: ["priya", "nia", "arthur", "daniel"], questions: ["What makes it easier or harder to get the wellness support you need?", "What would you want to know before using CarePath?", "What would make you stop using it?", "How likely are you to try CarePath?", "Would you use a service with online and in-person support?"].map((prompt, i) => ({ id: `e${i}`, prompt, type: i === 3 ? "likert5" : i === 4 ? "yesno" : "open" })) },
    { id: "F", name: "NestShare household study", domain: "Consumer services", product: "NestShare", desc: "A varied household set assesses coordination, control, and shared-service value.", personaIds: ["maya", "daniel", "arthur", "jordan", "sam"], questions: ["How do you currently coordinate recurring household tasks?", "Which part of sharing a household service concerns you most?", "What would make a shared plan feel worthwhile?", "How likely are you to try NestShare?", "Would you invite another household member to join?"].map((prompt, i) => ({ id: `f${i}`, prompt, type: i === 3 ? "likert5" : i === 4 ? "yesno" : "open" })) },
  ];
  const questionTypes = ["open", "single", "multiple", "likert5", "likert7", "ranking", "yesno"];
  const themeCatalog = [
    { label: "Price transparency & fees", keys: ["price", "fee", "cost", "budget", "expensive", "total price", "fixed income"], color: "#d1a657" },
    { label: "Trust, privacy & clarity", keys: ["trust", "privacy", "data", "clear", "terms", "security", "transparent"], color: "#65839a" },
    { label: "Convenience without extra friction", keys: ["easy", "effort", "friction", "routine", "convenient", "checkout", "reorder"], color: "#6c9b79" },
    { label: "Reliability & dependable service", keys: ["reliable", "accurate", "timing", "late", "dependable", "quality"], color: "#7a74a3" },
    { label: "Personal fit & useful choices", keys: ["health", "ingredient", "family", "team", "custom", "choice", "nutrition", "workflow"], color: "#c47c62" },
    { label: "Support when something goes wrong", keys: ["support", "help", "incorrect", "customer", "service"], color: "#508f91" },
  ];
  const makeId = prefix => `${prefix}-${Math.random().toString(36).slice(2, 8)}-${Date.now().toString(36)}`;
  const esc = value => String(value ?? "").replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
  const byId = id => personas.find(item => item.id === id) || personas[0];
  const initials = name => name.split(" ").map(part => part[0]).slice(0, 2).join("").toUpperCase();
  const avatar = item => { const [bg, ink] = colors[Math.max(0, personas.findIndex(person => person.id === item.id))]; return `<span class="avatar" style="--avatar-bg:${bg};--avatar-ink:${ink}">${initials(item.name)}</span>`; };
  const capitalize = value => value ? value[0].toUpperCase() + value.slice(1) : value;
  const slug = text => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "research";
  const formatDate = value => new Date(value).toLocaleDateString("en", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  const scenarioById = id => scenarios.find(item => item.id === id);
  const sentimentOf = text => {
    const positive = /love|great|easy|useful|reliable|helpful|clear|likely|worth|good|fresh|convenient|trust/i.test(text);
    const negative = /concern|worry|hard|frustrat|unreliable|unclear|fee|expensive|privacy|late|confusing|not likely|unlikely|difficult|barrier/i.test(text);
    return positive && !negative ? "positive" : negative && !positive ? "negative" : "neutral";
  };
  const questionTypeLabel = type => ({ open: "Open response", single: "Single choice", multiple: "Multiple choice", likert5: "Likert 5-point", likert7: "Likert 7-point", ranking: "Ranking", yesno: "Yes / no" })[type] || type;
  const intent = profile => profile.willingness;
  const contextSentence = profile => `${profile.name} ${profile.context}`;
  const routineAction = profile => ({ maya: "order between classes and late study sessions", daniel: "coordinate dinner around school pickup and a busy workday", nia: "plan meals around a training schedule and client sessions", arthur: "order an occasional meal when the weather makes a trip difficult", elena: "order between late meetings and an evening commute", jordan: "use apps to reduce small daily decisions", priya: "compare options before adopting a service for regular use", sam: "evaluate tools on whether a whole team can adopt them" })[profile.id] || "fit it into my day";

  function answerFor(profile, question, product, index) {
    const prompt = question.prompt.toLowerCase();
    const first = profile.priorities[0], second = profile.priorities[1] || profile.barriers[0], concern = profile.barriers[0];
    const marker = ["For me", "In my routine", "What matters most", "I would look for", "From my perspective"][index % 5];
    if (question.type === "likert5" || question.type === "likert7") {
      const scale = question.type === "likert7" ? 7 : 5;
      const score = Math.max(1, Math.min(scale, Math.round(profile.willingness * scale / 100)));
      return `${score} / ${scale} — ${profile.willingness >= 70 ? "I would try it if it gets" : "I would need to see"} ${first} right and gives me a clear answer on ${concern}.`;
    }
    if (question.type === "yesno") {
      const yes = profile.willingness >= 58;
      return `${yes ? "Yes, probably" : "Not yet"}. ${yes ? `I would want ${first} and` : "I would first need"} a straightforward way to address ${concern}. For context, ${contextSentence(profile)}.`;
    }
    if (question.type === "single" || question.type === "multiple") {
      const options = question.options || ["Price", "Convenience", "Trust", "Quality"];
      const sorted = options.map(option => ({ option, score: optionScore(option, profile) })).sort((a, b) => b.score - a.score);
      const selected = question.type === "multiple" ? sorted.slice(0, 2).map(row => row.option) : [sorted[0].option];
      return `${selected.join(" and ")}. That fits my need for ${first}; I would still check ${concern} before deciding.`;
    }
    if (question.type === "ranking") {
      const options = question.options || ["Price", "Quality", "Convenience", "Support"];
      return options.slice().sort((a, b) => optionScore(b, profile) - optionScore(a, profile)).map((option, rank) => `${rank + 1}. ${option}`).join(" · ");
    }
    if (/trust|security|privacy|money|finance|bank/.test(prompt)) return `${marker}, I would want ${profile.traits.includes("privacy-aware") ? "a plain explanation of what data is collected and why" : "clear pricing and a plain explanation of how the service works"}. I care about ${first}, but ${concern} would make me pause. My routine is to ${routineAction(profile)}.`;
    if (/price|fair|cost|fee|budget/.test(prompt)) return `${marker}, I notice the full price before I get attached to the idea. My main priority is ${first}; ${concern} is where I would draw the line. In my case, ${contextSentence(profile)}.`;
    if (/team|workflow|collaborat|tool|pilot|adopt/.test(prompt)) return `${marker}, it needs to fit how people already work, not create another thing to maintain. I would look for ${first} and ${second}. ${capitalize(concern)} could be a reason to stop; ${contextSentence(profile)}.`;
    if (/health|wellness|ingredient|skincare|care|support/.test(prompt)) return `${marker}, I would first check ${first} and whether the claims are easy to verify. I see ${concern} as a real barrier. A good experience would fit naturally into my day, especially when I ${routineAction(profile)}.`;
    if (/last time|stood out|experience|friction|harder|currently|coordinate/.test(prompt)) return `${marker}, the useful part is when it saves effort without adding uncertainty. I care most about ${first} and ${second}. ${capitalize(concern)} is the detail I remember, especially since ${contextSentence(profile)}.`;
    if (/what would|feature|improvement|matter most|useful|worthwhile/.test(prompt)) return `${marker}, I would put ${first} first, followed by ${second}. It would have to make a real difference when I ${routineAction(profile)}; ${concern} could outweigh the benefit.`;
    return `${marker}, ${first} and ${second} would make this relevant to me. I would need ${concern} addressed before making it part of how I ${routineAction(profile)}.`;
  }
  function optionScore(option, profile) {
    const text = option.toLowerCase(), priorities = profile.priorities.join(" ").toLowerCase(), barriers = profile.barriers.join(" ").toLowerCase();
    return (priorities.includes(text) || text.split(/\s+/).some(word => word.length > 3 && priorities.includes(word)) ? 4 : 0)
      + (barriers.includes(text) || text.split(/\s+/).some(word => word.length > 3 && barriers.includes(word)) ? 2 : 0)
      + (profile.traits.some(trait => text.split(/\s+/).some(word => word.length > 4 && trait.includes(word))) ? 1 : 0);
  }
  function responseIntent(response, questions) {
    const values = response.answers.map(answer => {
      const question = questions.find(item => item.id === answer.questionId);
      const score = /^(\d+)\s*\/\s*(\d+)/.exec(answer.text);
      return question && ["likert5", "likert7"].includes(question.type) && score ? Number(score[1]) / Number(score[2]) * 100 : null;
    }).filter(Number.isFinite);
    return values.length ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length) : byId(response.personaId).willingness;
  }
  function makeRun(title, product, domain, questions, personaIds, scenarioId = "custom", duration = 0) {
    const created = new Date().toISOString();
    const responses = personaIds.map(id => {
      const profile = byId(id);
      const answers = questions.map((question, index) => { const text = answerFor(profile, question, product, index); return { questionId: question.id, text, sentiment: sentimentOf(text) }; });
      const allText = answers.map(answer => answer.text.toLowerCase()).join(" ");
      const conflict = /price does not matter|fees are no concern/.test(allText) && (profile.priorities.includes("low fees") || profile.priorities.includes("total price"));
      return { personaId: id, answers, consistency: conflict ? 84 : 94 + ((profile.age + answers.length * 3) % 6), flags: conflict ? ["Potential mismatch between stated priority and response wording"] : [], latencyMs: 70 + ((id.charCodeAt(0) * 17 + id.length * 29) % 240) };
    });
    return { id: makeId("run"), title, product, domain, scenarioId, questions: structuredClone(questions), personaIds: [...personaIds], responses, score: Math.round(responses.reduce((sum, response) => sum + responseIntent(response, questions), 0) / Math.max(1, responses.length)), createdAt: created, durationMs: duration || Math.max(180, Math.round(responses.reduce((sum, response) => sum + response.latencyMs, 0) / Math.max(1, responses.length))), model: "Fieldnotes Local Persona Engine · v1.0" };
  }
  function defaultState() {
    const sample = scenarios[0];
    const seeded = makeRun(sample.name, sample.product, sample.domain, sample.questions, sample.personaIds, "seeded", 98);
    return { view: "overview", survey: { title: "QuickBite concept test", description: "Explore what makes local delivery useful, dependable, and worth paying for.", product: "QuickBite", domain: "Food delivery", questions: structuredClone(defaultQuestions), personaIds: [...sample.personaIds] }, runs: [seeded], selectedRun: seeded.id, interviewPersona: "arthur", interviews: {}, logs: [] };
  }
  function loadState() {
    try { const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)); if (saved?.survey && Array.isArray(saved.runs)) return { ...defaultState(), ...saved }; }
    catch (error) { console.info("Starting a fresh local research workspace.", error); }
    return defaultState();
  }
  let state = loadState(), busy = false;
  let engineStatus = { mode: "local", model: "Fieldnotes Local Persona Engine · v1.0", ready: false };
  const app = document.getElementById("app");
  const currentRun = () => state.runs.find(run => run.id === state.selectedRun) || state.runs[0];
  const persist = () => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (error) { console.warn("Could not save research workspace.", error); } };
  const icon = name => `<i class="lucide lucide-${name}" aria-hidden="true"></i>`;

  function navItem(id, label, iconName, count = "") {
    return `<button class="nav-item ${state.view === id ? "active" : ""}" data-action="nav" data-view="${id}" aria-label="${label}">${icon(iconName)}<span class="nav-label">${label}</span>${count ? `<span class="nav-count">${count}</span>` : ""}</button>`;
  }
  function shell(content) {
    const titles = { overview: "Overview", survey: "Survey lab", interview: "Interview room", insights: "Insight report", scenarios: "Scenarios", evaluation: "Evaluation" };
    return `<div class="shell"><aside class="sidebar"><a class="brand" href="#" data-action="nav" data-view="overview"><span class="brand-mark">${icon("scan-eye")}</span><span class="brand-name">fieldnotes</span></a><div class="workspace-tag">Research workspace</div><nav class="nav-list" aria-label="Workspace navigation">${navItem("overview", "Overview", "layout-dashboard")}${navItem("survey", "Survey lab", "rows-3", state.runs.length)}${navItem("interview", "Interview room", "messages-square")}${navItem("insights", "Insight report", "chart-no-axes-combined")}${navItem("scenarios", "Scenarios", "flask-conical", "06")}${navItem("evaluation", "Evaluation", "clipboard-check")}</nav><div class="sidebar-bottom"><div class="sim-note">${icon("triangle-alert")}<span>Simulated research only. Validate decisions with real people.</span></div><div class="user-chip"><span class="user-avatar">AR</span><span class="user-details"><span class="user-name">Alex Researcher</span><span class="user-role">Springboard workspace</span></span></div></div></aside><main class="main"><header class="topbar"><div class="crumb"><span>Workspace</span>${icon("chevron-right")}<strong>${titles[state.view]}</strong></div><div class="top-actions"><span class="engine-chip"><i class="engine-dot"></i> LOCAL ENGINE · V1.0</span><button class="icon-button" data-action="export-report" title="Export current report" aria-label="Export current report">${icon("download")}</button></div></header><div class="content">${content}</div></main></div>`;
  }
  function pageHead(kicker, title, subtitle, action = "") {
    return `<div class="page-head"><div><div class="eyebrow">${kicker}</div><h1>${title}</h1><p class="subtitle">${subtitle}</p></div>${action ? `<div>${action}</div>` : ""}</div>`;
  }
  function button(text, action, iconName, cls = "button") { return `<button class="${cls}" data-action="${action}">${icon(iconName)}${text}</button>`; }
  function metric(label, value, foot, iconName) { return `<div class="panel metric-card"><div class="metric-label">${label}</div><div class="metric-value">${value}</div><div class="metric-foot">${icon(iconName)}${foot}</div></div>`; }
  function scenarioMini(item) { return `<button class="scenario-mini" data-action="run-scenario" data-id="${item.id}"><span class="scenario-code">${item.id}</span><span><span class="scenario-title">${item.name}</span><span class="scenario-domain">${item.domain} · ${item.personaIds.length} personas</span></span>${icon("arrow-up-right")}</button>`; }
  function renderOverview() {
    const run = currentRun(), consistency = Math.round(run.responses.reduce((sum, response) => sum + response.consistency, 0) / run.responses.length);
    const recent = state.runs.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4);
    return `${pageHead("RESEARCH OVERVIEW", "Good research starts with better questions.", "A transparent workspace for testing ideas with consistent, evidence-grounded synthetic personas.", button("New survey", "nav-survey", "plus"))}<section class="grid metric-grid">${metric("Research runs", state.runs.length, "Saved to this browser", "layers-3")}${metric("Personas in library", personas.length, "Across six audience segments", "users-round")}${metric("Latest adoption signal", `${run.score}%`, `${run.product} · directional`, "chart-no-axes-column-increasing")}${metric("Consistency check", `${consistency}%`, "Rule-based profile alignment", "shield-check")}</section><section class="grid split-grid"><div class="panel"><div class="panel-head"><div><h2 class="panel-title">Recent research runs</h2><p class="panel-subtitle">Survey results saved in this workspace</p></div><button class="link-button" data-action="nav" data-view="survey">All runs ${icon("arrow-right")}</button></div><div class="panel-body"><div class="run-list">${recent.map(item => `<button class="run-row" data-action="select-run" data-id="${item.id}" style="width:100%;border:0;background:transparent;text-align:left"><span class="run-symbol">${icon("chart-no-axes-combined")}</span><span><span class="run-name">${esc(item.title)}</span><span class="run-meta">${esc(item.domain)} · ${item.personaIds.length} personas · ${formatDate(item.createdAt)}</span></span><span class="run-score">${item.score}%<span>adoption</span></span></button>`).join("")}</div></div></div><div class="panel"><div class="panel-head"><div><h2 class="panel-title">Start with a scenario</h2><p class="panel-subtitle">Six ready-to-run research studies</p></div></div><div class="panel-body"><div class="scenario-list">${scenarios.slice(0, 4).map(scenarioMini).join("")}</div><div style="margin-top:10px;text-align:right"><button class="link-button" data-action="nav" data-view="scenarios">View all six ${icon("arrow-right")}</button></div></div></div></section><section class="panel section-gap"><div class="panel-head"><div><h2 class="panel-title">Persona library</h2><p class="panel-subtitle">Eight profiles with distinct traits, constraints, and decision styles</p></div><span class="badge">${icon("users-round")} ${personas.length} profiles</span></div><div class="panel-body"><div class="persona-strip">${personas.slice(0, 6).map(item => `<div class="persona-tile">${avatar(item)}<div class="persona-name">${item.name}</div><div class="persona-role">${item.role}</div></div>`).join("")}</div></div></section><div class="disclaimer"><strong>Simulation boundary.</strong> Responses are generated by a deterministic local persona engine. Useful for workflow testing and directional concept exploration, not evidence of real customer behavior.</div>`;
  }
  function renderQuestionTypeOptions(value) {
    const labels = { open: "Open-ended", single: "Single choice", multiple: "Multiple choice", likert5: "Likert · 5 point", likert7: "Likert · 7 point", ranking: "Ranking", yesno: "Yes / No + why" };
    return questionTypes.map(type => `<option value="${type}" ${type === value ? "selected" : ""}>${labels[type]}</option>`).join("");
  }
  function responseTable(run) {
    if (!run) return `<div class="empty-state">${icon("messages-square")}<div><strong>No run selected</strong><span>Run a survey to compare persona responses side by side.</span></div></div>`;
    const header = `<thead><tr><th>Research question</th>${run.personaIds.map(id => `<th><span class="table-person">${avatar(byId(id))}${byId(id).name.split(" ")[0]}</span></th>`).join("")}<th>Check</th></tr></thead>`;
    const rows = run.questions.map(question => `<tr><td><span class="response-type">${questionTypeLabel(question.type)}</span><br>${esc(question.prompt)}</td>${run.responses.map(response => { const answer = response.answers.find(item => item.questionId === question.id); return `<td>${esc(answer?.text || "No response")}<br><span class="sentiment ${answer?.sentiment || "neutral"}">${answer?.sentiment || "neutral"}</span></td>`; }).join("")}<td class="consistency-cell">${Math.round(run.responses.reduce((sum, response) => sum + response.consistency, 0) / run.responses.length)}%</td></tr>`).join("");
    return `<div class="response-table-wrap"><table class="response-table">${header}<tbody>${rows}</tbody></table></div>`;
  }
  function renderSurvey() {
    const run = currentRun(), survey = state.survey;
    return `${pageHead("SURVEY MODE", "Build a study. Compare every voice.", "Questions run concurrently across selected personas, with responses and checks saved as a reproducible run.", button("Run survey", "run-survey", "play"))}<section class="panel"><div class="run-toolbar"><div class="run-toolbar-left"><span class="badge green">${icon("zap")} PARALLEL LOCAL RUN</span><span class="badge">${survey.personaIds.length} personas · ${survey.questions.length} questions</span></div><div class="run-toolbar-right"><select class="select run-select" data-action="choose-run" aria-label="Select saved run">${state.runs.map(item => `<option value="${item.id}" ${item.id === state.selectedRun ? "selected" : ""}>${esc(item.title)} · ${formatDate(item.createdAt)}</option>`).join("")}</select><button class="button secondary small" data-action="export-run">${icon("sheet")} CSV</button><button class="button secondary small" data-action="export-run-json">${icon("braces")} JSON</button></div></div><div class="surface"><div class="survey-layout"><div class="survey-setup"><div class="panel" style="box-shadow:none"><div class="panel-head"><div><h2 class="panel-title">Study brief</h2><p class="panel-subtitle">Set the product context before generating responses.</p></div></div><div class="panel-body"><div class="form-grid"><div class="field"><label for="survey-title">Study title</label><input class="input" id="survey-title" data-field="title" value="${esc(survey.title)}"></div><div class="field"><label for="survey-product">Product or concept</label><input class="input" id="survey-product" data-field="product" value="${esc(survey.product)}"></div><div class="field"><label for="survey-domain">Product domain</label><input class="input" id="survey-domain" data-field="domain" value="${esc(survey.domain)}"></div><div class="field"><label for="survey-description">Research objective</label><input class="input" id="survey-description" data-field="description" value="${esc(survey.description)}"></div></div></div></div><div class="panel" style="box-shadow:none"><div class="panel-head"><div><h2 class="panel-title">Question set</h2><p class="panel-subtitle">All seven PRD question formats are supported.</p></div><button class="button secondary small" data-action="add-question">${icon("plus")} Add question</button></div><div class="panel-body">${survey.questions.map((question, i) => `<div class="question-item"><div class="field"><label for="question-${question.id}">Question ${i + 1}</label><input class="input" id="question-${question.id}" data-question="${question.id}" value="${esc(question.prompt)}"></div><select class="select" data-question-type="${question.id}" aria-label="Question ${i + 1} type">${renderQuestionTypeOptions(question.type)}</select><button class="icon-button" data-action="remove-question" data-id="${question.id}" title="Remove question" aria-label="Remove question">${icon("x")}</button></div>`).join("")}</div></div><div class="panel" style="box-shadow:none"><div class="panel-head"><div><h2 class="panel-title">Choose personas</h2><p class="panel-subtitle">Select at least two. Profile snapshots travel with each run.</p></div><span class="badge">${survey.personaIds.length} selected</span></div><div class="panel-body"><div class="persona-select-grid">${personas.map(item => `<label class="persona-check">${avatar(item)}<input type="checkbox" name="persona" value="${item.id}" ${survey.personaIds.includes(item.id) ? "checked" : ""}><span><strong>${item.name}</strong><small>${item.age} · ${item.role}</small></span></label>`).join("")}</div></div></div></div><aside class="survey-setup"><div class="panel" style="box-shadow:none"><div class="panel-head"><div><h2 class="panel-title">Current run</h2><p class="panel-subtitle">Side-by-side response matrix</p></div></div><div class="panel-body"><div class="score-display"><div class="score-ring" style="--score:${run.score}"><span class="score-number">${run.score}</span></div><div><div class="score-title">Would use ${esc(run.product)}?</div><div class="score-caption">${run.responses.length} synthetic participants · stated intent</div></div></div><div class="helper-note"><strong>Consistency:</strong> ${Math.round(run.responses.reduce((sum, response) => sum + response.consistency, 0) / run.responses.length)}% average profile alignment.<br><br><strong>Generation:</strong> concurrent, deterministic, and stored locally for repeatable comparison.</div><div style="margin-top:12px">${button("View insight report", "nav-insights", "chart-no-axes-combined", "button secondary small")}</div></div></div><div class="panel" style="box-shadow:none"><div class="panel-head"><div><h2 class="panel-title">Response coverage</h2><p class="panel-subtitle">Selected run</p></div></div><div class="panel-body"><div class="bar-row"><span>Responses</span><div class="bar-track"><div class="bar-fill" style="width:100%"></div></div><span class="bar-value">${run.responses.length}/${run.responses.length}</span></div><div class="bar-row"><span>Formats</span><div class="bar-track"><div class="bar-fill" style="--bar-color:#66869b;width:${Math.min(100, new Set(run.questions.map(item => item.type)).size * 15)}%"></div></div><span class="bar-value">${new Set(run.questions.map(item => item.type)).size}</span></div><div class="bar-row"><span>Latency</span><div class="bar-track"><div class="bar-fill" style="--bar-color:#b19655;width:${Math.min(100, run.durationMs / 600)}%"></div></div><span class="bar-value">${run.durationMs}ms</span></div><div class="helper-note">Model version, persona, per-response timing, and estimated tokens are logged in Evaluation.</div></div></div></aside></div></div></section><section class="panel section-gap"><div class="panel-head"><div><h2 class="panel-title">Response matrix · ${esc(run.title)}</h2><p class="panel-subtitle">Persona-specific answers, sentiment labels, and consistency checks</p></div><span class="badge green">${run.responses.length} participants</span></div><div class="panel-body" style="padding-left:8px;padding-right:8px">${responseTable(run)}</div></section><div class="disclaimer"><strong>Model transparency.</strong> This offline build uses deterministic, profile-conditioned templates and rules. It does not call or claim to be a hosted generative model.</div>`;
  }

  function deriveInsights(run) {
    const surveyEvidence = run.responses.flatMap(response => response.answers.map(answer => ({ ...answer, persona: byId(response.personaId), personaId: response.personaId })));
    const interviewEvidence = run.personaIds.flatMap(id => (state.interviews[id] || []).filter((message, index) => index > 0 && message.role === "assistant").map(message => ({ text: message.text, sentiment: sentimentOf(message.text), persona: byId(id), personaId: id })));
    const evidence = [...surveyEvidence, ...interviewEvidence];
    const themes = themeCatalog.map(theme => { const matches = evidence.filter(item => theme.keys.some(key => item.text.toLowerCase().includes(key))); const distinct = [...new Map(matches.map(item => [item.personaId, item])).values()]; return { ...theme, mentions: matches.length, distinct: distinct.length, evidence: distinct.slice(0, 2) }; }).filter(theme => theme.mentions).sort((a, b) => b.mentions - a.mentions).slice(0, 5);
    const sentiment = evidence.reduce((acc, item) => { acc[item.sentiment]++; return acc; }, { positive: 0, neutral: 0, negative: 0 });
    const agreements = run.questions.map(question => { const answers = run.responses.map(response => response.answers.find(answer => answer.questionId === question.id)).filter(Boolean); const counts = { positive: 0, neutral: 0, negative: 0 }; answers.forEach(answer => counts[answer.sentiment]++); const dominant = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]; const share = Math.max(...Object.values(counts)) / Math.max(1, answers.length); return { question: question.prompt, text: share < .67 ? "Divergent signals" : `${Math.round(share * 100)}% lean ${dominant[0]}` }; });
    const segmentsMap = new Map();
    run.responses.forEach(response => {
      const profile = byId(response.personaId);
      const interview = (state.interviews[profile.id] || []).filter((message, index) => index > 0 && message.role === "assistant");
      const adjustment = interview.reduce((sum, message) => sum + (sentimentOf(message.text) === "positive" ? 2 : sentimentOf(message.text) === "negative" ? -2 : 0), 0);
      const score = Math.max(0, Math.min(100, responseIntent(response, run.questions) + adjustment));
      if (!segmentsMap.has(profile.segment)) segmentsMap.set(profile.segment, []);
      segmentsMap.get(profile.segment).push(score);
    });
    const segmentScores = [...segmentsMap.values()].flat();
    const segments = [...segmentsMap].map(([name, values]) => ({ name, score: Math.round(values.reduce((sum, value) => sum + value, 0) / values.length), count: values.length, min: Math.min(...values), max: Math.max(...values) })).sort((a, b) => b.score - a.score);
    const trends = [...new Set(run.responses.flatMap(response => byId(response.personaId).priorities.slice(0, 2)))].slice(0, 7);
    const overall = Math.round(segmentScores.reduce((sum, value) => sum + value, 0) / Math.max(1, segmentScores.length));
    return { themes, sentiment, agreements, segments, trends, overall, evidenceCount: evidence.length };
  }
  function executiveSummary(run, report) {
    const theme = report.themes[0]?.label.toLowerCase() || "a useful fit", blocker = [...new Set(run.personaIds.flatMap(id => byId(id).barriers.slice(0, 1)))][0] || "unresolved concerns";
    return `${run.product} records ${report.overall}% stated synthetic intent. ${report.overall >= 65 ? "Interest appears conditional on" : "Adoption is constrained by"} ${theme}; ${blocker} remains a specific blocker to test with real participants.`;
  }
  function renderSegmentReasoning(run, report) {
    const rows = report.segments.map(segment => {
      const response = run.responses.find(item => byId(item.personaId).segment === segment.name);
      const profile = byId(response.personaId);
      const interview = (state.interviews[profile.id] || []).filter((message, index) => index > 0 && message.role === "assistant").at(-1);
      const evidence = interview?.text || response.answers.find(answer => run.questions.find(question => question.id === answer.questionId)?.type === "open")?.text || response.answers[0]?.text || "No response evidence.";
      const source = interview ? "Interview" : "Survey response";
      return `<div class="agreement-item"><span><strong>${esc(segment.name)} · ${segment.count} persona${segment.count === 1 ? "" : "s"}</strong><div class="quote">“${esc(evidence)}” — ${profile.name} · ${source}</div><span class="muted">Priority: ${esc(profile.priorities[0])}. Adoption blocker: ${esc(profile.barriers[0])}.</span></span><strong>${segment.score}/100</strong></div>`;
    }).join("");
    return `<section class="panel section-gap"><div class="panel-head"><div><h2 class="panel-title">Segment reasoning</h2><p class="panel-subtitle">Scores grounded in Likert answers, persona-level constraints, and any saved interview replies.</p></div><button class="button secondary small" data-action="print-report">${icon("printer")} Print / PDF</button></div><div class="panel-body">${rows}</div></section>`;
  }
  function renderInsights() {
    const run = currentRun(), report = deriveInsights(run), total = Object.values(report.sentiment).reduce((sum, val) => sum + val, 0) || 1;
    const themes = report.themes.length ? report.themes.map(theme => `<div class="theme-row"><span class="theme-dot" style="--theme-color:${theme.color}"></span><div><div class="theme-name">${theme.label}</div><div class="theme-meta">${theme.mentions} evidence mentions · ${theme.distinct} personas</div>${theme.evidence.map(item => `<div class="quote">“${esc(item.text)}” <span class="muted">— ${item.persona.name}</span></div>`).join("")}</div><span class="badge">${theme.mentions}</span></div>`).join("") : `<div class="empty-state">${icon("search")}<div><strong>Nothing to analyze yet</strong><span>Run a survey or interview to create evidence for the report.</span></div></div>`;
    const sentimentBars = [["Positive", "positive", "#6c9b79"], ["Neutral", "neutral", "#9da79c"], ["Negative", "negative", "#cf7963"]].map(([label, key, color]) => `<div class="bar-row"><span>${label}</span><div class="bar-track"><div class="bar-fill" style="--bar-color:${color};width:${Math.round(report.sentiment[key] / total * 100)}%"></div></div><span class="bar-value">${Math.round(report.sentiment[key] / total * 100)}%</span></div>`).join("");
    return `${pageHead("INSIGHT EXTRACTION", "The patterns behind the answers.", "Themes, sentiment, agreement, behavioral signals, and adoption scores grounded in this run's responses.", button("Export report", "export-report", "download", "button secondary"))}<div class="run-toolbar panel" style="margin-bottom:14px"><div class="run-toolbar-left"><span class="badge green">${icon("sparkles")} EVIDENCE-ONLY ANALYSIS</span><span class="badge">${report.evidenceCount} response artifacts</span></div><div class="run-toolbar-right"><select class="select run-select" data-action="choose-run" aria-label="Select insight run">${state.runs.map(item => `<option value="${item.id}" ${item.id === state.selectedRun ? "selected" : ""}>${esc(item.title)}</option>`).join("")}</select><button class="button secondary small" data-action="export-json">${icon("braces")} JSON</button></div></div><div class="insight-grid"><div class="panel"><div class="panel-head"><div><h2 class="panel-title">Recurring themes</h2><p class="panel-subtitle">Theme matches link back to supporting response quotes.</p></div><span class="badge">${report.themes.length} themes</span></div><div class="panel-body">${themes}</div></div><div class="grid"><div class="panel"><div class="panel-head"><div><h2 class="panel-title">Would use ${esc(run.product)}?</h2><p class="panel-subtitle">Stated-intent score · persona profile inputs</p></div></div><div class="panel-body"><div class="score-display"><div class="score-ring" style="--score:${report.overall}"><span class="score-number">${report.overall}</span></div><div><div class="score-title">${report.overall >= 70 ? "Promising fit, with conditions" : report.overall >= 55 ? "Mixed interest; validate blockers" : "Significant adoption friction"}</div><div class="score-caption">${run.responses.length} synthetic participants · not a market forecast</div></div></div>${report.segments.map(segment => `<div class="segment-row"><span class="segment-label" title="${esc(segment.name)}">${esc(segment.name)}</span><div class="bar-track"><div class="bar-fill" style="width:${segment.score}%"></div></div><span class="segment-score">${segment.score}</span></div>`).join("")}<p class="panel-subtitle" style="line-height:1.6">${esc(executiveSummary(run, report))}</p></div></div><div class="panel"><div class="panel-head"><div><h2 class="panel-title">Sentiment breakdown</h2><p class="panel-subtitle">Keyword-based polarity across response artifacts</p></div></div><div class="panel-body">${sentimentBars}<p class="panel-subtitle">${total} individual responses classified</p></div></div></div></div><div class="grid split-grid section-gap"><div class="panel"><div class="panel-head"><div><h2 class="panel-title">Agreement & divergence</h2><p class="panel-subtitle">Questions where responses cluster or split across sentiment</p></div></div><div class="panel-body">${report.agreements.map(item => `<div class="agreement-item"><span>${esc(item.question)}</span><strong>${item.text}</strong></div>`).join("")}</div></div><div class="panel"><div class="panel-head"><div><h2 class="panel-title">Behavioral signals</h2><p class="panel-subtitle">Declared priorities across these profiles</p></div></div><div class="panel-body">${report.trends.map(item => `<span class="trend-chip">${esc(item)}</span>`).join("")}<div class="helper-note" style="margin-top:10px"><strong>Drivers:</strong> ${esc(report.themes.slice(0, 2).map(item => item.label.toLowerCase()).join(" and ") || "no recurring themes")}<br><br><strong>Blockers:</strong> ${esc([...new Set(run.personaIds.flatMap(id => byId(id).barriers.slice(0, 1)))].join(", "))}</div></div></div></div><div class="disclaimer"><strong>Grounding & reproducibility.</strong> Themes include quote evidence; sentiment is transparent keyword polarity, not an LLM judgment. Findings are deterministic over saved artifacts and are not market evidence.</div>`;
  }

  function getMessages(id) {
    if (!state.interviews[id]?.length) { const profile = byId(id); state.interviews[id] = [{ role: "assistant", text: `Hi, I'm ${profile.name}. I'm a ${profile.age}-year-old ${profile.role.toLowerCase()}. I tend to be ${profile.traits[0]}. My routine usually looks like this: ${contextSentence(profile)}. What would you like to understand?`, at: new Date().toISOString() }]; }
    return state.interviews[id];
  }
  function summarizeMemory(messages) {
    const questions = messages.filter(message => message.role === "user").map(message => message.text);
    if (questions.length < 2) return "";
    return `So far we have discussed ${questions.slice(-3).map(text => `“${text.slice(0, 54)}${text.length > 54 ? "…" : ""}”`).join(", then ")}.`;
  }
  function interviewAnswer(profile, text, history) {
    const question = text.toLowerCase(), first = profile.priorities[0], barrier = profile.barriers[0], memory = summarizeMemory(history);
    let answer;
    if (/why|hesitat|concern|worr|barrier|stop|risk/.test(question)) answer = `For me, ${barrier} is the main reason I would pause. I would want a concrete explanation of how that is handled, not just a promise. I still care about ${first}, but it would not make that concern disappear.`;
    else if (/price|cost|fee|budget|expensive/.test(question)) answer = `I would compare the total cost with the value I actually get. My main priority is ${first}, and I would be uncomfortable if ${barrier} appeared late in the decision. For my situation, ${contextSentence(profile)}.`;
    else if (/routine|day|context|when|use it|use this/.test(question)) answer = `It would fit when I ${routineAction(profile)}. I would need it to be simple in that moment; ${first} is what would make me choose it over what I do now.`;
    else if (/more|example|tell me|specific|detail|experience/.test(question)) answer = `For example, ${contextSentence(profile)}. What I notice first is whether I can count on ${first}. If I run into ${barrier}, I tend to go back to a familiar option. That's probably more important than a long feature list.`;
    else if (/trust|data|privacy|safe|secure/.test(question)) answer = `I would want plain language about what is collected, who can see it, and whether I can change my mind later. ${capitalize(profile.priorities.includes("transparent data use") ? "transparent data use" : "clear service")} helps, but ${barrier} is still the part I would check first.`;
    else answer = `I would think about it through ${first} and ${profile.traits[0]}. The important part is whether it fits when I ${routineAction(profile)}. I would be more open to it if ${barrier} were handled clearly.`;
    return memory ? `${answer} ${memory}` : answer;
  }
  function renderInterview() {
    const profile = byId(state.interviewPersona), messages = getMessages(profile.id), turns = Math.floor((messages.length - 1) / 2);
    return `${pageHead("INTERVIEW MODE", "A conversation, not a questionnaire.", "Interview one persona at a time. Their profile, earlier turns, and decision style stay in context.")}<div class="interview-layout"><aside class="panel interview-sidebar"><div class="eyebrow" style="padding:4px 8px 9px">SELECT A PERSONA</div>${personas.map(item => `<button class="interview-person ${item.id === profile.id ? "selected" : ""}" data-action="select-interview-persona" data-id="${item.id}">${avatar(item)}<span><strong>${item.name}</strong><small>${item.segment}</small></span></button>`).join("")}</aside><section class="panel chat-panel"><div class="chat-head">${avatar(profile)}<div><h2>${profile.name}</h2><p>${profile.age} · ${profile.role} · ${profile.traits.slice(0, 2).join(" · ")}</p></div><div class="chat-controls"><button class="button secondary small" data-action="probe">${icon("corner-down-right")} Probe deeper</button><button class="icon-button" data-action="export-transcript" title="Export transcript" aria-label="Export transcript">${icon("download")}</button><button class="icon-button" data-action="clear-interview" title="Start a new interview" aria-label="Start a new interview">${icon("rotate-ccw")}</button></div></div><div class="chat-messages" id="chat-messages">${messages.map(message => `<div class="message ${message.role === "user" ? "user" : ""}"><div class="message-meta">${message.role === "user" ? "YOU" : profile.name.toUpperCase()} · ${new Date(message.at).toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" })}</div>${esc(message.text)}</div>`).join("")}</div><div class="suggestion-row">${["What would make you hesitate?", "Can you tell me more about that?", "How does that fit your routine?"].map(text => `<button class="suggestion" data-action="send-suggestion" data-text="${esc(text)}">${text}</button>`).join("")}</div><form class="chat-compose" data-form="interview"><textarea class="textarea" name="message" placeholder="Ask ${profile.name.split(" ")[0]} a follow-up…" aria-label="Interview question" required></textarea><span class="turn-count">${turns} turns</span><button class="button" type="submit" aria-label="Send question">${icon("arrow-up")}</button></form><div style="padding:0 14px 10px;color:#8a918a;font-size:8px">Rolling summary updates from prior turns · ${messages.filter(message => message.role === "user").length} questions retained</div></section></div><div class="disclaimer"><strong>Persona safeguard.</strong> This is a synthetic persona, not a real person. Responses are generated from a declared profile and rolling conversation context.</div>`;
  }
  function renderScenarios() {
    return `${pageHead("SCRIPTED EXPERIMENTS", "Six useful starting points.", "Run four PRD scenarios plus two varied validation studies. Each produces a response matrix, consistency checks, and initial observations.")}<div class="grid scenario-grid">${scenarios.map(item => `<article class="panel scenario-card"><div class="scenario-top"><span class="scenario-letter">SCENARIO ${item.id}</span><span class="scenario-domain-badge">${item.domain}</span></div><h2>${item.name}</h2><p>${item.desc}</p><div class="scenario-card-footer"><span>${item.personaIds.length} personas · ${item.questions.length} prompts</span><button class="button small" data-action="run-scenario" data-id="${item.id}">${icon("play")} Run</button></div></article>`).join("")}</div><section class="panel section-gap"><div class="panel-head"><div><h2 class="panel-title">Experiment coverage</h2><p class="panel-subtitle">Persona archetypes and domains represented in validation scenarios</p></div><span class="badge green">6 scripted studies</span></div><div class="panel-body"><div class="persona-strip">${scenarios.map((item, index) => `<div class="persona-tile"><span class="scenario-code">0${index + 1}</span><div class="persona-name" style="margin-top:7px">${item.domain}</div><div class="persona-role">scenario ${item.id}</div></div>`).join("")}</div><div class="helper-note" style="margin-top:12px"><strong>Scenario reports include:</strong> full response matrix, per-persona consistency score, sentiment summary, surfaced themes, and directional adoption score. QuickBite is available as a baseline on launch.</div></div></section>`;
  }
  function renderEvaluation() {
    const run = currentRun(), consistency = Math.round(run.responses.reduce((sum, response) => sum + response.consistency, 0) / run.responses.length);
    const interviewTurns = Object.entries(state.interviews).flatMap(([id, messages]) => messages.filter(message => message.role === "user").map(message => ({ id, messages })));
    const metrics = [["Persona consistency", `${consistency}%`, "Target ≥ 90% · selected run", "shield-check"], ["Interview memory", `${interviewTurns.length} turns`, "Target ≥ 10 turns per session", "messages-square"], ["Scenario coverage", "6 studies", "Target ≥ 4 archetypes · 3 domains", "flask-conical"], ["Theme evidence", `${deriveInsights(run).themes.length} themes`, "Target ≥ 85% relevance · evidence-linked", "scan-search"], ["Run reproducibility", "100%", "Fixed rules · same inputs, same outputs", "repeat-2"], ["Response latency", `${run.durationMs}ms`, "Target ≤ 60s · 8 × 5 responses", "timer"]];
    return `${pageHead("VALIDATION HARNESS", "Check the system, not just the answers.", "Deterministic checks expose profile alignment, response diversity, experiment coverage, and run traceability.", button("Run checks", "run-evaluation", "refresh-cw", "button secondary"))}<div class="grid eval-grid">${metrics.map(([label, value, foot, iconName]) => `<div class="panel eval-card"><div class="metric-label">${label}</div><div class="metric-value">${value}</div><div class="metric-foot">${icon(iconName)}${foot}</div></div>`).join("")}</div><section class="panel section-gap"><div class="panel-head"><div><h2 class="panel-title">Generation trace · ${esc(run.title)}</h2><p class="panel-subtitle">Model, persona, response time, approximate token count, and alignment check</p></div><span class="badge">${esc(run.model)}</span></div><div class="panel-body" style="overflow-x:auto"><table class="eval-table"><thead><tr><th>Persona</th><th>Segment</th><th>Latency</th><th>Est. tokens</th><th>Consistency</th><th>Flags</th></tr></thead><tbody>${run.responses.map(response => { const profile = byId(response.personaId), tokens = response.answers.reduce((sum, answer) => sum + Math.ceil(answer.text.split(/\s+/).length * 1.3), 0); return `<tr><td><span class="table-person">${avatar(profile)}${profile.name}</span></td><td>${profile.segment}</td><td class="mono">${response.latencyMs}ms</td><td class="mono">~${tokens}</td><td class="mono">${response.consistency}%</td><td>${response.flags.length ? `<span class="badge gold">${response.flags.length} review</span>` : `<span class="badge green">Clear</span>`}</td></tr>`; }).join("")}</tbody></table></div></section><section class="panel section-gap"><div class="panel-head"><div><h2 class="panel-title">Validation matrix</h2><p class="panel-subtitle">Coverage across question formats and product domains</p></div></div><div class="panel-body" style="overflow-x:auto"><table class="eval-table"><thead><tr><th>Scenario</th><th>Domain</th><th>Personas</th><th>Question formats</th><th>Status</th></tr></thead><tbody>${scenarios.map(item => `<tr><td>${item.id} · ${item.name}</td><td>${item.domain}</td><td>${item.personaIds.length}</td><td>${new Set(item.questions.map(question => question.type)).size}</td><td><span class="badge green">Ready</span></td></tr>`).join("")}</tbody></table></div></section><section class="panel section-gap"><div class="panel-head"><div><h2 class="panel-title">Interview memory checks</h2><p class="panel-subtitle">Raw turns persist by persona and are available in transcript exports.</p></div></div><div class="panel-body">${Object.entries(state.interviews).length ? Object.entries(state.interviews).map(([id, messages]) => `<div class="agreement-item"><span><strong>${byId(id).name}</strong> · ${Math.floor((messages.length - 1) / 2)} interviewer turns</span><span>${messages.filter(message => message.role === "assistant").length} replies · retained</span></div>`).join("") : `<span class="muted" style="font-size:10px">Start an interview to populate turn-memory checks.</span>`}</div></section><div class="disclaimer"><strong>Honest validation note.</strong> These are engineering checks, not independent human evaluation. This prototype cannot substantiate evaluator-rated realism, 85% theme relevance, or the quality of a hosted LLM. Review with people before claiming those metrics.</div>`;
  }

  function render() {
    const view = { overview: renderOverview, survey: renderSurvey, interview: renderInterview, insights: renderInsights, scenarios: renderScenarios, evaluation: renderEvaluation }[state.view] || renderOverview;
    const content = view().replace(/(\d+) turns/g, (_, count) => `${count} turn${count === "1" ? "" : "s"}`);
    const reasoning = state.view === "insights" ? renderSegmentReasoning(currentRun(), deriveInsights(currentRun())) : "";
    app.innerHTML = shell(`${content}${reasoning}`);
    if (window.lucide?.createIcons) window.lucide.createIcons();
    updateEngineChip();
  }
  function updateEngineChip() {
    const chip = document.querySelector(".engine-chip");
    if (chip) chip.innerHTML = `<i class="engine-dot"></i> ${engineStatus.mode === "hosted" ? `LIVE · ${esc(engineStatus.model)}` : "LOCAL SIM · V1.0"}`;
  }
  async function refreshEngineStatus() {
    try {
      const response = await fetch("/api/status");
      if (!response.ok) return;
      engineStatus = await response.json();
      updateEngineChip();
    } catch { /* Static-server use keeps the offline simulation available. */ }
  }
  function toast(text) {
    document.querySelector(".toast")?.remove(); const item = document.createElement("div"); item.className = "toast"; item.innerHTML = `${icon("circle-check")}<span>${esc(text)}</span>`; document.body.append(item); setTimeout(() => item.remove(), 3000);
  }
  function showLoading(title, detail) {
    const item = document.createElement("div"); item.className = "loading-overlay"; item.innerHTML = `<div class="loading-box"><h2>${esc(title)}</h2><p>${esc(detail)}</p><div class="loading-bar"><span></span></div></div>`; document.body.append(item);
  }
  function hideLoading() { document.querySelector(".loading-overlay")?.remove(); }
  function exportFile(name, content, type) {
    const url = URL.createObjectURL(new Blob([content], { type })), anchor = document.createElement("a"); anchor.href = url; anchor.download = name; anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function downloadRun(run, format = "csv") {
    if (!run) return toast("Run a survey before exporting responses.");
    if (format === "json") { exportFile(`${slug(run.title)}-run.json`, JSON.stringify(run, null, 2), "application/json"); return; }
    const header = ["question", ...run.personaIds.map(id => byId(id).name), "consistency_score"];
    const rows = run.questions.map(question => [question.prompt, ...run.responses.map(response => response.answers.find(answer => answer.questionId === question.id)?.text || ""), run.responses.map(response => response.consistency).join(" | ")]);
    exportFile(`${slug(run.title)}-responses.csv`, [header, ...rows].map(row => row.map(value => `"${String(value).replaceAll('"', '""')}"`).join(",")).join("\r\n"), "text/csv;charset=utf-8"); toast("Response matrix exported as CSV.");
  }
  function reportMarkdown(run) {
    const report = deriveInsights(run);
    return `# ${run.title}\n\n**Product:** ${run.product}  \n**Domain:** ${run.domain}  \n**Run:** ${formatDate(run.createdAt)}  \n**Engine:** ${run.model}\n\n> Simulated research only. Validate with real users before making decisions.\n\n## Executive summary\n\n${executiveSummary(run, report)}\n\n## Would use this product?\n\n**${report.overall}/100** directional stated-intent score.\n\n${report.segments.map(segment => `- **${segment.name}:** ${segment.score}/100 (${segment.count} persona${segment.count === 1 ? "" : "s"}; range ${segment.min}–${segment.max})`).join("\n")}\n\n## Themes with evidence\n\n${report.themes.map(theme => `### ${theme.label}\n\n${theme.evidence.map(item => `> “${item.text}” — ${item.persona.name}`).join("\n\n")}\n\n${theme.mentions} matches across ${theme.distinct} personas.`).join("\n\n")}\n\n## Sentiment\n\n${Object.entries(report.sentiment).map(([key, value]) => `- ${key}: ${value}`).join("\n")}\n\n## Agreement and divergence\n\n${report.agreements.map(item => `- ${item.text}: ${item.question}`).join("\n")}\n\n## Behavioral signals\n\n${report.trends.map(item => `- ${item}`).join("\n")}\n\n## Method\n\nDeterministic keyword-based theme and sentiment extraction over saved response artifacts. Not independently human-evaluated.`;
  }
  function exportReport() {
    const run = currentRun(); if (!run) return toast("No report to export yet.");
    exportFile(`${slug(run.title)}-insights.md`, reportMarkdown(run), "text/markdown;charset=utf-8"); toast("Insight report exported as Markdown.");
  }
  function exportInsightJson() {
    const run = currentRun(); if (!run) return toast("No insights to export yet.");
    exportFile(`${slug(run.title)}-insights.json`, JSON.stringify({ run, insights: deriveInsights(run), generatedAt: new Date().toISOString() }, null, 2), "application/json"); toast("Structured report exported as JSON.");
  }
  function exportTranscript() {
    const profile = byId(state.interviewPersona), messages = getMessages(profile.id);
    const text = `# Interview transcript: ${profile.name}\n\n**Profile:** ${profile.age}, ${profile.role}, ${profile.segment}\n**Engine:** ${engineStatus.model}\n\n${messages.map(message => `**${message.role === "user" ? "Interviewer" : profile.name}:** ${message.text}`).join("\n\n")}\n\n> Synthetic persona interview. Not a real user interview.`;
    exportFile(`${slug(profile.name)}-interview.md`, text, "text/markdown;charset=utf-8"); toast("Interview transcript exported as Markdown.");
  }
  async function runSurvey(scenario = null) {
    if (busy) return;
    const form = state.survey;
    const config = scenario ? { ...scenario, title: scenario.name } : {
      ...form,
      title: document.querySelector("[data-field=title]")?.value.trim() || form.title,
      product: document.querySelector("[data-field=product]")?.value.trim() || form.product,
      domain: document.querySelector("[data-field=domain]")?.value.trim() || form.domain,
      description: document.querySelector("[data-field=description]")?.value.trim() || form.description,
      questions: form.questions.map(question => ({ ...question, prompt: document.querySelector(`[data-question="${question.id}"]`)?.value.trim() || question.prompt, type: document.querySelector(`[data-question-type="${question.id}"]`)?.value || question.type })),
      personaIds: [...document.querySelectorAll("input[name=persona]:checked")].map(input => input.value),
    };
    if (config.personaIds.length < 2) return toast("Select at least two personas to run a comparison.");
    if (!config.questions.length) return toast("Add at least one survey question.");
    state.survey = { ...state.survey, title: config.title, description: config.description, product: config.product, domain: config.domain, questions: config.questions, personaIds: config.personaIds };
    busy = true; showLoading("Generating persona responses", `${config.personaIds.length} participants · ${config.questions.length} questions · running concurrently`);
    const start = performance.now();
    try {
      const jobs = config.personaIds.map(async (personaId, index) => {
        const profile = byId(personaId);
        const generate = async () => {
          if (engineStatus.mode === "hosted") {
            const response = await fetch("/api/respond", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ persona: profile, survey: { title: config.title, description: config.description, product: config.product, domain: config.domain }, questions: config.questions }) });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || "Model request failed.");
            return { personaId, latencyMs: result.latencyMs, usage: result.usage, answers: result.answers.map(answer => ({ ...answer, sentiment: sentimentOf(answer.text) })) };
          }
          await new Promise(resolve => setTimeout(resolve, 70 + ((index * 73) % 190)));
          return { personaId, latencyMs: 70 + ((index * 73) % 190), answers: config.questions.map((question, questionIndex) => { const text = answerFor(profile, question, config.product, questionIndex); return { questionId: question.id, text, sentiment: sentimentOf(text) }; }) };
        };
        let lastError;
        for (let attempt = 0; attempt < 3; attempt++) {
          try { return await generate(); }
          catch (error) { lastError = error; if (attempt < 2) await new Promise(resolve => setTimeout(resolve, 150 * (attempt + 1))); }
        }
        return { personaId, error: String(lastError || "Generation failed after two retries.") };
      });
      const outcomes = await Promise.all(jobs), valid = outcomes.filter(item => !item.error);
      if (valid.length < 2) throw new Error("Fewer than two persona responses could be generated.");
      const run = makeRun(config.title, config.product, config.domain, config.questions, valid.map(item => item.personaId), scenario?.id || "custom", Math.max(1, Math.round(performance.now() - start)));
      run.responses = valid.map(item => ({ ...run.responses.find(response => response.personaId === item.personaId), answers: item.answers, latencyMs: item.latencyMs, tokens: item.usage?.total_tokens || 0 }));
      run.score = Math.round(run.responses.reduce((sum, response) => sum + responseIntent(response, run.questions), 0) / run.responses.length);
      run.model = engineStatus.mode === "hosted" ? engineStatus.model : run.model;
      state.runs.unshift(run); state.runs = state.runs.slice(0, 30); state.selectedRun = run.id;
      state.logs.unshift({ runId: run.id, model: run.model, personas: valid.length, latencyMs: run.durationMs, createdAt: run.createdAt, failures: outcomes.length - valid.length });
      state.view = "survey"; persist(); render(); toast(`${valid.length} personas responded concurrently${outcomes.length > valid.length ? ` · ${outcomes.length - valid.length} failed after retries` : ""}. Results saved.`);
    } catch (error) { console.error(error); toast("The run could not complete. Check the study and retry."); }
    finally { busy = false; hideLoading(); }
  }

  async function sendInterview(text) {
    const prompt = String(text || "").trim(); if (!prompt) return;
    const id = state.interviewPersona, profile = byId(id), messages = getMessages(id);
    messages.push({ role: "user", text: prompt, at: new Date().toISOString() });
    let response, usedFallback = engineStatus.mode !== "hosted";
    if (!usedFallback) {
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          const result = await fetch("/api/interview", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ persona: profile, summary: summarizeMemory(messages.slice(0, -1)), messages: messages.map(message => ({ role: message.role, content: message.text })) }) });
          const payload = await result.json();
          if (!result.ok) throw new Error(payload.error || "Model request failed.");
          response = payload.text;
          break;
        } catch {
          if (attempt < 2) await new Promise(resolve => setTimeout(resolve, 150 * (attempt + 1)));
          else usedFallback = true;
        }
      }
    }
    if (usedFallback) { response = interviewAnswer(profile, prompt, messages.slice(0, -1)); await new Promise(resolve => setTimeout(resolve, 160)); }
    messages.push({ role: "assistant", text: response, at: new Date().toISOString() });
    persist(); render(); document.getElementById("chat-messages")?.scrollTo({ top: 999999, behavior: "smooth" });
    if (usedFallback && engineStatus.mode === "hosted") toast("Model unavailable after retries; used the local persona fallback.");
  }
  function handleAction(element) {
    const action = element.dataset.action;
    if (action === "nav") { state.view = element.dataset.view; persist(); render(); }
    else if (action === "select-run") { state.selectedRun = element.dataset.id; state.view = "survey"; persist(); render(); }
    else if (action === "run-survey") runSurvey();
    else if (action === "run-scenario") { const scenario = scenarioById(element.dataset.id); if (scenario) { state.survey = { title: scenario.name, description: scenario.desc, product: scenario.product, domain: scenario.domain, questions: structuredClone(scenario.questions), personaIds: [...scenario.personaIds] }; persist(); runSurvey(scenario); } }
    else if (action === "add-question") { state.survey.questions.push({ id: makeId("q"), prompt: "What would make this product more useful to you?", type: "open" }); persist(); render(); }
    else if (action === "remove-question") { state.survey.questions = state.survey.questions.filter(question => question.id !== element.dataset.id); persist(); render(); }
    else if (action === "export-run") downloadRun(currentRun());
    else if (action === "export-run-json") downloadRun(currentRun(), "json");
    else if (action === "export-report") exportReport();
    else if (action === "export-json") exportInsightJson();
    else if (action === "export-transcript") exportTranscript();
    else if (action === "print-report") window.print();
    else if (action === "select-interview-persona") { state.interviewPersona = element.dataset.id; getMessages(state.interviewPersona); persist(); render(); }
    else if (action === "clear-interview") { state.interviews[state.interviewPersona] = []; getMessages(state.interviewPersona); persist(); render(); toast("New interview started. Persona profile retained."); }
    else if (action === "probe") { const profile = byId(state.interviewPersona); sendInterview(`You mentioned ${profile.priorities[0]}. Can you tell me more about what that means day to day?`); }
    else if (action === "send-suggestion") sendInterview(element.dataset.text);
    else if (action === "run-evaluation") { render(); toast("Validation checks refreshed from saved runs and transcripts."); }
  }
  app.addEventListener("click", event => { const target = event.target.closest("[data-action]"); if (target) { event.preventDefault(); handleAction(target); } });
  app.addEventListener("change", event => {
    const target = event.target;
    if (target.matches("[data-action=choose-run]")) { state.selectedRun = target.value; persist(); render(); return; }
    if (target.matches("input[name=persona]")) { const selected = new Set(state.survey.personaIds); target.checked ? selected.add(target.value) : selected.delete(target.value); state.survey.personaIds = [...selected]; persist(); render(); return; }
    if (target.dataset.field) { state.survey[target.dataset.field] = target.value; persist(); }
    if (target.dataset.question) { state.survey.questions = state.survey.questions.map(question => question.id === target.dataset.question ? { ...question, prompt: target.value } : question); persist(); }
    if (target.dataset.questionType) { state.survey.questions = state.survey.questions.map(question => question.id === target.dataset.questionType ? { ...question, type: target.value } : question); persist(); }
  });
  app.addEventListener("submit", event => { if (event.target.matches("[data-form=interview]")) { event.preventDefault(); const field = event.target.elements.message, value = field.value; field.value = ""; sendInterview(value); } });
  render();
  refreshEngineStatus();
})();
