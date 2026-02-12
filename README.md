# GenAI Practice - RAG Backend

A simple, beginner-friendly **Retrieval-Augmented Generation (RAG)** backend built with FastAPI and OpenAI.

## Features

- 📄 **Document Upload & Processing**: Upload PDF documents and automatically extract, chunk, and embed text
- 🔍 **Semantic Search**: FAISS-powered vector search for finding relevant document chunks
- 💬 **Q&A with Context**: Ask questions and get answers based on uploaded documents
- 🤖 **AI-Powered Suggestions**: Automatic document summarization with suggested questions and insights
- 🔐 **Duplicate Detection**: Hash-based document deduplication to avoid reprocessing

## Tech Stack

- **FastAPI** - Modern web framework
- **OpenAI API** - Embeddings (`text-embedding-3-small`) and Chat Completions (`gpt-4o-mini`)
- **FAISS** - Vector similarity search
- **PyPDF2** - PDF text extraction
- **Python 3.10+**

## Project Structure

```
rag_backend/
├── app.py                      # Main FastAPI application
├── services/
│   ├── doc_loader.py          # PDF text extraction
│   ├── chunker.py             # Text chunking logic
│   ├── embedder.py            # OpenAI embeddings
│   ├── vector_store.py        # FAISS index management
│   ├── summarizer.py          # Document analysis & suggestions
│   ├── retriever.py           # Semantic search
│   ├── query_service.py       # Answer generation with follow-ups
│   ├── hash_util.py           # Document hashing
│   └── hash_registry.py       # Document registry management
└── uploads/                    # Uploaded files & chunks (gitignored)
```

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/mohammedanasfl/genaAI-practice.git
cd genaAI-practice
```

### 2. Create virtual environment

```bash
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac
```

### 3. Install dependencies

```bash
pip install fastapi uvicorn openai faiss-cpu PyPDF2 python-dotenv
```

### 4. Set up environment variables

Create a `.env` file in the `rag_backend` directory:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

### 5. Run the server

```bash
cd rag_backend
uvicorn app:app --reload
```

The API will be available at `http://localhost:8000`

## API Endpoints

### 📤 Upload Document

**POST** `/upload`

Upload a PDF document for processing.

```bash
curl -X POST "http://localhost:8000/upload" \
  -F "file=@document.pdf"
```

**Response:**
```json
{
  "message": "Document processed",
  "hash": "abc123...",
  "summary": "Document summary...",
  "suggested_questions": ["Question 1?", "Question 2?", "Question 3?"],
  "insights": ["Insight 1", "Insight 2", "Insight 3"]
}
```

### 💬 Query Document

**POST** `/query`

Ask a question about the uploaded document.

```bash
curl -X POST "http://localhost:8000/query" \
  -H "Content-Type: application/json" \
  -d '{"question": "What is this document about?"}'
```

**Response:**
```json
{
  "question": "What is this document about?",
  "answer": "Based on the context...",
  "follow_up_questions": ["Follow-up 1?", "Follow-up 2?", "Follow-up 3?"]
}
```

## How It Works

1. **Upload**: PDF is uploaded → text extracted → split into chunks → embedded using OpenAI
2. **Index**: Embeddings stored in FAISS vector index for fast similarity search
3. **Query**: User question → embedded → similar chunks retrieved → sent to GPT for answer generation
4. **Suggestions**: Document analyzed by GPT to generate summary, questions, and insights

## Future Enhancements

- [ ] Support for multiple document formats (DOCX, TXT, etc.)
- [ ] Multi-document querying
- [ ] Conversation history
- [ ] Frontend interface
- [ ] User authentication
- [ ] Advanced chunking strategies

## License

MIT

## Author

Mohammed Anas