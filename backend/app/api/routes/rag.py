from fastapi import APIRouter, Depends
from app.schemas.rag import RAGRequest, RAGResponse
from app.api.deps import get_rag
from app.rag.services import ConversationalRAG
from app.schemas.rag import RAGResponse, RAGRequest

router = APIRouter(prefix="/rag", tags=["RAG"])


@router.post("/ask", response_model=RAGResponse)
def ask_rag(payload: RAGRequest, rag: ConversationalRAG = Depends(get_rag),):
    try:
        print(f"DEBUG: Processing request with question: '{payload.question}' and history length: {len(payload.chat_history) if payload.chat_history else 0}")
        if payload.chat_history:
             print(f"DEBUG: History preview: {payload.chat_history[:50]}...")

        result = rag.invoke(
            question=payload.question,
            chat_history=payload.chat_history,
        )
        return result
    except Exception as e:
        import traceback
        error_msg = f"ERROR in /ask: {str(e)}\n{traceback.format_exc()}"
        print(error_msg)
        # Re-raise to let FastAPI return 500, but now we have logs in console
        raise e
