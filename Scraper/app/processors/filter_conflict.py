def is_relevant_conflict(text):
    text = text.lower()

    keywords = [
        "iran", "israel", "gaza", "hamas", "hezbollah",
        "idf", "iranian", "tehran", "tel aviv",
        "us", "u.s.", "united states", "pentagon",
        "missile", "airstrike", "drone",
        "war", "conflict", "attack",
        "syria", "iraq", "yemen", "red sea",
        "houthi", "navy", "military"
    ]

    return any(keyword in text for keyword in keywords)