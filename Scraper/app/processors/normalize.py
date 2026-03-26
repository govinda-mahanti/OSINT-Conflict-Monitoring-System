import dateparser
from datetime import UTC

def normalize_event(event):
    claim_text = event.get("title") or event.get("summary") or ""
    text = claim_text.lower()

    if "airstrike" in text or "bomb" in text:
        event_type = "airstrike"
    elif "protest" in text or "riot" in text:
        event_type = "protest"
    elif "attack" in text or "killed" in text:
        event_type = "attack"
    else:
        event_type = "conflict"

    parsed_date = dateparser.parse(event.get("date", ""))

    if parsed_date and parsed_date.tzinfo is None:
        parsed_date = parsed_date.replace(tzinfo=UTC)

    normalized = {
        "claim_text": claim_text,
        "source": event.get("source"),
        "source_type": event.get("source_type", "news"),
        "event_type": event_type,
        "date": str(parsed_date) if parsed_date else "",
        "location": "unknown",
        "link": event.get("link")
    }

    return normalized