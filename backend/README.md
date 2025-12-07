---
title: Api Document Extractor
emoji: 💻
colorFrom: gray
colorTo: purple
sdk: docker
pinned: false
---

Check out the configuration reference at https://huggingface.co/docs/hub/spaces-config-reference

# Backend - AI Document Extractor API 🚀

A high-performance FastAPI backend for intelligent document processing. Handles OCR extraction and LLM-powered data structuring with rate limiting and error handling.

## 🎯 Features

- ✅ **FastAPI Framework**: Modern, fast, production-ready
- ✅ **RapidOCR Integration**: High-accuracy OCR processing
- ✅ **Groq LLM Integration**: llama3.3-70B for intelligent data extraction
- ✅ **Rate Limiting**: Built-in request throttling
- ✅ **Async Support**: Non-blocking I/O operations
- ✅ **Comprehensive Logging**: Using loguru
- ✅ **Error Handling**: Custom exception classes
- ✅ **Docker Ready**: Includes Dockerfile for easy deployment

---

## 📋 Prerequisites

- **Python 3.11+**
- **uv** package manager (recommended) - [Install here](https://docs.astral.sh/uv/getting-started/installation/)
- **Groq API Key** - [Get one here](https://console.groq.com/)
- **Git** (for cloning)

---

## 🚀 Quick Start

### 1. Clone the Repository

```bash
# Clone the main repository
git clone https://github.com/fahmiaziz98/ai-document-extractor.git
cd ai-document-extractor/backend

# Or if you forked it
git clone https://github.com/YOUR_USERNAME/ai-document-extractor.git
cd ai-document-extractor/backend
```

### 2. Create Virtual Environment

```bash
# Using venv
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate
# On Windows: venv\Scripts\activate

# Verify activation
which python  # Should show path inside venv
```

### 3. Install Dependencies

```bash
# Using uv (recommended - fastest)
uv sync

# Or install only production dependencies
uv sync --frozen --no-dev

# using make
make dev
```

### 4. Setup Environment Variables

```bash
# Create .env file
touch .env

# Add your Groq API Key
echo "GROQ_API_KEY=your_api_key_here" >> .env
```

Or manually create `.env`:
```env
GROQ_API_KEY=gsk_your_groq_api_key_here
```

## 🏃 Running the Application

### Development Mode
```bash
make run
```

Access API at: http://localhost:7860

API Docs: http://localhost:7860/docs

### Production Mode
```bash
make run-prod
```

### Using Docker
```bash
# Build image
make docker-build

# Run container
make docker-run

# View logs
make docker-logs

# Stop container
make docker-stop
```

## 📚 Available Commands
```bash
make help          # Show all available commands
make install       # Install production dependencies
make dev           # Install all dependencies (including dev)
make clean         # Clean cache and temporary files
make lint          # Run ruff linter
make format        # Format code with ruff
make check         # Run linter and formatter check
make fix           # Auto-fix linting issues
make run           # Run development server
make run-prod      # Run production server
make docker-build  # Build Docker image
make docker-run    # Run Docker container
make all           # Run complete CI pipeline
```

Server will start at: `http://localhost:7860`
## 📚 API Documentation

### Automatic Documentation

Once running, access interactive API docs:

- **Swagger UI**: `http://localhost:7860/docs`
- **ReDoc**: `http://localhost:7860/redoc`

### Health Check
```bash
curl http://localhost:7860/api/v1/health
```

### Extract Document (Default Schema)
```bash
curl -X POST http://localhost:7860/api/v1/extract \
  -F "file=@invoice.pdf"
```

### Extract with Custom Schema
```bash
curl -X POST http://localhost:7860/api/v1/extract \
  -F "file=@invoice.pdf" \
  -F 'schema_config={
    "company_name": {
      "type": "string",
      "description": "Company name",
      "required": true
    },
    "total": {
      "type": "number",
      "description": "Total amount",
      "required": true
    }
  }'
```
---

## 🏗️ Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI app initialization
│   ├── api/
│   │   ├── __init__.py
│   │   ├── dependencies.py    # Dependency injection
│   │   └── v1/
│   │       ├── __init__.py
│   │       └── endpoints.py   # API route handlers
│   ├── services/
│   │   ├── __init__.py
│   │   ├── ocr_service.py     # OCR processing logic
│   │   └── llm_service.py     # LLM integration
│   └── core/
│       ├── __init__.py
│       ├── exception.py       # Custom exceptions
│       └── limiter.py         # Rate limiting config
├── requirements.txt           # Python dependencies
├── pyproject.toml            # Project metadata & config
├── Dockerfile                # Docker configuration
├── Makefile                  # Development tasks
├── .env.example              # Environment template
└── README.md                 # This file
```

---

## 🔧 Dependencies

### Core Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `fastapi` | 0.118.3 | Web framework |
| `uvicorn` | 0.38.0 | ASGI server |
| `groq` | 0.37.1 | Groq LLM API |
| `rapidocr-onnxruntime` | 1.4.4 | OCR processing |
| `pdf2image` | 1.17.0 | PDF to image conversion |
| `pillow` | 11.3.0 | Image processing |
| `opencv-python` | 4.12.0.88 | Computer vision |
| `slowapi` | 0.1.9 | Rate limiting |
| `loguru` | 0.7.3 | Logging |
| `python-dotenv` | 1.2.1 | Environment config |
| `python-multipart` | 0.0.20 | Form data parsing |

### Dev Dependencies

Dev dependencies are automatically included when running:
```bash
uv sync
```

This installs: ruff, pytest, pytest-asyncio, and httpx
---

## 🐳 Docker Setup

### Build Docker Image

```bash
docker build -t idp-backend:latest .
```

### Run Container

```bash
# With environment file
docker run -p 7860:7860 \
  --env-file .env \
  idp-backend:latest

# Or with direct env var
docker run -p 7860:7860 \
  -e GROQ_API_KEY=your_key \
  idp-backend:latest
```
---

## 🔐 Security Considerations

1. **API Keys**: Never commit `.env` file to git
2. **CORS**: Configure appropriately for frontend domain
3. **Rate Limiting**: Built-in protection against abuse

### CORS Configuration

Edit `app/main.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://yourdomain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 🚢 Deployment

### Deploy to Render

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Update backend"
   git push origin main
   ```

2. **Connect to Render**
   - Go to [render.com](https://render.com)
   - Create new Web Service
   - Connect GitHub repository
   - Set build command: `pip install -r requirements.txt`
   - Set start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

3. **Add Environment Variables**
   - `GROQ_API_KEY`: Your Groq API key

### Deploy to Railway

1. Connect GitHub repository
2. Railway auto-detects Python project
3. Add `GROQ_API_KEY` environment variable
4. Deploy!

### Deploy to AWS Lambda

```bash
# Package for Lambda
pip install -r requirements.txt -t ./package

# Use serverless framework or AWS SAM
serverless deploy
```

---

### Make Commands

```bash
# Install dependencies (all including dev)
make dev

# Install only production dependencies
make install

# Run development server
make run

# Run production server
make run-prod

# Format code
make format

# Lint and fix code
make lint
make fix
### Code Style

Using `ruff` for linting and formatting via uv:

```bash
# Format code
uv run ruff format app/

# Check linting
uv run ruff check app/

# Or use make
make format
make lint
``` Code Style

### Import Errors

```bash
# Reinstall dependencies
uv sync --force-reinstall

# Clear Python cache
make clean
```
---

## 🐛 Troubleshooting

### OCR Not Working

```bash
# Reinstall dependencies
uv sync --force-reinstall

# Check if ONNX runtime is available
uv run python -c "import onnxruntime; print(onnxruntime.__version__)"
```-rf .pytest_cache
```
### Port Already in Use

```bash
# Find process using port 8000
lsof -i :8000

# Kill process
kill -9 <PID>

# Or use different port
uv run uvicorn app.main:app --reload --port 8001
``` Port Already in Use

```bash
# Find process using port 8000
lsof -i :8000

# Kill process
kill -9 <PID>

# Or use different port
### Groq API Errors

```bash
# Verify API key is valid
uv run python -c "from groq import Groq; print('API Key OK')"

# Check API key format
echo $GROQ_API_KEY  # Should start with 'gsk_'

# Get new key at https://console.groq.com/
```o $GROQ_API_KEY  # Should start with 'gsk_'

# Get new key at https://console.groq.com/
```

### Memory Issues
### Memory Issues

```bash
# Increase memory limit in Docker
docker run -m 2g idp-backend:latest

# Reduce number of workers
uv run uvicorn app.main:app --workers 2
```
---

## 📈 Performance Optimization

### Async Processing

All endpoints use async/await for non-blocking I/O:

```python
@app.post("/api/v1/extract")
async def extract_document(file: UploadFile):
    # Non-blocking file reading
    content = await file.read()
```

### Workers
### Workers

Increase workers for production:

```bash
# Using uv
uv run uvicorn app.main:app --workers 4

# Or using make
make run-prod
```
---

## 📚 Learning Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Groq API Docs](https://console.groq.com/docs)
- [RapidOCR GitHub](https://github.com/RapidAI/RapidOCR)
- [Python Async/Await](https://docs.python.org/3/library/asyncio.html)

---

## 📧 Support

- 🐛 Found a bug? [Open an issue](https://github.com/fahmiaziz98/ai-document-extractor/issues)
- 💡 Have a feature idea? [Start a discussion](https://github.com/fahmiaziz98/ai-document-extractor/discussions)
- 📖 Need help? Check [API docs](http://localhost:8000/docs)
