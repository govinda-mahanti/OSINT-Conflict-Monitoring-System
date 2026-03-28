def normalize_country(name):
    if not name:
        return "Unknown"

    name = name.lower()

    mapping = {
        "United States": ["us", "u.s.", "usa", "america", "american", "pentagon", "centcom"],
        "Israel": ["israel", "israeli", "idf"],
        "Iran": ["iran", "iranian", "irgc", "tehran"],
        "Gaza": ["gaza", "hamas"],
        "Lebanon": ["lebanon", "hezbollah"],
        "Yemen": ["yemen", "houthi"],
        "Iraq": ["iraq"],
        "Syria": ["syria"],
        "Russia": ["russia", "russian"],
        "Ukraine": ["ukraine", "ukrainian"],
        "United Kingdom": ["uk", "britain", "england", "raf"],
        "France": ["france", "french"],
        "Germany": ["germany", "german"],
        "Turkey": ["turkey", "turkish"],
        "Saudi Arabia": ["saudi", "saudi arabia"],
    }

    for country, aliases in mapping.items():
        if any(alias in name for alias in aliases):
            return country

    return "Unknown"