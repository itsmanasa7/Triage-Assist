# Sahayak AI

> **AI-powered triage assistant for rural health workers**
> Built for the **Idea2Impact Hackathon 2026** | Theme 3: Crisis Management & HealthTech

---

## Problem

Rural health workers in India often face critical clinical decisions without specialist support. A community health worker attending a patient with "high fever and difficulty breathing" needs to know — *now* — whether this is routine or life-threatening.

**Triage Assist** accepts a free-text symptom description, retrieves the most semantically relevant case from a curated knowledge base, and returns a colour-coded triage recommendation in seconds — all encrypted at rest, with no personal data stored.

---

## Features

| Feature | Detail |
|---|---|
| Semantic symptom search | `all-MiniLM-L6-v2` sentence-transformer + ChromaDB vector search |
| Triage classification | Emergency / Urgent / Routine / Unclear with confidence score |
| Privacy-first logging | Fernet (AES-256) encrypted append-only log, UUID-only patient IDs |
| Mobile-first UI | Dark high-contrast design readable outdoors on phone screens |
| Rate limiting | 10 requests/IP/minute; 1000-char input cap |
| Offline-aware | Frontend shows "Cannot reach server" instead of crashing |

---

## Tech Stack

**Backend** — Python 3.11+, FastAPI, ChromaDB, cryptography (Fernet), Uvicorn

**Frontend** — Vite + React 19, react-router-dom v7, Vanilla CSS, Fetch API

---

## Architecture

```
Health Worker (Phone Browser)
        │
        │ HTTPS POST /triage
        ▼
┌───────────────────────────┐
│     FastAPI Backend        │
│  main.py                   │
│  ├─ Rate limiter (10/min)  │
│  ├─ Input validator        │
│  ├─ triage_engine.py ──────┼──▶ ChromaDB (chroma_db/)
│  └─ privacy.py ────────────┼──▶ logs.enc (AES-256)
└───────────────────────────┘
        │
        │ JSON response
        ▼
┌───────────────────────────┐
│   React Frontend (Vite)    │
│  ├─ LandingPage            │
│  └─ TriagePage             │
│      ├─ ResultCard          │
│      ├─ DisclaimerBanner    │
│      ├─ HowItWorks          │
│      └─ StatsFooter         │
└───────────────────────────┘
```

---

## Project Structure

```
triage-assist/
├── backend/
│   ├── data/
│   │   └── symptoms_dataset.json    # 50 curated rural-health scenarios
│   ├── main.py                      # FastAPI app, routes, rate limiter
│   ├── triage_engine.py             # ChromaDB query logic
│   ├── embeddings.py                # Build ChromaDB index from dataset
│   ├── privacy.py                   # AES-256 encryption for logs
│   ├── build_index.py               # One-time index builder
│   ├── start.sh                     # Render startup script
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── api/triageApi.js         # API client
│   │   ├── components/              # ResultCard, StatsFooter, etc.
│   │   ├── pages/                   # LandingPage, TriagePage
│   │   ├── App.jsx                  # Router setup
│   │   ├── App.css                  # Component styles
│   │   ├── index.css                # Design system
│   │   └── main.jsx                 # Entry point
│   ├── public/                      # Static assets
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── vercel.json                  # SPA rewrite rules
├── render.yaml                      # Render deployment config
├── .gitignore
└── README.md
```

---

## Setup

### Prerequisites

- Python 3.11+
- Node.js 18+

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # macOS/Linux
pip install -r requirements.txt
python build_index.py          # one-time: builds ChromaDB index
uvicorn main:app --reload --port 8000
```

API: `http://localhost:8000` · Docs: `http://localhost:8000/docs`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`

---

## API

| Method | Endpoint | Body | Response |
|---|---|---|---|
| POST | `/triage` | `{"symptoms": "string"}` | `{triage_level, condition, recommended_action, red_flags[], confidence}` |
| GET | `/health` | — | `{"status": "ok"}` |
| GET | `/logs/count` | — | `{"encrypted_log_count": N}` |

### Example

```bash
curl -X POST http://localhost:8000/triage \
  -H "Content-Type: application/json" \
  -d '{"symptoms": "child with high fever and difficulty breathing for 2 days, lips turning blue"}'
```

```json
{
  "triage_level": "emergency",
  "condition": "Pneumonia",
  "recommended_action": "Start antibiotics and arrange transport to health centre.",
  "red_flags": ["chest pain", "cyanosis"],
  "confidence": 0.87
}
```

---

## Deployment

**Backend → [Render](https://render.com)** (free tier)

1. Connect GitHub repo → New Web Service
2. Root Directory: `backend` · Build: `pip install -r requirements.txt` · Start: `bash start.sh`
3. Set env vars: `PYTHON_VERSION=3.11.0`, `ALLOWED_ORIGINS=https://your-app.vercel.app`

**Frontend → [Vercel](https://vercel.com)** (free tier)

1. Import repo → Framework: Vite · Root: `frontend`
2. Set env var: `VITE_API_URL=https://your-backend.onrender.com`
3. Redeploy after setting the variable (Vite reads it at build time)

---

## Environment Variables

| Location | Variable | Default | Purpose |
|---|---|---|---|
| Backend | `ALLOWED_ORIGINS` | `*` | CORS whitelist |
| Frontend | `VITE_API_URL` | `http://localhost:8000` | Backend API URL |
| Render | `PYTHON_VERSION` | — | Python runtime version |

---

## Knowledge Base

`backend/data/symptoms_dataset.json` — **50 curated rural-health scenarios** covering fever, malaria, dengue, diarrhea, dehydration, snake bites, pregnancy complications, respiratory distress, burns, malnutrition, hypertension, stroke, sepsis, meningitis, and more.

Each entry: `{id, symptoms[], condition, triage_level, recommended_action, red_flags[]}`

---

## Security

- Logs encrypted with AES-256 (Fernet) — only readable with `secret.key`
- No names or personal identifiers stored — UUID-only patient IDs
- Rate limiting: 10 requests/IP/minute
- Input sanitization: 1000-char max, non-empty validation
- CORS configurable via environment variable
- Files never committed: `secret.key`, `logs.enc`, `chroma_db/`

---

## Disclaimer

This tool assists triage decisions only. It is **not** a substitute for professional medical judgment. Always escalate emergency and unclear cases to a qualified doctor or health facility.

---

## License

MIT
