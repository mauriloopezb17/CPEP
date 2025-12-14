from google import genai
from google.genai import types
from app.core.config import settings


# Cliente global de gemini
gemini_client = genai.Client(api_key=settings.GOOGLE_API_KEY)


class GeminiEmbeddingFunction:
    def __init__(self, model: str | None = None):
        self.model = model or settings.GOOGLE_EMBEDDING_MODEL

    def __call__(self, input):
        try:
            result = gemini_client.models.embed_content(
                model=self.model,
                contents=input,
                config=types.EmbedContentConfig(
                    task_type="retrieval_document",
                    output_dimensionality=3072,
                ),
            )
            return [emb.values for emb in result.embeddings]
        except Exception as e:
            print(f"Error generando embedding: {e}")
            raise e

    def embed_query(self, input):
        result = gemini_client.models.embed_content(
            model=self.model,
            contents=input,
            config=types.EmbedContentConfig(
                task_type="retrieval_query",
                output_dimensionality=3072,
            ),
        )
        return [emb.values for emb in result.embeddings]

    def name(self) -> str:
        return f"gemini::{self.model}"

    def get_config(self):
        return {
            "model": self.model,
            "dimensions": 3072,
        }
