# Frontend - AI Document Extractor UI 🎨

A modern, responsive React 19 + Vite application for intelligent document processing. Features a dynamic schema builder, document upload, and real-time results viewing.

## 🎯 Features

- ✅ **Dynamic Schema Builder**: Create custom extraction fields on-the-fly
- ✅ **Drag & Drop Upload**: Intuitive file upload (PDF, JPG, PNG, WEBP)
- ✅ **Real-time Processing**: Async document extraction with loading states
- ✅ **Results Viewer**: JSON syntax highlighting + formatted data tables
- ✅ **Responsive Design**: Works on desktop, tablet, and mobile
- ✅ **TypeScript**: Full type safety
- ✅ **Tailwind CSS**: Modern utility-first styling
- ✅ **Fast Build**: Vite for instant dev server startup

---

## 📋 Prerequisites

- **Node.js 16+** (Node 18+ recommended)
- **npm 8+** or **yarn 3+**
- **Git** (for cloning)
- Backend API running (optional for development)

---

## 🚀 Quick Start

### 1. Clone the Repository

```bash
# Clone the main repository
git clone https://github.com/fahmiaziz98/ai-document-extractor.git
cd ai-document-extractor/frontend

# Or if you forked it
git clone https://github.com/YOUR_USERNAME/ai-document-extractor.git
cd ai-document-extractor/frontend
```

### 2. Install Dependencies

```bash
# Using npm
npm install

# Or using yarn
yarn install

# Or using pnpm
pnpm install
```

### 3. Setup Environment Variables

```bash
# Create .env file
touch .env

# Add configuration
echo "VITE_API_URL=http://localhost:7860" >> .env
```

Or manually create `.env`:
```env
# API Configuration
VITE_API_URL=http://localhost:7860
```

### 4. Run Development Server

```bash
# Using npm
npm run dev

# Or using yarn
yarn dev

# Or using pnpm
pnpm dev
```

Development server will start at: `http://localhost:3000`

### 5. Build for Production

```bash
# Using npm
npm run build

# Or using yarn
yarn build

# Preview production build
npm run preview
```

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── FileUpload.tsx          # File upload component
│   │   ├── Header.tsx              # App header
│   │   ├── ResultsViewer.tsx       # Results display
│   │   └── SchemaBuilder.tsx       # Schema definition UI
│   ├── constants.ts                # App constants
│   └── types.ts                    # TypeScript types
|
├── App.tsx                         # Main app component
├── index.tsx                       # React entry point
├── index.html                      # HTML template
├── Dockerfile                      # Dockerfile
├── package.json                    # Dependencies & scripts
├── tsconfig.json                   # TypeScript configuration
├── vite.config.ts                  # Vite configuration
├── tailwind.config.js              # Tailwind CSS config
└── README.md                       # This file
```

---

## 🛠️ Dependencies

### Production

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | ^19.2.1 | UI framework |
| `react-dom` | ^19.2.1 | React rendering |
| `lucide-react` | ^0.555.0 | Icon library |

### Development

| Package | Version | Purpose |
|---------|---------|---------|
| `vite` | ^6.2.0 | Build tool |
| `typescript` | ~5.8.2 | Type checking |
| `@vitejs/plugin-react` | ^5.0.0 | React plugin for Vite |
| `tailwindcss` | Latest | CSS utility framework |

---

## 🐳 Docker Setup

### Build Docker Image

```bash
docker build -t idp-frontend:latest .
```

### Run Container

```bash
docker run -p 3000:3000 \
  -e VITE_API_URL=http://localhost:7860 \
  idp-frontend:latest
```
---

## 🚀 Deployment

### Deploy to Vercel

1. **Connect GitHub Repository**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Select your GitHub repository

2. **Configure Build Settings**
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Add Environment Variables**
   - `VITE_API_URL`: Your backend URL

4. **Deploy**
   - Click "Deploy"
   - Your app will be live at `your-project.vercel.app`

### Deploy to Netlify

1. **Connect GitHub Repository**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Select your repository

2. **Configure Build**
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **Add Environment Variables**
   - Go to Site settings → Build & deploy → Environment
   - Add environment variables

4. **Deploy**
   - Click "Deploy site"

---

## 🔒 Security

### CORS Configuration

If backend is on different domain, ensure CORS is configured:

```tsx
// Backend (FastAPI example)
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://yourdomain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Secure API Key Storage

```tsx
// Never expose API key in client-side code
// Use environment variables instead
const API_URL = import.meta.env.VITE_API_URL;

// Backend should handle authentication
const response = await fetch(`${API_URL}`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`, // Get from backend
  },
  body: formData,
});
```

---

## 🛠️ Development Tips

### Hot Module Replacement (HMR)

Vite provides instant HMR for fast development:

```tsx
// Changes save instantly without full page reload
const [count, setCount] = React.useState(0);
```

### Debug Mode

Enable debug logging:

```tsx
// In App.tsx
const DEBUG = import.meta.env.VITE_DEBUG_MODE === 'true';

if (DEBUG) {
  console.log('Debug mode enabled');
}
```

### Browser DevTools

Use React Developer Tools extension for Chrome/Firefox to inspect component props and state.

---

## 🐛 Troubleshooting

### Module Not Found

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Port Already in Use

```bash
# Use different port
npm run dev -- --port 3000
```

### Build Fails

```bash
# Check for TypeScript errors
npx tsc --noEmit

# Clear build cache
rm -rf dist
npm run build
```

### Slow Development Server

```bash
# Update Vite and dependencies
npm update

# Check for large dependencies
npm ls --depth=0

# Use --host to avoid DNS lookup
npm run dev -- --host
```

### API Connection Issues

```tsx
// Check if backend is running
console.log('API URL:', import.meta.env.VITE_API_URL);

// Add error logging
fetch(url).catch(err => {
  console.error('API Error:', err);
});

// Check CORS headers in browser console (F12)
```

---

### Bundle Analysis

```bash
# Analyze bundle size
npm install -D vite-plugin-visualizer

# View report
npm run build && npx vite-plugin-visualizer
```

---

## 📚 Learning Resources

- [React 19 Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Lucide React Icons](https://lucide.dev)

---

## 📧 Support

- 🐛 Found a bug? [Open an issue](https://github.com/fahmiaziz98/ai-document-extractor/issues)
- 💡 Have a feature idea? [Start a discussion](https://github.com/fahmiaziz98/ai-document-extractor/discussions)
- 📖 Need help? Check the main [README](../README.md)
