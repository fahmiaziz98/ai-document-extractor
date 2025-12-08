import os
from contextlib import asynccontextmanager

from dotenv import find_dotenv, load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from huggingface_hub import hf_hub_download
from loguru import logger
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from app.api import dependencies
from app.api.v1 import endpoints
from app.core.limiter import limiter
from app.services.llm_service import LLMService
from app.services.ocr_service import OCRService

load_dotenv(find_dotenv())
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    raise RuntimeError("GROQ_API_KEY must be set in environment variables")

ocr_service = None
llm_service = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("--- Starting IDP Service ---")

    logger.info("Checking/Downloading OCR Models...")
    det_path = hf_hub_download("monkt/paddleocr-onnx", "detection/v5/det.onnx")
    rec_path = hf_hub_download("monkt/paddleocr-onnx", "languages/english/rec.onnx")
    dict_path = hf_hub_download("monkt/paddleocr-onnx", "languages/english/dict.txt")

    global ocr_service, llm_service
    ocr_service = OCRService(det_path, rec_path, dict_path)
    llm_service = LLMService(api_key=GROQ_API_KEY)

    dependencies.ocr_service_instance = ocr_service
    dependencies.llm_service_instance = llm_service

    yield

    logger.info("--- Shutting down IDP Service ---")
    ocr_service = None
    llm_service = None


app = FastAPI(title="IDP POC API", lifespan=lifespan)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://ai-document-extractor-delta.vercel.app/"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(endpoints.router, prefix="/api/v1")
