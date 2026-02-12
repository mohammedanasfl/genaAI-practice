from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import os
from pydantic import BaseModel

from services.doc_loader import load_text
from services.chunker import chunk_text
from services.embedder import embed_chunks
from services.vector_store import save_index
from services.summarizer import generate_doc_suggestions
from services.hash_util import compute_doc_hash
from services.hash_registry import hash_exists, get_doc_info, save_doc
from services.retriever import search_chunks
from services.query_service import generate_answer_with_suggestions

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


class QueryRequest(BaseModel):
    question: str


@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    file_bytes = await file.read()
    doc_hash = compute_doc_hash(file_bytes)

    if hash_exists(doc_hash):
        info = get_doc_info(doc_hash)
        return {
            "message": "Document already exists",
            "filename": info["filename"],
            "summary": info["summary"],
            "hash": doc_hash
        }

    path = f"{UPLOAD_DIR}/{doc_hash}_{file.filename}"
    with open(path, "wb") as f:
        f.write(file_bytes)

    text = load_text(path)
    chunks = chunk_text(text)

    chunk_file = f"{UPLOAD_DIR}/{doc_hash}_chunks.txt"
    with open(chunk_file, "w", encoding="utf-8") as f:
        for i, c in enumerate(chunks):
            f.write(f"CHUNK {i+1} (len={len(c)} chars)\n")
            f.write(c + "\n\n")

    vectors = embed_chunks(chunks)
    save_index(vectors)

    suggestions = generate_doc_suggestions(text)

    save_doc(doc_hash, {
        "filename": file.filename,
        "summary": suggestions["summary"],
        "chunk_file": chunk_file
    })

    return {
        "message": "Document processed",
        "hash": doc_hash,
        "summary": suggestions["summary"],
        "suggested_questions": suggestions["questions"],
        "insights": suggestions["insights"]
    }


@app.post("/query")
async def query_doc(data: QueryRequest):

    chunks = search_chunks(data.question)

    if not chunks:
        return {"answer": "No document uploaded yet"}

    result = generate_answer_with_suggestions(data.question, chunks)

    return {
        "question": data.question,
        "answer": result["answer"],
        "follow_up_questions": result["questions"]
    }
