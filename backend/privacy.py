import os
import json
from cryptography.fernet import Fernet

_DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
_KEY_PATH = os.path.join(_DATA_DIR, "secret.key")


def _load_or_create_key() -> bytes:
    os.makedirs(_DATA_DIR, exist_ok=True)
    if os.path.exists(_KEY_PATH):
        with open(_KEY_PATH, "rb") as fh:
            return fh.read()
    key = Fernet.generate_key()
    with open(_KEY_PATH, "wb") as fh:
        fh.write(key)
    return key


_KEY = _load_or_create_key()
_FERNET = Fernet(_KEY)


def encrypt_log(patient_id: str, symptoms: str, triage_result: dict) -> bytes:
    payload = {
        "patient_id": patient_id,
        "symptoms": symptoms,
        "triage_result": triage_result,
    }
    plaintext = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    return _FERNET.encrypt(plaintext)


def decrypt_log(encrypted_data: bytes, key: bytes = None) -> dict:
    fernet = Fernet(key) if key else _FERNET
    plaintext = fernet.decrypt(encrypted_data)
    return json.loads(plaintext.decode("utf-8"))