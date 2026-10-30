from dataclasses import dataclass

from .memory import MemoryManager
from .models import Persona


@dataclass(frozen=True)
class PersonaBlueprint:
	name: str
	age: int
	gender: str
	location: str
	occupation: str
	education: str
	income_range: str
	traits: list[str]
	communication: str
	decision_making: str
	shopping: list[str]
	preferences: list[str]
	price_sensitivity: str
	technology_adoption: str
	motivations: list[str]
	goals: list[str]
	frustrations: list[str]
	concerns: list[str]


BLUEPRINTS = [
	PersonaBlueprint("Rahul Kumar", 24, "Male", "Bengaluru", "Software Engineer", "B.Tech", "INR 6-8 LPA", ["Practical", "Analytical", "Budget-conscious"], "Direct and concise", "Compares options before committing", ["Reads reviews", "Looks for value"], ["Useful personalization", "Simple onboarding"], "Highly price-sensitive", "Technology enthusiast", ["Save time", "Improve productivity"], ["Build healthier routines", "Spend wisely"], ["Complicated interfaces", "Irrelevant recommendations"], ["Data privacy", "Subscription cost"]),
	PersonaBlueprint("Aisha Mehta", 21, "Female", "Mumbai", "College Student", "B.A. Psychology", "INR 2-4 LPA", ["Curious", "Social", "Value-seeking"], "Warm and conversational", "Asks friends and checks social proof", ["Waits for student offers", "Shares useful finds"], ["Affordable plans", "Community features"], "Extremely price-sensitive", "Comfortable with mainstream apps", ["Feel supported", "Stay motivated"], ["Balance study and wellbeing", "Find trusted guidance"], ["Expensive subscriptions", "Too much jargon"], ["Hidden charges", "Being judged"]),
	PersonaBlueprint("Neha Shah", 29, "Female", "Pune", "Product Manager", "MBA", "INR 12-16 LPA", ["Organized", "Goal-oriented", "Time-conscious"], "Structured and specific", "Evaluates outcomes and time saved", ["Pays for proven value", "Uses trials first"], ["Actionable insights", "Reliable progress tracking"], "Willing to pay for measurable value", "Early adopter", ["Reduce decision fatigue", "Make progress"], ["Maintain consistency", "Optimize a busy schedule"], ["Generic advice", "Manual data entry"], ["Accuracy", "Time commitment"]),
	PersonaBlueprint("Arjun Verma", 33, "Male", "Delhi", "Small Business Owner", "B.Com", "INR 8-12 LPA", ["Independent", "Skeptical", "Results-driven"], "Brief and outcome-focused", "Needs a clear return on investment", ["Negotiates pricing", "Prefers flexible plans"], ["Reliable support", "Practical automation"], "Moderately price-sensitive", "Pragmatic technology user", ["Run the business better", "Avoid wasted effort"], ["Protect family time", "Improve personal health"], ["Setup friction", "Unclear benefits"], ["Vendor reliability", "Long contracts"]),
	PersonaBlueprint("Kavya Iyer", 27, "Female", "Chennai", "UX Designer", "B.Des", "INR 8-11 LPA", ["Empathetic", "Creative", "Detail-oriented"], "Thoughtful and descriptive", "Notices experience quality and accessibility", ["Explores alternatives", "Values transparent brands"], ["Beautiful experience", "Inclusive design"], "Looks for a fair price", "Very comfortable with new technology", ["Feel understood", "Enjoy the process"], ["Create sustainable habits", "Use delightful tools"], ["Cluttered screens", "Dark patterns"], ["Accessibility", "Responsible data use"]),
	PersonaBlueprint("Vikram Rao", 41, "Male", "Hyderabad", "Finance Consultant", "CA", "INR 18-25 LPA", ["Cautious", "Evidence-led", "Reliable"], "Measured and detail-oriented", "Needs evidence before changing habits", ["Compares terms carefully", "Prefers established providers"], ["Trustworthy reporting", "Strong support"], "Value-sensitive, not budget-limited", "Selective technology adopter", ["Reduce risk", "Make informed choices"], ["Stay healthy with low disruption", "Protect privacy"], ["Unverified claims", "Aggressive notifications"], ["Security", "Evidence quality"]),
]


class PersonaGenerationAgent:
	def generate(self, count: int) -> list[Persona]:
		return [self._from_blueprint(BLUEPRINTS[index % len(BLUEPRINTS)]) for index in range(count)]

	@staticmethod
	def _from_blueprint(blueprint: PersonaBlueprint) -> Persona:
		return Persona(
			name=blueprint.name,
			age=blueprint.age,
			gender=blueprint.gender,
			location=blueprint.location,
			occupation=blueprint.occupation,
			education=blueprint.education,
			income_range=blueprint.income_range,
			personality_traits=blueprint.traits,
			communication_style=blueprint.communication,
			decision_making_style=blueprint.decision_making,
			shopping_behavior=blueprint.shopping,
			product_preferences=blueprint.preferences,
			price_sensitivity=blueprint.price_sensitivity,
			technology_adoption=blueprint.technology_adoption,
			motivations=blueprint.motivations,
			goals=blueprint.goals,
			frustrations=blueprint.frustrations,
			concerns=blueprint.concerns,
		)


class PersonaInteractionAgent:
	def __init__(self, memory: MemoryManager) -> None:
		self.memory = memory

	def respond(self, persona: Persona, question: str) -> str:
		lowered = question.lower()
		memory = self.memory.get(persona)
		if any(word in lowered for word in ("price", "cost", "pay", "subscription", "budget")):
			return self._pricing_response(persona, memory.opinions)
		if any(word in lowered for word in ("privacy", "data", "security")):
			return f"I would want clear control over my data and a simple explanation of how it is protected. {persona.concerns[0]} would matter to me."
		if any(word in lowered for word in ("feature", "important", "need", "use", "like")):
			return f"I would look for {persona.product_preferences[0].lower()} and {persona.product_preferences[1].lower()}. It should help me {persona.goals[0].lower()} without adding much friction."
		if any(word in lowered for word in ("remember", "earlier", "previous", "said")) and memory.opinions:
			return f"Earlier I said that {memory.opinions[-1].lower()} That still reflects how I would evaluate this product."
		return f"I would consider it if it helps me {persona.goals[0].lower()}. I usually decide carefully because I am {persona.personality_traits[0].lower()} and value {persona.product_preferences[0].lower()}."

	@staticmethod
	def _pricing_response(persona: Persona, opinions: list[str]) -> str:
		if "Highly" in persona.price_sensitivity or "Extremely" in persona.price_sensitivity:
			return "I would prefer a lower-cost monthly plan or a free basic version. I compare subscriptions carefully before paying."
		if "Willing" in persona.price_sensitivity:
			return "I could pay for it if the value is measurable and it saves me time. I would want a trial before committing."
		if "not budget" in persona.price_sensitivity.lower():
			return "Price is not my only concern, but I would still expect reliable quality and transparent terms."
		if opinions:
			return "I would keep the affordable option in mind, but I could pay more when the value is clear."
		return "I would compare the price with the outcomes I expect and look for a flexible plan."