def normalize_actors(actor_text):
    if not actor_text:
        return ["Unknown"]

    actor_text = actor_text.lower()

    actor_map = {
        "United States": ["us", "u.s.", "usa", "america", "american", "pentagon", "centcom"],
        "Israel": ["israel", "idf", "israeli"],
        "Iran": ["iran", "iranian", "irgc"],
        "Gaza": ["hamas", "gaza"],
        "Lebanon": ["hezbollah", "lebanon"],
        "Yemen": ["houthi", "yemen"],
        "Iraq": ["iraq"],
        "Syria": ["syria"],
        "Russia": ["russia"],
        "Ukraine": ["ukraine"],
        "United Kingdom": ["uk", "britain"],
        "Saudi Arabia": ["saudi"],
        "NATO": ["nato"],
    }

    found = []

    for country, keywords in actor_map.items():
        if any(word in actor_text for word in keywords):
            found.append(country)

    if not found:
        return ["Unknown"]

    return list(set(found))