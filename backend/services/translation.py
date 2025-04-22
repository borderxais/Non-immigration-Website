import os
import logging
from typing import Optional, Dict, Any
from openai import OpenAI

logger = logging.getLogger(__name__)

# Initialize OpenAI client
openai_api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=openai_api_key)

def translate_text(text: str, source_lang: str = 'zh', target_lang: str = 'en') -> Optional[str]:
    """
    Translate text from source language to target language using OpenAI.
    
    Args:
        text (str): The text to translate
        source_lang (str): Source language code (default: 'zh' for Chinese)
        target_lang (str): Target language code (default: 'en' for English)
        
    Returns:
        Optional[str]: Translated text or None if translation failed
    """
    if not text or not text.strip():
        return text
        
    try:
        # Create a more specific prompt for the translation
        prompt = f"""
        Translate the following text from {source_lang} to {target_lang}, following these rules:
        
        1. ONLY translate text that is actually in {source_lang} (Chinese).
        2. DO NOT translate:
           - Single letters like 'Y' or 'N' (these are codes for Yes/No)
           - Numbers or dates
           - Email addresses
           - Names that are already in English or Latin alphabet
           - Country codes, state codes, or other abbreviations
           - Any text that appears to be IDs, codes, or references
        
        Examples of what NOT to translate:
        - "Y" → Keep as "Y" (do not translate to "Yes")
        - "N" → Keep as "N" (do not translate to "No")
        - "2012" → Keep as "2012"
        - "CA" → Keep as "CA"
        - "aven@borderxai.com" → Keep as "aven@borderxai.com"
        - "ALB" → Keep as "ALB"
        
        Examples of what TO translate:
        - "学生" → "student"
        - "天津大學" → "Tianjin University"
        - "無" → "Nothing"
        
        IMPORTANT: 
        - If the text does not need translation, return EXACTLY the original text without any modification
        - Do NOT add any explanations, comments, or notes about why you didn't translate something
        - Do NOT say things like "This text is not in Chinese" or "This doesn't require translation"
        - Just return either the translated text (if Chinese) or the EXACT original text (if not Chinese)
        
        Here is the text to translate:
        {text}
        """
        
        # Call OpenAI API for translation
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": f"You are a professional translator from {source_lang} to {target_lang}. You carefully follow instructions about what to translate and what not to translate."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,  # Lower temperature for more accurate translations
            max_tokens=1024
        )
        
        # Extract the translated text
        translated_text = response.choices[0].message.content.strip()
        logger.info(f"Successfully translated text from {source_lang} to {target_lang}")
        return translated_text
        
    except Exception as e:
        logger.error(f"Translation error: {str(e)}")
        return text  # Return original text if translation fails

def translate_form_data(form_data: Dict[str, Any], source_lang: str = 'zh', target_lang: str = 'en') -> Dict[str, Any]:
    """
    Translate all string values in a nested dictionary (form data).
    
    Args:
        form_data (Dict): The form data to translate
        source_lang (str): Source language code
        target_lang (str): Target language code
        
    Returns:
        Dict: Translated form data
    """
    if not form_data:
        return form_data
        
    translated_data = {}
    
    for key, value in form_data.items():
        if isinstance(value, str):
            # Translate string values
            translated_data[key] = translate_text(value, source_lang, target_lang)
        elif isinstance(value, dict):
            # Recursively translate nested dictionaries
            translated_data[key] = translate_form_data(value, source_lang, target_lang)
        elif isinstance(value, list):
            # Translate items in lists
            translated_data[key] = [
                translate_form_data(item, source_lang, target_lang) if isinstance(item, dict) 
                else translate_text(item, source_lang, target_lang) if isinstance(item, str)
                else item
                for item in value
            ]
        else:
            # Keep non-string values as is
            translated_data[key] = value
            
    return translated_data
