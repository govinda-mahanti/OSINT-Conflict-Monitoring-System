import dateparser

def normalize_event(event):
    # Use title or summary as claim_text
    claim_text = event.get("title") or event.get("summary") or ""

    text = claim_text.lower()

    # Simple keyword classification
    if "airstrike" in text or "bomb" in text:
        event_type = "airstrike"
    elif "protest" in text or "riot" in text:
        event_type = "protest"
    elif "attack" in text or "killed" in text:
        event_type = "attack"
    else:
        event_type = "conflict"

    normalized = {
        "claim_text": claim_text,
        "source": event.get("source"),
        "source_type": event.get("source_type", "news"),
        "event_type": event_type,
        "date": str(dateparser.parse(event.get("date", ""))) if event.get("date") else "",
        "location": "unknown",
        "link": event.get("link")
    }

    return normalized