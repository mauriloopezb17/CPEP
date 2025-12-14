from google import genai
from app.core.config import settings

gemini_client = genai.Client(api_key=settings.GOOGLE_API_KEY)


class ChatGemini:
    def __init__(
        self,
        model: str | None = None,
        temperature: float = 0.3,
        max_output_tokens: int = 2048,
    ):
        self.model = model or settings.GOOGLE_LLM_MODEL
        self.temperature = temperature
        self.max_output_tokens = max_output_tokens

    def invoke(self, prompt: str) -> str:

        if not prompt or not prompt.strip():
            raise ValueError("Prompt vacío")

        response = gemini_client.models.generate_content(
            model=self.model,
            contents=prompt,
            config={
                "temperature": self.temperature,
                "max_output_tokens": self.max_output_tokens,
            },
        )

        return response.text
