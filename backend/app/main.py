from fastapi import FastAPI
from app.core.config import settings
from app.api.routes import rag

assert settings.GOOGLE_API_KEY, "api key de google no encontrada"

app = FastAPI(title=settings.APP_NAME)


@app.get("/health")
def health():
    return {
        "status": "ok",
        "env": settings.ENV,
        "debug": settings.DEBUG,
        "llm_model": settings.GOOGLE_LLM_MODEL,
        "embedding_model": settings.GOOGLE_EMBEDDING_MODEL,
        "top_k": settings.TOP_K
    }


@app.get("/")
def root():
    return {"message": "API funcionando, ir a /docs para ver documentación"}


app.include_router(rag.router, prefix="/api")
