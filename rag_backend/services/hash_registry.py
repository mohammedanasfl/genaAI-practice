import json
import os

REGISTRY_FILE = "doc_registry.json"

def load_registry():
    if not os.path.exists(REGISTRY_FILE):
        return {}
    with open(REGISTRY_FILE, "r") as f:
        return json.load(f)

def save_registry(data):
    with open(REGISTRY_FILE, "w") as f:
        json.dump(data, f, indent=2)

def hash_exists(doc_hash: str):
    data = load_registry()
    return doc_hash in data

def get_doc_info(doc_hash: str):
    data = load_registry()
    return data.get(doc_hash)

def save_doc(doc_hash: str, info: dict):
    data = load_registry()
    data[doc_hash] = info
    save_registry(data)
def get_last_doc():
    data = load_registry()
    if not data:
        return None

    last_hash = list(data.keys())[-1]
    return last_hash, data[last_hash]
