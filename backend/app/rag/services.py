from app.rag.prompts import build_reformulation_prompt, build_answer_prompt
from app.rag.sorting import merge_sort


class ConversationalRAG:
    def __init__(self, llm, retriever):
        self.llm = llm
        self.retriever = retriever

    def reformulate_question(self, question: str, chat_history: str | None):
        if not chat_history:
            return question

        prompt = build_reformulation_prompt(
            chat_history=chat_history,
            question=question
        )
        return self.llm.invoke(prompt).strip()

    def retrieve_context(self, question: str):
        results = self.retriever.invoke(question)

        documents = results["documents"]
        metadatas = results["metadatas"]
        ids = results["ids"]

        sources = []

        # Si queremos incluir el contenido poner True
        INCLUIR_CONTENIDO = False

        for doc, meta, doc_id in zip(documents, metadatas, ids):

            source_item = {
                "id": doc_id,
                "tipo": meta.get("tipo", "Desconocido"),
                "numero": meta.get("art_num") or meta.get("numero") or "",
                "titulo": meta.get("titulo") or meta.get("nombre_juridico") or "",
                "parte": f"{meta.get('parte_num', '')} {meta.get('parte_nom', '')}".strip(),
                "capitulo": f"{meta.get('capitulo_num', '')} {meta.get('capitulo_nom', '')}".strip(),

                "_texto_completo_para_ia": doc.strip()
            }

            if INCLUIR_CONTENIDO:
                source_item["contenido"] = doc.strip()

            sources.append(source_item)

            sources = merge_sort(sources)

        return sources

    def generate_answer(self, question: str, context: list[dict]) -> str:
        context_text = "\n\n".join(
            f"Tipo: {c.get('tipo', '')}\n"
            f"Número: {c.get('numero', '')}\n"
            f"Título: {c.get('titulo', '')}\n"
            f"Contenido: {c.get('_texto_completo_para_ia', '')}"
            for c in context
        )

        prompt = build_answer_prompt(
            context=context_text,
            question=question
        )

        return self.llm.invoke(prompt)

    def invoke(self, question: str, chat_history: str | None = None):
        reformulated = self.reformulate_question(question, chat_history)
        context = self.retrieve_context(reformulated)
        answer = self.generate_answer(reformulated, context)

        for c in context:
            if "_texto_completo_para_ia" in c:
                del c["_texto_completo_para_ia"]

        return {
            "question": question,
            "reformulated": reformulated,
            "answer": answer,
            "context": context,
        }
