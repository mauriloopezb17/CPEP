from pydantic import BaseModel
from typing import Optional, List, Union


class RAGRequest(BaseModel):
    question: str
    chat_history: Optional[str] = None


class Source(BaseModel):
    id: Optional[Union[int, str]] = None
    tipo: Optional[str] = None
    numero: Optional[Union[int, str]] = None
    titulo: Optional[str] = None
    parte: Optional[str] = None
    capitulo: Optional[str] = None
    # En caso de usar contenido y ponerlo true, cambiar el nombre a contenido
    texto: Optional[str] = None


class RAGResponse(BaseModel):
    question: str
    reformulated: str
    answer: str
    context: List[Source]
