from langchain_community.document_loaders import JSONLoader
from langchain_core.documents import Document
import json
import os

with open('cpe.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

docs = []

for item in data:
    tipo = item.get("tipo", "").capitalize()

    if tipo == "Introducción":
        text = (
            f"Título: {item.get('titulo', '')}\n"
            f"Subtítulo: {item.get('subtitulo', '')}\n"
            f"{item.get('contenido', '')}"
        )
    elif tipo == "Articulo":
        text = (
            f"Parte {item.get('parte_num', '')}: {item.get('parte_nom', '')}\n"
            f"Titulo {item.get('titulo_num', '')}: {item.get('titulo_nom', '')}\n"
            f"Capítulo {item.get('capitulo_num', '')}: {item.get('capitulo_nom', '')}\n"
            f"Sección {item.get('seccion_num', '')}: {item.get('seccion_nom', '')}\n"
            f"Artículo {item.get('articulo_num', '')}: {item.get('nombre_juridico', '')}\n"
            f"{item.get('contenido', '')}"
        )
    elif tipo == "Disposición":
        text = (
            f"Disposición {item.get('disposicion', '')}\n"
            f"Nombre jurídico: {item.get('nombre_juridico', '')}\n"
            f"{item.get('contenido', '')}"
        )
    else:
        text = item.get("contenido", "")
    docs.append(Document(page_content=text, metadata={"tipo": tipo}))

print(f"Se cargaron {len(docs)} documentos")
