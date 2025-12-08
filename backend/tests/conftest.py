import pytest
from fastapi.testclient import TestClient
from unittest.mock import MagicMock

from app.main import app
from app.api.dependencies import get_ocr_service, get_llm_service


@pytest.fixture(scope="function")
def mock_ocr_service():
    """
    Create a mock OCR service for testing
    Returns a MagicMock object with default behavior
    """
    mock = MagicMock()
    mock.extract_text.return_value = "Sample extracted text from document"
    return mock


@pytest.fixture(scope="function")
def mock_llm_service():
    """
    Create a mock LLM service for testing
    Returns a MagicMock object with default behavior
    """
    mock = MagicMock()
    mock.parse_document.return_value = {
        "vendor_name": "Test Vendor",
        "invoice_date": "2024-01-01",
        "total_amount": 1000.00
    }
    return mock


@pytest.fixture(scope="function")
def client(mock_ocr_service, mock_llm_service):
    """
    Create a FastAPI TestClient with mocked dependencies
    
    This fixture:
    1. Overrides the real service dependencies with mocks
    2. Creates a TestClient for making requests
    3. Cleans up after the test completes
    
    Usage:
        def test_something(client):
            response = client.get("/api/v1/health")
            assert response.status_code == 200
    """
    # Override dependencies with mocks
    app.dependency_overrides[get_ocr_service] = lambda: mock_ocr_service
    app.dependency_overrides[get_llm_service] = lambda: mock_llm_service
    
    # Create test client
    with TestClient(app) as test_client:
        yield test_client
    
    # Cleanup: clear all dependency overrides
    app.dependency_overrides.clear()


@pytest.fixture(scope="function")
def sample_pdf_bytes():
    """Sample PDF file bytes for testing"""
    return b'%PDF-1.4 fake pdf content'


@pytest.fixture(scope="function")
def sample_image_bytes():
    """Sample image file bytes for testing"""
    return b'\x89PNG\r\n\x1a\n fake png content'


@pytest.fixture(scope="function")
def sample_invoice_schema():
    """Sample invoice schema for testing"""
    return {
        "vendor_name": {
            "type": "string",
            "description": "Vendor name",
            "required": True
        },
        "invoice_date": {
            "type": "string",
            "description": "Invoice date",
            "required": True
        },
        "total_amount": {
            "type": "number",
            "description": "Total amount",
            "required": True
        }
    }