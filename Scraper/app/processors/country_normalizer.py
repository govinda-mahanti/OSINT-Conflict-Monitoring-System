def normalize_country(country_name):
    if not country_name:
        return "unknown"

    name = country_name.lower()

    us_alias = ["us", "u.s.", "usa", "united states", "united states of america", "america", "american"]
    iran_alias = ["iran", "iranian", "tehran"]
    israel_alias = ["israel", "israeli", "idf"]
    gaza_alias = ["gaza", "hamas"]
    lebanon_alias = ["lebanon", "hezbollah"]
    yemen_alias = ["yemen", "houthi"]
    iraq_alias = ["iraq"]
    syria_alias = ["syria"]

    if any(a in name for a in us_alias):
        return "United States"
    elif any(a in name for a in iran_alias):
        return "Iran"
    elif any(a in name for a in israel_alias):
        return "Israel"
    elif any(a in name for a in gaza_alias):
        return "Gaza"
    elif any(a in name for a in lebanon_alias):
        return "Lebanon"
    elif any(a in name for a in yemen_alias):
        return "Yemen"
    elif any(a in name for a in iraq_alias):
        return "Iraq"
    elif any(a in name for a in syria_alias):
        return "Syria"
    else:
        return "unknown"