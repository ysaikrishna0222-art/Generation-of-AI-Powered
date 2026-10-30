from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .agents import PersonaGenerationAgent, PersonaInteractionAgent
from .memory import MemoryManager
from .models import Experiment, ExperimentCreate, MessageCreate, MessageResponse


app = FastAPI(title="Synthetic User Research Platform API", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:8501", "http://localhost:8501"],
    allow_methods=["*"],
    allow_headers=["*"],
)

experiments: dict[str, Experiment] = {}
memory_manager = MemoryManager()
generation_agent = PersonaGenerationAgent()
interaction_agent = PersonaInteractionAgent(memory_manager)


@app.get("/")
def read_root() -> dict[str, str]:
    return {"message": "Synthetic User Research Platform API is running."}


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/experiments", response_model=Experiment)
def create_experiment(request: ExperimentCreate) -> Experiment:
    experiment = Experiment(
        product_description=request.product_description.strip(),
        target_audience=request.target_audience.strip(),
        research_objectives=[objective.strip() for objective in request.research_objectives if objective.strip()],
        personas=generation_agent.generate(request.persona_count),
    )
    for persona in experiment.personas:
        memory_manager.initialize(persona)
    experiments[experiment.id] = experiment
    return experiment


@app.get("/api/experiments/{experiment_id}", response_model=Experiment)
def get_experiment(experiment_id: str) -> Experiment:
    experiment = experiments.get(experiment_id)
    if experiment is None:
        raise HTTPException(status_code=404, detail="Experiment not found")
    return experiment


@app.post("/api/experiments/{experiment_id}/personas/{persona_id}/messages", response_model=MessageResponse)
def send_message(experiment_id: str, persona_id: str, request: MessageCreate) -> MessageResponse:
    experiment = experiments.get(experiment_id)
    if experiment is None:
        raise HTTPException(status_code=404, detail="Experiment not found")
    persona = next((item for item in experiment.personas if item.id == persona_id), None)
    if persona is None:
        raise HTTPException(status_code=404, detail="Persona not found")
    question = request.content.strip()
    answer = interaction_agent.respond(persona, question)
    memory = memory_manager.add_exchange(persona, question, answer)
    return MessageResponse(persona=persona, reply={"role": "persona", "content": answer}, memory=memory)
