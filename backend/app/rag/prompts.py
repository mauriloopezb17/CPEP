# Reformulacion de pregunta, en base al historial previo
STANDALONE_QUESTION_TEMPLATE = """
Dada la siguiente conversación y una pregunta de seguimiento,
reformula la pregunta de seguimiento para que sea una pregunta independiente, clara y completa,
manteniendo su significado original y en el mismo idioma (español).

No respondas la pregunta. Solo devuelve la pregunta reformulada.

Historial de chat:
{chat_history}

Pregunta de seguimiento:
{question}

Pregunta independiente:
""".strip()


def build_reformulation_prompt(chat_history: str | None, question: str) -> str:
    return STANDALONE_QUESTION_TEMPLATE.format(
        chat_history=chat_history or "No hay historial previo.",
        question=question
    )

# Generacion de la respuesta final


def answer_template(language: str = "Spanish") -> str:
    return f"""
Eres un asistente especializado en la Constitución Política del Estado Plurinacional de Bolivia.

Responde la siguiente pregunta utilizando únicamente la información proporcionada
en el contexto delimitado por <context>.

Debes:
- Responder en el idioma solicitado
- Citar explícitamente artículos, disposiciones o secciones usadas

Si la información no es suficiente o no se encuentra en el contexto, responde exactamente:
"No tengo información suficiente en la Constitución para responder a esta pregunta."

<context>
{{context}}
</context>

Pregunta: {{question}}

Idioma: {language}
""".strip()


def build_answer_prompt(context: str, question: str, language: str = "Spanish") -> str:
    template = answer_template(language)
    return template.format(
        context=context,
        question=question
    )
