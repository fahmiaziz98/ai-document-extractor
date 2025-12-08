import json

from fastapi import (
    APIRouter,
    Depends,
    File,
    Form,
    HTTPException,
    Request,
    Response,
    UploadFile,
)
from loguru import logger

from app.api.dependencies import get_llm_service, get_ocr_service
from app.core.exception import InvalidFileError, LLMProcessingError, OCRProcessingError
from app.core.limiter import limiter
from app.services.llm_service import LLMService
from app.services.ocr_service import OCRService

router = APIRouter()

ALLOWED_CONTENT_TYPES = {"application/pdf", "image/jpeg", "image/png", "image/webp"}

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

DEFAULT_INVOICE_SCHEMA = {
    "vendor_name": {
        "type": "string",
        "description": "Name of the company/store issuing the invoice",
        "required": True,
    },
    "invoice_date": {
        "type": "string",
        "description": "Transaction date in format YYYY-MM-DD",
        "required": True,
    },
    "items": {
        "type": "array",
        "description": "List of purchased items",
        "items_structure": {
            "name": "Item name",
            "qty": "Item quantity (number)",
            "price": "Unit Price",
        },
        "required": True,
    },
    "po_number": {
        "type": "string",
        "description": "Purchase Order number associated with the invoice if available",
        "required": False,
    },
    "total_amount": {
        "type": "number",
        "description": "Final total amount to be paid as per the invoice (including taxes, fees)",
        "required": True,
    },
}


@router.post("/extract")
@limiter.limit("100/minute")
async def extract_document(
    request: Request,
    response: Response,
    file: UploadFile = File(...),
    schema_config: str | None = Form(
        None, description="JSON string defining desired output structure"
    ),
    ocr: OCRService = Depends(get_ocr_service),
    llm: LLMService = Depends(get_llm_service),
):
    """
    Endpoint to extract structured data from an uploaded document (PDF/Image).

    Args:
        file (UploadFile): The uploaded file (PDF/Image).
        schema_config (Optional[str]): JSON string defining desired output structure.
        ocr (OCRService): An instance of the OCRService for text extraction.
        llm (LLMService): An instance of the LLMService for structured data parsing.

    Returns:
        Dict[str, Any]: A dictionary containing the extraction results or error details.
    """
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Allowed: {', '.join(ALLOWED_CONTENT_TYPES)}",
        )

    file_bytes = await file.read()
    if len(file_bytes) > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="File too large. Max size: 10MB")

    target_schema = DEFAULT_INVOICE_SCHEMA
    if schema_config:
        try:
            custom_schema = json.loads(schema_config)
            target_schema = custom_schema
        except json.JSONDecodeError as e:
            raise HTTPException(status_code=400, detail="Invalid JSON in schema_config") from e

    try:
        # OCR Extraction
        raw_text = ocr.extract_text(file_bytes, file.filename)

        if not raw_text.strip():
            return {
                "status": "failed",
                "filename": file.filename,
                "message": "No text detected in document",
                "data": None,
                "raw_text": None,
            }

        # LLM Parsing
        extracted_data = llm.parse_document(raw_text, target_schema)

        return {
            "status": "success",
            "filename": file.filename,
            "extraction_schema_used": target_schema,
            "data": extracted_data,
            "raw_text": raw_text,
        }

    except InvalidFileError as e:
        raise HTTPException(status_code=400, detail=e.messages) from e
    except OCRProcessingError as e:
        raise HTTPException(status_code=500, detail=f"OCR failed: {e.messages}") from e
    except LLMProcessingError as e:
        raise HTTPException(status_code=500, detail=f"LLM failed: {e.messages}") from e
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error") from e


@router.get("/health")
@limiter.limit("5/minute")
async def health_check(
    request: Request,
    response: Response,
    ocr: OCRService = Depends(get_ocr_service),
    llm: LLMService = Depends(get_llm_service),
):
    """Health check endpoint"""
    return {
        "status": "healthy",
        "services": {
            "ocr": "ready" if ocr else "not_initialized",
            "llm": "ready" if llm else "not_initialized",
        },
    }
