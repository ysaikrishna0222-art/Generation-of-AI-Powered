from datetime import datetime, timezone
from typing import Literal
from uuid import uuid4

from pydantic import BaseModel, Field


class ExperimentCreate(BaseModel):
	product_description: str = Field(min_length=10)
	target_audience: str = Field(min_length=5)
	research_objectives: list[str] = Field(min_length=1)
	persona_count: int = Field(default=5, ge=3, le=8)


class Persona(BaseModel):
	id: str = Field(default_factory=lambda: str(uuid4()))
	name: str
	age: int
	gender: str
	location: str
	occupation: str
	education: str
	income_range: str
	personality_traits: list[str]
	communication_style: str
	decision_making_style: str
	shopping_behavior: list[str]
	product_preferences: list[str]
	price_sensitivity: str
	technology_adoption: str
	motivations: list[str]
	goals: list[str]
	frustrations: list[str]
	concerns: list[str]


class ConversationMessage(BaseModel):
	role: Literal["researcher", "persona"]
	content: str
	timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class PersonaMemory(BaseModel):
	persona_id: str
	opinions: list[str] = Field(default_factory=list)
	important_facts: list[str] = Field(default_factory=list)
	conversation_history: list[ConversationMessage] = Field(default_factory=list)


class Experiment(BaseModel):
	id: str = Field(default_factory=lambda: str(uuid4()))
	product_description: str
	target_audience: str
	research_objectives: list[str]
	personas: list[Persona] = Field(default_factory=list)
	created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class MessageCreate(BaseModel):
	content: str = Field(min_length=1)


class MessageResponse(BaseModel):
	persona: Persona
	reply: ConversationMessage
	memory: PersonaMemory