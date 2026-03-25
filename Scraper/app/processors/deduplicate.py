def is_duplicate(new_event, existing_events):
    for event in existing_events:
        if new_event["claim_text"][:50] == event.get("claim_text", "")[:50]:
            return True
    return False