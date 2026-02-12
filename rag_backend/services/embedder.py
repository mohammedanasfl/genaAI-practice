from openai import OpenAI
import numpy as np
import os
import dotenv
dotenv.load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def embed_chunks(chunks):
    vectors = []

    for c in chunks:
        res = client.embeddings.create(
            model="text-embedding-3-small",
            input=c
        )
        vectors.append(res.data[0].embedding)

    return np.array(vectors).astype("float32")
