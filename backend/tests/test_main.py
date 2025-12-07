import json
import pytest
from fastapi.testclient import TestClient
from unittest.mock import MagicMock, patch

from  app.main import app


client = TestClient(app)

def test_read_root():
    """Ensure root endpoints is runing"""
    response = client.get("/docs")
    assert response.status_code == 200


def test_upload_invalid_extension():
    """Dummy file upload"""
    files = {
        'file': ('virus.exe', b'fake content', 'application/x-msdownload')
    }
    response = client.post("/api/v1/extract", files=files)
    
    assert response.status_code == 400
    assert "Invalid file type" in response.json()["detail"]


@patch("app.services.ocr_service.OCRService.extract_text")
@patch("app.services.llm_service.LLMService.parse_document")
def test_extract_document_success(mock_llm, mock_ocr):
    """"""
    
    mock_ocr.return_value = "INVOICE #001\nTotal: 100000" 
    
    expected_json = {
        "invoice_number": "001",
        "total": 100000
    }
    mock_llm.return_value = expected_json 

    files = {
        'file': ('invoice.jpg', b'fake image bytes', 'image/jpeg')
    }
    data = {
        'schema_config': json.dumps({"invoice_number": "string"})
    }

    response = client.post("/api/v1/extract", data=data, files=files)

    assert response.status_code == 200
    json_resp = response.json()
    
    assert json_resp["status"] == "success"
    assert json_resp["data"]["invoice_number"] == "001"
    
    mock_ocr.assert_called_once()
    mock_llm.assert_called_once()