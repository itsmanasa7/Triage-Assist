import os
import time
import uuid
from collections import defaultdict
from typing import Dict, List

from fastapi import FastAPI, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from pydantic import BaseModel, field_validator

from triage_engine import get_triage
from privacy import encrypt_log

app = FastAPI(title="Sahayak AI", version="1.0.0")

_raw_origins = os.getenv("ALLOWED_ORIGINS", "*")
_origins = [o.strip() for o in _raw_origins.split(",")] if _raw_origins != "*" else ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

_DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
_LOG_PATH = os.path.join(_DATA_DIR, "logs.enc")

_RATE_WINDOW = 60
_RATE_LIMIT = 10
_rate_store: Dict[str, List[float]] = defaultdict(list)


def _check_rate_limit(ip: str) -> None:
    now = time.time()
    _rate_store[ip] = [t for t in _rate_store[ip] if now - t < _RATE_WINDOW]
    if len(_rate_store[ip]) >= _RATE_LIMIT:
        raise HTTPException(
            status_code=429,
            detail=f"Rate limit exceeded: max {_RATE_LIMIT} requests per {_RATE_WINDOW}s.",
        )
    _rate_store[ip].append(now)


MAX_SYMPTOM_CHARS = 1000


class TriageRequest(BaseModel):
    symptoms: str

    @field_validator("symptoms")
    @classmethod
    def validate_symptoms(cls, v: str) -> str:
        stripped = v.strip()
        if not stripped:
            raise ValueError("Symptoms field must not be empty.")
        if len(stripped) > MAX_SYMPTOM_CHARS:
            raise ValueError(
                f"Symptom description too long (max {MAX_SYMPTOM_CHARS} characters)."
            )
        return stripped


@app.exception_handler(RequestValidationError)
async def validation_error_handler(request: Request, exc: RequestValidationError):
    msgs = [e.get("msg", "Invalid input") for e in exc.errors()]
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": msgs},
    )


def _append_log(patient_id: str, symptoms: str, triage_result: dict) -> None:
    os.makedirs(_DATA_DIR, exist_ok=True)
    encrypted = encrypt_log(patient_id, symptoms, triage_result)
    with open(_LOG_PATH, "ab") as fh:
        fh.write(encrypted + b"\n")


def _count_logs() -> int:
    if not os.path.exists(_LOG_PATH):
        return 0
    with open(_LOG_PATH, "rb") as fh:
        return sum(1 for line in fh if line.strip())


@app.post("/triage")
async def triage(request_data: TriageRequest, request: Request):
    client_ip = request.client.host if request.client else "unknown"
    _check_rate_limit(client_ip)
    result = get_triage(request_data.symptoms)
    patient_id = str(uuid.uuid4())
    _append_log(patient_id, request_data.symptoms, result)
    return result


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.get("/logs/count")
async def logs_count():
    count = _count_logs()
    return {"encrypted_log_count": count}