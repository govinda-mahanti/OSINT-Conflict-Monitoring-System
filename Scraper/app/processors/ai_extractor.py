import requests
import os
from dotenv import load_dotenv
from datetime import datetime, UTC
import json
import re
import time

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")


def extract_json(text):
    """Safely extract JSON from LLM response"""
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


    """Confidence score based on filled fields"""
    score = 0
    fields = [
        "country",
        "location",
        "attacker",
        "defender",
        "event_type",
        "weapon_type"
    ]

    for field in fields:
        if data.get(field) and data.get(field) != "unknown":
            score += 1

    return round(score / len(fields), 2)


def extract_event_ai(text, source, url, date):
    prompt = f"""
Extract conflict event data from the text.

Return JSON only:

{{
  "country": "",
  "location": "",
  "attacker": "",
  "defender": "",
  "event_type": "",
  "domain": "military",
  "weapon_type": "",
  "target_type": "",
  "fatalities": 0,
  "injuries": 0,
  "tags": []
}}

Rules:
- Countries: Iran, Israel, Gaza, Syria, Iraq, Yemen, Lebanon, United States
- event_type: airstrike, missile, drone, attack, naval, deployment
- target_type: military, civilian, infrastructure, government
- If injuries missing → injuries = fatalities
- domain = military / political / cyber
- event_type = airstrike / attack / drone / missile / conflict / deployment / naval
- weapon_type = drone / missile / artillery / airstrike / gunfire / naval / cyber
- target_type = military / civilian / infrastructure / government
- fatalities & injuries = numbers if mentioned, else 0
- tags = short keywords
- location = Extract the most specific attacked place mentioned (building/base/airport/school/hospital → else city → else district/region/country → else country → else "unknown").
- If not conflict related, return empty JSON {{}}.

Text:
{text}
"""


    for attempt in range(3):
        try:
            time.sleep(2)

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
                },
                timeout=30
            )

            result = response.json()

            if "error" in result:
                print("Groq API Error:", result)
                if "rate_limit" in str(result):
                    print("Waiting due to rate limit...")
                    time.sleep(5)
                    continue
                return None

            if "choices" not in result:
                return None

            content = result["choices"][0]["message"]["content"]
            data = extract_json(content)

            if not data or data == {}:
                return None

           

            # Final schema
            final_event = {
                "event_datetime_utc": date,
                "source_name": source,
                "source_url": url,
                "source_type": "news",
                "claim_text": text,

                "country": data.get("country", "unknown"),
                "location": data.get("location", "unknown"),

                "attacker": data.get("attacker", "unknown"),
                "defender": data.get("defender", "unknown"),

                "event_type": data.get("event_type", "conflict"),
                "domain": data.get("domain", "military"),
                "weapon_type": data.get("weapon_type", "unknown"),
                "target_type": data.get("target_type", "unknown"),

                "fatalities": data.get("fatalities", 0),
                "injuries": data.get("injuries", 0),

                "severity_score": 0,
                "confidence_score": 0,

                "tags": data.get("tags", []),
                "last_updated_at": str(datetime.now(UTC))
            }

            return final_event

        except Exception as e:
            print("AI Extraction Error:", e)
            time.sleep(3)

    return None