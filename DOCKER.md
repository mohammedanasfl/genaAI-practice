# Docker Setup

## Files Created

- `rag_backend/requirements.txt` - Python dependencies
- `rag_backend/Dockerfile` - Backend container
- `rag_frontend/Dockerfile` - Frontend container
- `docker-compose.yml` - Orchestration
- `.env.example` - Environment template

## Quick Start

### 1. Setup Environment

```bash
cp .env.example .env
```

Edit `.env` and add your OpenAI API key:
```
OPENAI_API_KEY=sk-...
```

### 2. Run with Docker Compose

```bash
docker-compose up --build
```

Services:
- Backend: http://localhost:8000
- Frontend: http://localhost:3000

### 3. Stop Services

```bash
docker-compose down
```

## Individual Container Commands

### Backend Only

```bash
cd rag_backend
docker build -t rag-backend .
docker run -p 8000:8000 --env-file ../.env rag-backend
```

### Frontend Only

```bash
cd rag_frontend
docker build -t rag-frontend .
docker run -p 3000:3000 rag-frontend
```

## Volume Mounts

Docker Compose mounts:
- `uploads/` - Uploaded documents
- `doc_registry.json` - Document registry
- `index.faiss` - Vector index

Data persists between container restarts.
