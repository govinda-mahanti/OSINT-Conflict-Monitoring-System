def is_relevant_conflict(text):
    text = text.lower()

    conflict_keywords = [
        # Countries
        "iran", "israel", "gaza", "syria", "iraq", "yemen", "lebanon",

        # Groups
        "hamas", "hezbollah", "houthi",

        # Cities
        "tehran", "tel aviv", "jerusalem",

        # Military terms
        "airstrike", "missile", "drone", "attack", "strike",
        "military", "navy", "war", "conflict",

        # US involvement
        "pentagon", "centcom", "u.s. military", "us airstrike"
    ]

    # Region filter
    region_keywords = [
        "iran", "israel", "gaza", "syria", "iraq", "yemen", "lebanon"
    ]

    has_conflict = any(word in text for word in conflict_keywords)
    has_region = any(word in text for word in region_keywords)

    return has_conflict and has_region