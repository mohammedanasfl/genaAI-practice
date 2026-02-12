import faiss
import numpy as np
from openai import OpenAI
from services.hash_registry import get_last_doc
from dotenv import load_dotenv
import os
load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
INDEX_PATH = "index.faiss"

def embed_query(query: str):
    res = client.embeddings.create(
        model="text-embedding-3-small",
        input=query
    )
    return np.array(res.data[0].embedding).astype("float32")

def search_chunks(query: str, k=3):
    last = get_last_doc()
    if not last:
        return []

    doc_hash, doc_info = last
    chunk_file = doc_info["chunk_file"]

    chunks = []
    with open(chunk_file, "r", encoding="utf-8") as f:
        raw = f.read().split("CHUNK ")
        for c in raw:
            c = c.strip()
            if c:
                chunks.append(c)

    index = faiss.read_index(INDEX_PATH)

    q_vec = embed_query(query)
    D, I = index.search(np.array([q_vec]), k)

    results = []
    for idx in I[0]:
        if idx < len(chunks):
            results.append(chunks[idx])

    return results
