import json
from pathlib import Path
from typing import List, Dict


import json
from pathlib import Path
from typing import List, Dict


def load_cpe_json(json_path: Path) -> List[Dict]:
    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    docs: List[Dict] = []
    cont_disposiciones = 0

    for i, item in enumerate(data):

        # Asignacion de tipo y texto
        tipo = item.get("tipo", "").capitalize()
        text = ""

        if tipo == "Introduccion":
            text = (
                f"Título: {item.get('titulo', '')}\n"
                f"Subtítulo: {item.get('subtitulo', '')}\n"
                f"Contenido: {item.get('contenido', '')}"
            )

        elif tipo == "Articulo":
            text = (
                f"Parte {item.get('parte_num', '')}: {item.get('parte_nom', '')}\n"
                f"Título {item.get('titulo_num', '')}: {item.get('titulo_nom', '')}\n"
                f"Capítulo {item.get('capitulo_num', '')}: {item.get('capitulo_nom', '')}\n"
                f"Sección {item.get('seccion_num', '')}: {item.get('seccion_nom', '')}\n"
                f"Artículo {item.get('art_num', '')}: {item.get('nombre_juridico', '')}\n"
                f"Contenido: {item.get('contenido', '')}"
            )

        elif tipo == "Disposición":
            text = (
                f"Disposición {item.get('disposicion', '')}\n"
                f"Nombre jurídico: {item.get('nombre_juridico', '')}\n"
                f"Contenido: {item.get('contenido', '')}"
            )

        else:
            text = item.get("contenido", "")

        # Asignacion de ids
        if i < 2:
            doc_id = f"introduccion_{i + 1}"
            metadata = {"tipo": "introduccion", "numero": i + 1}

        elif i < 399:
            doc_id = f"articulo_{i - 1}"
            metadata = {"tipo": "articulo", "numero": i - 1}

        elif i == 399:
            doc_id = "articulo_398_A"
            metadata = {"tipo": "articulo", "numero": "398_A"}

        elif i == 400:
            doc_id = "articulo_398_B"
            metadata = {"tipo": "articulo", "numero": "398_B"}

        elif i < 414:
            doc_id = f"articulo_{i - 2}"
            metadata = {"tipo": "articulo", "numero": i - 2}

        else:
            cont_disposiciones += 1
            doc_id = f"disposicion_{cont_disposiciones}"
            metadata = {"tipo": "disposicion", "numero": cont_disposiciones}

        metadata = {
            "tipo": tipo,
            "titulo": item.get("titulo") or "",
            "subtitulo": item.get("subtitulo") or "",
            "parte_num": item.get("parte_num") or "",
            "parte_nom": item.get("parte_nom") or "",
            "titulo_num": str(item.get("titulo_num") or ""),
            "titulo_nom": item.get("titulo_nom") or "",
            "capitulo_num": item.get("capitulo_num") or "",
            "capitulo_nom": item.get("capitulo_nom") or "",
            "seccion_num": str(item.get("seccion_num") or ""),
            "seccion_nom": item.get("seccion_nom") or "",
            "art_num": str(item.get("art_num") or ""),
            "nombre_juridico": item.get("nombre_juridico") or "",
            "disposicion": item.get("disposicion") or ""
        }

        docs.append({
            "id": doc_id,
            "text": text.strip(),
            "metadata": metadata
        })

    assert len(docs) > 0
    return docs
