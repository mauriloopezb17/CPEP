import random
import time

from pathlib import Path
from app.rag.ingestion import load_cpe_json
from app.rag.vectorstore import create_collection, add_documents


DATA_PATH = Path("data/cpe.json")
COLLECTION_NAME = "cpe"
BATCH_SIZE = 100

docs = load_cpe_json(DATA_PATH)

print(f"Se cargaron {len(docs)} documentos")

assert len(docs) > 0

random_document_id = random.choice(range(len(docs)))

sample = docs[random_document_id]
print("id: ", sample["id"])
print("metada: \n", sample["metadata"])
print("text: ", sample["text"][:500])

collection = create_collection(COLLECTION_NAME)

print(f"Iniciando ingesta de {len(docs)} documentos: ")

for i in range(0, len(docs), BATCH_SIZE):
    batch = docs[i:i+BATCH_SIZE]
    add_documents(collection, batch)
    print(f"Lote {(i // BATCH_SIZE) + 1} insertando ({len(batch)} docs)")
    time.sleep(5)

print("Base vectorial creada exitosamente")
