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
        Translate the following text from Chinese to English, following these specific rules:

        1. TRANSLATION RULES:
        - Translate general Chinese phrases to fluent English (e.g., "學生" → "student")
        - Convert Chinese PERSON NAMES to capitalized Pinyin (e.g., "孫意" → "Sun Yi")
        - For PLACE NAMES:
            • Use standard English names where available (e.g., "北京" → "Beijing")
            • Otherwise, convert to capitalized Pinyin (e.g., "天津大學" → "Tianjin University")

        2. DO NOT translate or alter:
        - English words, single letters (e.g., 'Y'), numbers, or dates
        - Email addresses, country/state codes, abbreviations
        - Any text that appears to be IDs or reference codes

        3. FORMAT RULES:
        - Do NOT include tone numbers in Pinyin
        - Ensure correct spacing and capitalization
        - If the input contains **no Chinese characters**, return it **unchanged**
        - DO NOT add explanations or comments — only return the translated result

        Examples:
        - "我喜歡學習" → "I like to study"
        - "王大明在北京大學學習" → "Wang Daming studies at Beijing University"
        - "Y" → Keep as "Y"
        - "aven@borderxai.com" → Keep as "aven@borderxai.com"

        Text to translate:
        {text}
        """
        
        response = client.chat.completions.create(
            model="gpt-4o",
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
