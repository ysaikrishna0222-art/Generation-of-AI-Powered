from collections import defaultdict

from .models import ConversationMessage, Persona, PersonaMemory


class MemoryManager:
	"""Keeps profile, opinion, and conversation memory for each persona."""

	def __init__(self) -> None:
		self._memories: dict[str, PersonaMemory] = {}

	def initialize(self, persona: Persona) -> PersonaMemory:
		memory = self._memories.setdefault(
			persona.id,
			PersonaMemory(
				persona_id=persona.id,
				important_facts=[
					f"{persona.name} is {persona.age} and works as a {persona.occupation}.",
					f"{persona.name} is {persona.price_sensitivity.lower()} about price.",
				],
			),
		)
		return memory

	def get(self, persona: Persona) -> PersonaMemory:
		return self.initialize(persona)

	def add_exchange(self, persona: Persona, question: str, answer: str) -> PersonaMemory:
		memory = self.initialize(persona)
		memory.conversation_history.extend(
			[
				ConversationMessage(role="researcher", content=question),
				ConversationMessage(role="persona", content=answer),
			]
		)
		memory.opinions.extend(self._extract_opinions(question, answer))
		memory.opinions = list(dict.fromkeys(memory.opinions))[-8:]
		memory.conversation_history = memory.conversation_history[-12:]
		return memory

	def context_for(self, persona: Persona) -> str:
		memory = self.get(persona)
		recent = "\n".join(
			f"{message.role}: {message.content}" for message in memory.conversation_history[-6:]
		)
		opinions = "; ".join(memory.opinions) or "No opinions recorded yet."
		facts = "; ".join(memory.important_facts)
		return f"Profile facts: {facts}\nOpinions: {opinions}\nRecent conversation:\n{recent}"

	@staticmethod
	def _extract_opinions(question: str, answer: str) -> list[str]:
		lowered_question = question.lower()
		lowered_answer = answer.lower()
		opinions: list[str] = []
		if any(word in lowered_question for word in ("price", "cost", "pay", "subscription", "budget")):
			if any(word in lowered_answer for word in ("affordable", "cheaper", "lower-cost", "budget", "not pay")):
				opinions.append("Prefers an affordable or lower-cost pricing option.")
			elif any(word in lowered_answer for word in ("premium", "pay more", "worth the cost")):
				opinions.append("May pay more when the value is clearly demonstrated.")
		if any(word in lowered_question for word in ("privacy", "data", "security")):
			opinions.append("Wants clear information about data privacy and security.")
		if any(word in lowered_question for word in ("feature", "important", "need", "use")):
			opinions.append("Values practical features that support their stated goals.")
		return opinions