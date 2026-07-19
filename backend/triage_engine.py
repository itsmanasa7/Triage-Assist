import os
import chromadb

PERSIST_DIR = os.path.join(os.path.dirname(__file__), "chroma_db")
COLLECTION_NAME = "triage_kb"
CONFIDENCE_THRESHOLD = 0.75

_client = chromadb.PersistentClient(path=PERSIST_DIR)
_collection = _client.get_collection(name=COLLECTION_NAME)


def get_triage(user_symptoms: str) -> dict:
    results = _collection.query(
        query_texts=[user_symptoms],
        n_results=3,
        include=["metadatas", "distances"],
    )
    metadatas = results["metadatas"][0]
    distances = results["distances"][0]

    similarities = [1 - (d / 2) for d in distances]

    best_meta = metadatas[0]
    confidence = round(similarities[0], 4)

    if confidence < CONFIDENCE_THRESHOLD:
        return {
            "triage_level": "unclear",
            "condition": None,
            "recommended_action": "Symptoms are ambiguous. Please seek in-person evaluation by a qualified health worker.",
            "red_flags": [],
            "confidence": confidence,
        }

    red_flags_raw = best_meta.get("red_flags", "")
    red_flags = [r.strip() for r in red_flags_raw.split(",") if r.strip()] if red_flags_raw else []

    return {
        "triage_level": best_meta.get("triage_level"),
        "condition": best_meta.get("condition"),
        "recommended_action": best_meta.get("recommended_action"),
        "red_flags": red_flags,
        "confidence": confidence,
    }