import json
from typing import Any

from groq import Groq
from loguru import logger

from app.core.exception import LLMProcessingError


class LLMService:
    """
    Service for parsing and extracting information from text using a Large Language Model (LLM).

    Attributes:
        client (Groq): An instance of the Groq client for interacting with the LLM.
        model (str): The identifier for the LLM model to use for parsing.
    """

    def __init__(self, api_key: str):
        """
        Initializes the LLMService with the specified API key.

        Args:
            api_key (str): The API key for authenticating with the LLM service.
        """
        self.client = Groq(api_key=api_key)
        self.model = "llama-3.3-70b-versatile"

    def parse_document(self, raw_text: str, target_schema: dict[str, Any]) -> dict[str, Any]:
        """
        Parses the provided raw text according to the specified target schema.

        Args:
            raw_text (str): The raw text obtained from OCR processing.
            target_schema (Dict[str, Any]): A dictionary defining the desired structure for the output.

        Returns:
            Dict[str, Any]: A dictionary containing the extracted information structured according to the target schema.
                            Returns an error dictionary if parsing fails.
        """

        if not raw_text.strip():
            raise LLMProcessingError("Empty text provided for parsing")

        schema_str = json.dumps(target_schema, indent=2)

        system_prompt = f"""
        You are an intelligent document extraction AI.
        
        Your task is to extract information from the document text based on the USER DEFINED SCHEMA below.
        
        USER SCHEMA DEFINITION:
        {schema_str}

        INSTRUCTIONS:
        1. **Look at the 'description'** for each field to understand what to look for.
        2. **Check 'required'**: 
           - If 'required': true and data is missing, try your best to infer or return "NOT_FOUND".
           - If 'required': false and data is missing, strictly return null.
        3. **Output Format**: Return ONLY a clean JSON object containing the extracted data (key-value). 
           Do not include the descriptions in the output, just the values.
        4. No markdown formatting.
        """

        user_prompt = f"DOCUMENT TEXT:\n{raw_text}"

        try:
            logger.info("Sending request to LLM...")
            completion = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
                temperature=0,
                response_format={"type": "json_object"},
            )

            response_content = completion.choices[0].message.content
            parsed_data = json.loads(response_content)
            logger.success("LLM parsing completed")
            return parsed_data

        except json.JSONDecodeError as e:
            logger.error(f"LLM returned invalid JSON: {e}")
            raise LLMProcessingError("Failed to parse LLM response", {"error": str(e)})
        except Exception as e:
            logger.error(f"LLM API error: {e}")
            raise LLMProcessingError("LLM processing failed", {"error": str(e)})
