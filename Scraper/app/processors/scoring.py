def severity_score(event_type, fatalities=0, injuries=0, target_type=None, weapon_type=None):
    score = 1

    # Event type weight
    event_weights = {
        "airstrike": 5,
        "missile": 5,
        "drone": 4,
        "attack": 4,
        "conflict": 3,
        "naval": 3,
        "deployment": 2,
        "protest": 2,
        "threat": 1
    }
    score = event_weights.get(event_type, 1)

    # Fatalities impact
    if fatalities >= 50:
        score += 2
    elif fatalities >= 10:
        score += 1

    # Injuries impact
    if injuries >= 50:
        score += 1

    # Target importance
    if target_type == "civilian":
        score += 1
    elif target_type == "infrastructure":
        score += 1
    elif target_type == "military":
        score += 0.5

    # Weapon severity
    if weapon_type in ["missile", "aircraft", "drone"]:
        score += 1

    return min(round(score), 5)
def confidence_score(source_type, report_count=1):
    # Base score by source type
    source_weights = {
        "news": 0.6,
        "report": 0.7,
        "government": 0.9,
        "social": 0.3
    }

    score = source_weights.get(source_type, 0.5)

    # Multiple reports increase confidence
    if report_count >= 3:
        score += 0.2
    elif report_count == 2:
        score += 0.1

    return min(round(score, 2), 1.0)
    score = 0.3

    # Source reliability
    source_weights = {
        "news": 0.6,
        "report": 0.7,
        "government": 0.9,
        "social": 0.3
    }
    score = source_weights.get(source_type, 0.4)

    # Multiple sources increase confidence
    if report_count >= 3:
        score += 0.2
    elif report_count == 2:
        score += 0.1

    # Official confirmation
    if official:
        score += 0.1

    # Casualties confirmed by multiple sources
    if casualties_confirmed:
        score += 0.1

    return min(round(score, 2), 1.0)