import os
import logging
from typing import Optional, Dict, Any
from openai import OpenAI

logger = logging.getLogger(__name__)

# Initialize OpenAI client
openai_api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=openai_api_key)

def translate_text(text: str, source_lang: str = 'zh', target_lang: str = 'pinyin') -> Optional[str]:
    """
    Convert Chinese text to Pinyin (romanized Chinese).
    
    Args:
        text (str): The text to convert to Pinyin
        source_lang (str): Source language code (default: 'zh' for Chinese)
        target_lang (str): Target format (default: 'pinyin')
        
    Returns:
        Optional[str]: Text with Chinese characters converted to Pinyin or None if conversion failed
    """
    if not text or not text.strip():
        return text
        
    try:
        # Create a specific prompt for Pinyin conversion
        prompt = f"""
        Convert the following text to Pinyin (romanized Chinese), following these rules:
        
        1. ONLY convert Chinese characters to Pinyin.
        2. DO NOT convert or modify:
           - Single letters like 'Y' or 'N'
           - Numbers or dates
           - Email addresses
           - Names that are already in English or Latin alphabet
           - Country codes, state codes, or other abbreviations
           - Any text that appears to be IDs, codes, or references
        3. DO NOT include tone numbers in the Pinyin output
        4. Use spaces between syllables for readability
        
        Examples of what NOT to convert:
        - "Y" → Keep as "Y"
        - "N" → Keep as "N"
        - "2012" → Keep as "2012"
        - "CA" → Keep as "CA"
        - "aven@borderxai.com" → Keep as "aven@borderxai.com"
        - "ALB" → Keep as "ALB"
        
        Examples of what TO convert:
        - "学生" → "xue sheng"
        - "天津大學" → "tian jin da xue"
        - "無" → "wu"
        - "我是学生" → "wo shi xue sheng"
        
        IMPORTANT: 
        - Do NOT include tone numbers (1-4) in the output
        - Separate syllables with spaces for readability
        - If the text has no Chinese characters, return EXACTLY the original text without any modification
        - Do NOT add any explanations or comments
        - Just return either the Pinyin (if Chinese) or the EXACT original text (if not Chinese)
        
        Text to convert:
        {text}
        """
        
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a Chinese to Pinyin converter. Only output the converted text, no explanations."},
                {"role": "user", "content": prompt}
            ],
            temperature=0,
            max_tokens=1000
        )
        
        translated_text = response.choices[0].message.content.strip()
        return translated_text
        
    except Exception as e:
        logger.error(f"Error converting to Pinyin: {str(e)}")
        return None

def translate_form_data(form_data: Dict[str, Any], source_lang: str = 'zh', target_lang: str = 'pinyin') -> Dict[str, Any]:
    """
    Convert all Chinese text in form data to Pinyin.
    """
    if not form_data:
        return form_data

    translated_data = {}
    
    for key, value in form_data.items():
        if isinstance(value, str):
            translated_data[key] = translate_text(value, source_lang, target_lang)
        elif isinstance(value, dict):
            translated_data[key] = translate_form_data(value, source_lang, target_lang)
        elif isinstance(value, list):
            translated_data[key] = [
                translate_form_data(item, source_lang, target_lang) if isinstance(item, dict)
                else translate_text(item, source_lang, target_lang) if isinstance(item, str)
                else item
                for item in value
            ]
        else:
            translated_data[key] = value
            
    return translated_data
