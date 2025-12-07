# AI Document Extractor 📄

A modern, full-stack application for Intelligent Document Processing (IDP). Define custom data schemas, upload documents (PDF/Images), and extract structured data using AI-powered OCR and LLM services.

## 🎯 Features
- **Dynamic Schema Builder**: Define fields, data types, and descriptions on the fly
- **Drag & Drop Upload**: Supports PDF, JPG, PNG, WEBP formats
- **AI Extraction**: Powered by RapidOCR + Groq (llama3.3-70B)
- **Results Viewer**: Syntax highlighted JSON and formatted data tables
- **FastAPI Backend**: High-performance, production-ready API
- **Rate Limiting**: Built-in request throttling with slowapi

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Language**: TypeScript

### Backend
- **Framework**: FastAPI 0.118+
- **Server**: Uvicorn
- **OCR**: RapidOCR (ONNX Runtime)
- **LLM**: Groq API (llama3.3-70B)
- **Image Processing**: Pillow, OpenCV, pdf2image

---

## 📋 Prerequisites

Before you begin, ensure you have:
- **Node.js** 16+ and npm/yarn (for frontend)
- **Python** 3.11+ (for backend)
- **Git** installed
- **Groq API Key** ([Get one here](https://console.groq.com/))

---

## 🚀 Quick Start

### Clone & Fork

1. **Fork the Repository** (optional, if you want to contribute)
   - Go to the [GitHub repository](https://github.com/fahmiaziz98/ai-document-extractor)
   - Click **Fork** button

2. **Clone the Repository**
   ```bash
   # If you forked it
   git clone https://github.com/YOUR_USERNAME/ai-document-extractor.git
   
   # Or the original repository
   git clone https://github.com/fahmiaziz98/ai-document-extractor.git
   
   cd ai-document-extractor
   ```

---

## 🏗️ Installation & Setup

### Backend Setup (Python/FastAPI)

1. **Navigate to Backend**
   ```bash
   cd backend
   ```

2. **Create Virtual Environment**
   ```bash
   # Using venv
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install Dependencies**
   ```bash
   # Using pip
   pip install -r requirements.txt
   
   # Or using uv (faster)
   uv pip install -r requirements.txt
   ```

4. **Create Environment File**
   ```bash
   cp .env.example .env
   # or create manually
   touch .env
   ```
   
   Add your Groq API Key:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   ```

5. **Run Development Server**
   ```bash
   # Using make (if available)
   make run
   
   # Or directly with uvicorn
   uvicorn app.main:app --reload --host 0.0.0.0 --port 7860
   ```

   Backend will be available at: `http://localhost:7860`

### Frontend Setup (React/Vite)

1. **Navigate to Frontend**
   ```bash
   cd frontend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Create Environment File**
   ```bash
   cp .env.example .env
   # or create manually
   touch .env
   ```
   
   Add your API configuration:
   ```env
   VITE_API_URL=http://localhost:7860
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

   Frontend will be available at: `http://localhost:5173`

5. **Build for Production**
   ```bash
   npm run build
   yarn build
   ```

---

## 🐳 Docker Setup (Optional)

### Run with Docker Compose

```bash
docker-compose up --build
```

This will start both frontend (port 3000) and backend (port 7860).

### Build Individual Containers

**Backend:**
```bash
cd backend
docker build -t idp-backend .
docker run -p 7860:7860 -e GROQ_API_KEY=your_key idp-backend
```

**Frontend:**
```bash
cd frontend
docker build -t idp-frontend .
docker run -p 3000:3000 idp-frontend
```
---

## 📝 Project Structure

```
ai-document-extractor/
├── backend/                    # FastAPI backend
│   ├── app/
│   │   ├── main.py            # FastAPI app entry
│   │   ├── api/
│   │   │   └── v1/
│   │   │       └── endpoints.py  # API routes
│   │   ├── services/
│   │   │   ├── ocr_service.py    # OCR processing
│   │   │   └── llm_service.py    # LLM integration
│   │   └── core/
│   │       ├── exception.py      # Exception handling
│   │       └── limiter.py        # Rate limiting
│   ├── requirements.txt        # Python dependencies
│   ├── pyproject.toml         # Project config
│   └── Dockerfile
│
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── App.tsx           # Main app component
│   │   └── types.ts          # TypeScript types
│   ├── package.json          # Node dependencies
│   ├── vite.config.ts        # Vite config
│   └── Dockerfile
│
└── README.md                  # This file
```

---

## 🚢 Deployment

### Deploy Backend to Render/Railway

1. Push code to GitHub
2. Connect repository to deployment platform
3. Set environment variable: `GROQ_API_KEY`
4. Deploy!

### Deploy Frontend to Vercel/Netlify

1. Connect GitHub repository
2. Set `VITE_API_URL` to your deployed backend URL
3. Deploy!
 
---

## 🛠️ Troubleshooting

### Backend Issues

**Module Not Found Error:**
```bash
# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

**Port Already in Use:**
```bash
# Change port in command
uvicorn app.main:app --port 8001
```

**Groq API Key Error:**
```bash
# Verify .env file exists in backend directory
# Check API key is valid at https://console.groq.com/
```

### Frontend Issues

**CORS Error:**
- Ensure backend is running
- Check `VITE_API_URL` in `.env`

**Module Not Found:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Submit a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 📧 Support

For issues or questions:
- Open an [GitHub Issue](https://github.com/fahmiaziz98/ai-document-extractor/issues)
- Check existing documentation in `/docs`
- Review API docs at `http://localhost:7860/docs`
