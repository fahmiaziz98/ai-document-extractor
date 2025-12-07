class BaseException(Exception):
    """Base exception class for the application."""

    def __init__(self, message: str, details: dict = None):
        self.message = message
        self.details = details or {}
        super().__init__(self.message)


class OCRProcessingError(BaseException):
    """Exception raised for errors during OCR processing."""

    pass


class LLMProcessingError(BaseException):
    """Exception raised for errors during LLM processing."""

    pass


class InvalidFileError(BaseException):
    """Exception raised for invalid file inputs."""

    pass


class SchemaValidationError(BaseException):
    """Exception raised for schema validation errors."""

    pass
