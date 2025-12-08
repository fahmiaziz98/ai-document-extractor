class BaseAppError(Exception):
    """Base exception class for the application."""

    def __init__(self, messages: str, details: dict = None):
        self.messages = messages
        self.details = details or {}
        super().__init__(self.messages)


class OCRProcessingError(BaseAppError):
    """Exception raised for errors during OCR processing."""

    pass


class LLMProcessingError(BaseAppError):
    """Exception raised for errors during LLM processing."""

    pass


class InvalidFileError(BaseAppError):
    """Exception raised for invalid file inputs."""

    pass


class SchemaValidationError(BaseAppError):
    """Exception raised for schema validation errors."""

    pass
