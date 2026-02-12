import faiss

def save_index(vectors):
    dim = len(vectors[0])
    index = faiss.IndexFlatL2(dim)
    index.add(vectors)
    faiss.write_index(index, "index.faiss")
