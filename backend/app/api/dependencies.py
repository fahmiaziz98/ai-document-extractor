from app.services.llm_service import LLMService
from app.services.ocr_service import OCRService

ocr_service_instance: OCRService | None = None
llm_service_instance: LLMService | None = None


def get_ocr_service() -> OCRService:
    """
    Retrieves the OCRService instance.
    Raises:
        RuntimeError: If the OCRService instance is not initialized.
    Returns:
        OCRService: The initialized OCRService instance.
    """
    if ocr_service_instance is None:
        raise RuntimeError("OCR Service not initialized in lifespan!")
    return ocr_service_instance


def get_llm_service() -> LLMService:
    """
    Retrieves the LLMService instance.
    Raises:
        RuntimeError: If the LLMService instance is not initialized.
    Returns:
        LLMService: The initialized LLMService instance.
    """
    if llm_service_instance is None:
        raise RuntimeError("LLM Service not initialized in lifespan!")
    return llm_service_instance
