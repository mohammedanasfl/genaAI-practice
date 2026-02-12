from openai import OpenAI
import os
import json
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def generate_doc_suggestions(text: str):

    prompt = f"""
Return ONLY valid JSON.

Format:
{{
  "summary": "",
  "questions": ["", "", ""],
  "insights": ["", "", ""]
}}

Document:
{text[:4000]}
"""

    res = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.2
    )

    content = res.choices[0].message.content.strip()

    try:
        return json.loads(content)
    except:
        # fallback if JSON breaks
        return {
            "summary": content,
            "questions": [],
            "insights": []
        }
