def get_sort_key(doc: dict):
    doc_id = doc.get("id", "").lower()

    partes = doc_id.split("_")

    tipo = partes[0]

    if tipo == "introduccion":
        tipo_orden = 0
    elif tipo == "articulo":
        tipo_orden = 1
    else:
        tipo_orden = 2

    # casos:
    # introduccion_2: ["introduccion", "2"]
    # articulo_398_A: ["articulo", "398", "A"]

    if len(partes) == 2:
        numero = int(partes[1])
        sufijo = ""
    elif len(partes) == 3:
        numero = int(partes[1])
        sufijo = partes[2]
    else:
        numero = 0
        sufijo = ""

    return (tipo_orden, numero, sufijo)


def merge_sort(arr):
    if len(arr) <= 1:
        return arr

    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])

    return merge(left, right)


def merge(left, right):
    result = []
    i = j = 0

    while i < len(left) and j < len(right):
        if get_sort_key(left[i]) <= get_sort_key(right[j]):
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1

    result.extend(left[i:])
    result.extend(right[j:])
    return result
