import os
from dotenv import load_dotenv
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent
ENV_PATH = BASE_DIR / ".env"

load_dotenv(ENV_PATH)


class Settings:
    APP_NAME: str = os.getenv("APP_NAME", "RAG-App")
    ENV: str = os.getenv("ENV", "development")
    DEBUG: bool = os.getenv("DEBUG", "false").lower() == "true"

    HOST: str = os.getenv("HOST", "127.0.0.1")
    PORT: int = int(os.getenv("PORT", 3000))

    GOOGLE_API_KEY: str = os.getenv("GOOGLE_API_KEY")
    GOOGLE_LLM_MODEL: str = os.getenv(
        "GOOGLE_LLM_MODEL", "gemini-2.5-flash-lite")
    GOOGLE_EMBEDDING_MODEL: str = os.getenv(
        "GOOGLE_EMBEDDING_MODEL", "gemini-embedding-001")

    CHROMA_DB_PATH: str = os.getenv("CHROMA_DB_PATH", "chroma_db")

    CHROMA_COLLECTION: str = os.getenv("CHROMA_COLLECTION", "cpe")
    SCORE_THRESHOLD: float = float(os.getenv("SCORE_THRESHOLD", "0.5"))
    TOP_K: int = int(os.getenv("TOP_K", "5"))


settings = Settings()
