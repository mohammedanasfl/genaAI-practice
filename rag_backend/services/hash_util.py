import hashlib

def compute_doc_hash(file_bytes: bytes) -> str:
    """Create SHA256 hash from file bytes."""
    return hashlib.sha256(file_bytes).hexdigest()

