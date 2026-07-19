import json
import os
import chromadb

DATA_PATH = os.path.join(os.path.dirname(__file__), "data", "symptoms_dataset.json")
PERSIST_DIR = os.path.join(os.path.dirname(__file__), "chroma_db")
COLLECTION_NAME = "triage_kb"


def build_index():
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    ids = [entry["id"] for entry in data]
    documents = ["; ".join(entry["symptoms"]) for entry in data]
    metadatas = [
        {
            "condition": entry["condition"],
            "triage_level": entry["triage_level"],
            "recommended_action": entry["recommended_action"],
            "red_flags": ", ".join(entry["red_flags"]) if entry["red_flags"] else "",
        }
        for entry in data
    ]

    print(f"Building index for {len(data)} entries...")

    client = chromadb.PersistentClient(path=PERSIST_DIR)

    try:
        client.delete_collection(name=COLLECTION_NAME)
    except Exception:
        pass

    collection = client.create_collection(
        name=COLLECTION_NAME,
        metadata={"hnsw:space": "cosine"},
    )

    collection.add(
        documents=documents,
        ids=ids,
        metadatas=metadatas,
    )
    print(f"Indexed {len(ids)} entries into ChromaDB at {PERSIST_DIR}")


if __name__ == "__main__":
    build_index()