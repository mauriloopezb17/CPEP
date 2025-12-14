import chromadb
from app.core.config import settings
from app.rag.embeddings import GeminiEmbeddingFunction


def get_chroma_client():
    return chromadb.PersistentClient(
        path=settings.CHROMA_DB_PATH
    )


def create_collection(name: str):
    client = get_chroma_client()
    return client.create_collection(
        name=name,
        embedding_function=GeminiEmbeddingFunction(),
    )


def add_documents(collection, docs: list[dict]):
    collection.add(
        documents=[d["text"] for d in docs],
        ids=[d["id"] for d in docs],
        metadatas=[d["metadata"] for d in docs],
    )


def query_similar(collection, query_vector, k: int = 5):
    return collection.query(
        query_embeddings=[query_vector],
        n_results=k,
    )


def load_collection(name: str):
    client = chromadb.PersistentClient(path=settings.CHROMA_DB_PATH)
    return client.get_collection(
        name=name,
        embedding_function=GeminiEmbeddingFunction(),
    )
