import faiss

def save_index(vectors):
    dim = len(vectors[0])
    print(dim)
    index = faiss.IndexFlatL2(dim)
    print(index)
    index.add(vectors)
    faiss.write_index(index, "index.faiss")
