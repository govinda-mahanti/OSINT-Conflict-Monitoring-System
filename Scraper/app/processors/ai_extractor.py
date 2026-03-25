import requests
import os
from dotenv import load_dotenv
from datetime import datetime
import json
import re

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")


def extract_json(text):
    try:
        return json.loads(text)
    except:
        match = re.search(r'\{.*\}', text, re.DOTALL)
        if match:
            try:
                return json.loads(match.group(0))
            except:
                return None
    return None


def extract_event_ai(text, source, url, date):
    prompt = f"""
You are an OSINT analyst. Extract structured conflict event data.

Text:
{text}

Return ONLY JSON:

{{
  "country": "",
  "location_text": "",
  "actor_1": "",
  "actor_2": "",
  "event_type": "",
  "domain": "",
  "tags": []
}}
"""

    try:
        response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {GROQ_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "llama-3.3-70b-versatile",
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.1
            }
        )

        result = response.json()

        if "choices" not in result:
            print("Groq API Error:", result)
            return None

        content = result["choices"][0]["message"]["content"]
        data = extract_json(content)

        if not data:
            return None

        # ===== ENFORCE FINAL SCHEMA =====
        final_event = {
            "event_datetime_utc": date,
            "source_name": source,
            "source_url": url,
            "source_type": "news",
            "claim_text": text,
            "country": data.get("country", "unknown"),
            "location_text": data.get("location_text", "unknown"),
            "actor_1": data.get("actor_1", "unknown"),
            "actor_2": data.get("actor_2", "unknown"),
            "event_type": data.get("event_type", "conflict"),
            "domain": data.get("domain", "military"),
            "tags": data.get("tags", []),
            "severity_score": 0,
            "confidence_score": 0,
            "last_updated_at": str(datetime.utcnow())
        }

        return final_event

    except Exception as e:
        print("AI Extraction Error:", e)
        return None