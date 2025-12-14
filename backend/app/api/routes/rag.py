from fastapi import APIRouter, Depends
from app.schemas.rag import RAGRequest, RAGResponse
from app.api.deps import get_rag
from app.rag.services import ConversationalRAG
from app.schemas.rag import RAGResponse, RAGRequest

router = APIRouter(prefix="/rag", tags=["RAG"])


@router.post("/ask", response_model=RAGResponse)
def ask_rag(payload: RAGRequest, rag: ConversationalRAG = Depends(get_rag),):
    result = rag.invoke(
        question=payload.question,
        chat_history=payload.chat_history,
    )
    return result
