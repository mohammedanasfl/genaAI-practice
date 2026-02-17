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
    # Mark this document as the active one
    data["_active"] = doc_hash
    save_registry(data)

def get_last_doc():
    data = load_registry()
    if not data:
        return None
    
    # Check if there's an explicitly active document
    active_hash = data.get("_active")
    if active_hash and active_hash in data:
        return active_hash, data[active_hash]
    
    # Fallback to last document if no active marker
    doc_keys = [k for k in data.keys() if k != "_active"]
    if not doc_keys:
        return None
    
    last_hash = doc_keys[-1]
    return last_hash, data[last_hash]
