#!/usr/bin/env bash
set -e

if [ ! -d "chroma_db" ]; then
  python build_index.py
fi

exec uvicorn main:app --host 0.0.0.0 --port "${PORT:-8000}"