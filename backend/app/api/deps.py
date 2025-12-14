from app.rag.llm import ChatGemini
from app.rag.retriever import ChromaRetriever
from app.rag.vectorstore import load_collection
from app.rag.services import ConversationalRAG
from app.core.config import settings


def get_rag() -> ConversationalRAG:
    collection = load_collection(settings.CHROMA_COLLECTION)
    retriever = ChromaRetriever(
        collection=collection,
        k=settings.TOP_K,
        threshold=settings.SCORE_THRESHOLD,
    )
    llm = ChatGemini()

    return ConversationalRAG(llm=llm, retriever=retriever)
