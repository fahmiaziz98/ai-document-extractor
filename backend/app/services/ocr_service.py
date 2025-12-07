import cv2
import numpy as np
from loguru import logger
from pdf2image import convert_from_bytes
from rapidocr_onnxruntime import RapidOCR

from app.core.exception import InvalidFileError, OCRProcessingError


class OCRService:
    """
    Service for extracting text from images and PDFs using the RapidOCR engine.

    Attributes:
        engine (RapidOCR): An instance of the RapidOCR engine used for text extraction.

    Methods:
        extract_text(file_bytes: bytes, filename: str) -> str:
            Extracts text from the provided file bytes.
    """

    def __init__(self, det_path: str, rec_path: str, dict_path: str):
        """
        Initializes the OCRService with the specified model paths.

        Args:
            det_path (str): Path to the detection model.
            rec_path (str): Path to the recognition model.
            dict_path (str): Path to the recognition keys dictionary.
        """
        logger.info("Loading OCR Models...")
        self.engine = RapidOCR(
            det_model_path=det_path, rec_model_path=rec_path, rec_keys_path=dict_path
        )
        logger.success("OCR Models Loaded Successfully.")

    def _process_image_bytes(self, file_bytes: bytes, filename: str) -> np.ndarray:
        """
        Processes the input file bytes and converts them into an OpenCV image.
        This method supports both PDF and standard image formats.

        Args:
            file_bytes (bytes): The content of the file in bytes.
            filename (str): The name of the file to determine its type.

        Returns:
            np.ndarray: The processed image in OpenCV format.

        Raises:
            ValueError: If the PDF is empty or if the image file is invalid.
        """
        logger.info("Preproccess image2bytes...")
        if filename.lower().endswith(".pdf"):
            try:
                images = convert_from_bytes(file_bytes, first_page=1, last_page=1)
                if not images:
                    raise ValueError("Empty PDF")
                pil_image = images[0]
                open_cv_image = cv2.cvtColor(np.array(pil_image), cv2.COLOR_RGB2BGR)
                return open_cv_image
            except Exception as e:
                raise OCRProcessingError("Failed to process PDF", {"error": str(e)})

        nparr = np.frombuffer(file_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if img is None:
            raise InvalidFileError("Invalid image file")
        return img

    def extract_text(self, file_bytes: bytes, filename: str) -> str:
        """
        Extracts text from the provided file bytes.

        Args:
            file_bytes (bytes): The content of the file in bytes.
            filename (str): The name of the file to determine its type.

        Returns:
            str: The extracted text. Returns an empty string if no text is found.
        """
        try:
            img = self._process_image_bytes(file_bytes, filename)
            logger.info("Running OCR extraction...")
            result, _ = self.engine(img, use_det=True, use_rec=True)

            if not result:
                logger.warning("No text detected in document")
                return ""

            text_lines = [line[1] for line in result]
            extracted_text = " ".join(text_lines)
            logger.success(f"Extracted {len(text_lines)} lines of text")
            return extracted_text

        except (InvalidFileError, OCRProcessingError):
            raise
        except Exception as e:
            logger.error(f"Unexpected OCR error: {e}")
            raise OCRProcessingError("OCR extraction failed", {"error": str(e)})
