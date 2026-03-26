def is_duplicate(new_event, existing_events):
    for event in existing_events:
        if new_event.get("link") == event.get("source_url"):
            return True
    return False