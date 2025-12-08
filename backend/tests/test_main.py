import json
import pytest


def test_read_root(client):
    """Ensure root endpoint is running"""
    response = client.get("/docs")
    assert response.status_code == 200


def test_health_check(client):
    """Test health check endpoint"""
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    
    json_resp = response.json()
    assert json_resp["status"] == "healthy"
    assert json_resp["services"]["ocr"] == "ready"
    assert json_resp["services"]["llm"] == "ready"


def test_upload_invalid_extension(client):
    """Test upload with invalid file extension"""
    files = {
        'file': ('virus.exe', b'fake content', 'application/x-msdownload')
    }
    response = client.post("/api/v1/extract", files=files)
    
    assert response.status_code == 400
    assert "Invalid file type" in response.json()["detail"]


def test_upload_file_too_large(client):
    """Test upload with file size exceeding limit"""
    # Create 11MB of data (limit is 10MB)
    large_file = b'x' * (11 * 1024 * 1024)
    
    files = {
        'file': ('large.pdf', large_file, 'application/pdf')
    }
    response = client.post("/api/v1/extract", files=files)
    
    assert response.status_code == 413
    assert "File too large" in response.json()["detail"]


def test_extract_document_success(client, mock_ocr_service, mock_llm_service):
    """Test successful document extraction"""
    # Setup mock returns
    mock_ocr_service.extract_text.return_value = "INVOICE #001\nTotal: 100000"
    expected_json = {
        "invoice_number": "001",
        "total_amount": 100000,
        "vendor_name": "Test Company"
    }
    mock_llm_service.parse_document.return_value = expected_json

    files = {
        'file': ('invoice.jpg', b'fake image bytes', 'image/jpeg')
    }
    data = {
        'schema_config': json.dumps({
            "invoice_number": {"type": "string", "required": True},
            "total_amount": {"type": "number", "required": True}
        })
    }

    response = client.post("/api/v1/extract", data=data, files=files)

    assert response.status_code == 200
    json_resp = response.json()
    
    assert json_resp["status"] == "success"
    assert json_resp["filename"] == "invoice.jpg"
    assert json_resp["data"]["invoice_number"] == "001"
    assert json_resp["data"]["total_amount"] == 100000
    
    # Verify mocks were called
    mock_ocr_service.extract_text.assert_called_once()
    mock_llm_service.parse_document.assert_called_once()


def test_extract_document_with_default_schema(client, mock_ocr_service, mock_llm_service):
    """Test extraction using default invoice schema"""
    mock_ocr_service.extract_text.return_value = "Invoice text"
    mock_llm_service.parse_document.return_value = {
        "vendor_name": "ACME Corp",
        "invoice_date": "2024-01-15",
        "total_amount": 500.50
    }

    files = {
        'file': ('invoice.pdf', b'pdf bytes', 'application/pdf')
    }

    response = client.post("/api/v1/extract", files=files)

    assert response.status_code == 200
    json_resp = response.json()
    
    assert json_resp["status"] == "success"
    assert json_resp["data"]["vendor_name"] == "ACME Corp"
    assert json_resp["data"]["total_amount"] == 500.50


def test_extract_document_no_text_detected(client, mock_ocr_service, mock_llm_service):
    """Test when OCR detects no text"""
    mock_ocr_service.extract_text.return_value = ""

    files = {
        'file': ('blank.jpg', b'image bytes', 'image/jpeg')
    }

    response = client.post("/api/v1/extract", files=files)

    assert response.status_code == 200
    json_resp = response.json()
    
    assert json_resp["status"] == "failed"
    assert json_resp["message"] == "No text detected in document"
    assert json_resp["data"] is None
    
    # LLM should not be called if no text detected
    mock_llm_service.parse_document.assert_not_called()


def test_extract_document_invalid_json_schema(client):
    """Test with invalid JSON in schema_config"""
    files = {
        'file': ('invoice.jpg', b'image bytes', 'image/jpeg')
    }
    data = {
        'schema_config': 'invalid json {'
    }

    response = client.post("/api/v1/extract", data=data, files=files)

    assert response.status_code == 400
    assert "Invalid JSON" in response.json()["detail"]


def test_extract_document_ocr_error(client, mock_ocr_service, mock_llm_service):
    """Test when OCR service raises error"""
    from app.core.exception import OCRProcessingError
    
    mock_ocr_service.extract_text.side_effect = OCRProcessingError("OCR failed")

    files = {
        'file': ('corrupt.jpg', b'corrupt bytes', 'image/jpeg')
    }

    response = client.post("/api/v1/extract", files=files)

    assert response.status_code == 500
    assert "OCR failed" in response.json()["detail"]


def test_extract_document_llm_error(client, mock_ocr_service, mock_llm_service):
    """Test when LLM service raises error"""
    from app.core.exception import LLMProcessingError
    
    mock_ocr_service.extract_text.return_value = "Some text"
    mock_llm_service.parse_document.side_effect = LLMProcessingError("LLM API error")

    files = {
        'file': ('invoice.pdf', b'pdf bytes', 'application/pdf')
    }

    response = client.post("/api/v1/extract", files=files)

    assert response.status_code == 500
    assert "LLM failed" in response.json()["detail"]


def test_extract_document_invalid_file_error(client, mock_ocr_service, mock_llm_service):
    """Test when file is invalid"""
    from app.core.exception import InvalidFileError
    
    mock_ocr_service.extract_text.side_effect = InvalidFileError("Invalid image")

    files = {
        'file': ('invalid.jpg', b'not an image', 'image/jpeg')
    }

    response = client.post("/api/v1/extract", files=files)

    assert response.status_code == 400
    assert "Invalid image" in response.json()["detail"]


def test_allowed_file_types(client):
    """Test all allowed file types"""
    allowed_types = [
        ('test.pdf', 'application/pdf'),
        ('test.jpg', 'image/jpeg'),
        ('test.png', 'image/png'),
        ('test.webp', 'image/webp'),
    ]
    
    for filename, content_type in allowed_types:
        files = {'file': (filename, b'fake bytes', content_type)}
        response = client.post("/api/v1/extract", files=files)
        
        # Should not fail on file type (might fail on other validation)
        assert response.status_code != 400 or "Invalid file type" not in response.json()["detail"]