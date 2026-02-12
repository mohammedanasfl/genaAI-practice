from docx import Document
from pypdf import PdfReader
import re

def load_text(file_path):
    if file_path.endswith(".pdf"):
        reader = PdfReader(file_path)
        text = ""
        for page in reader.pages:
            text += page.extract_text()
        return clean_text(text)

    if file_path.endswith(".docx"):
        doc = Document(file_path)
        return clean_text("\n".join([p.text for p in doc.paragraphs]))

    if file_path.endswith(".txt"):
        with open(file_path, "r", encoding="utf-8") as f:
            return clean_text(f.read())


def clean_text(text: str) -> str:
    # remove weird spacing
    text = re.sub(r'\s+', ' ', text)

    # fix broken words like "A NA s"
    text = re.sub(r'([A-Z])\s+([A-Z])', r'\1\2', text)

    # remove extra spaces
    text = text.strip()

    return text
