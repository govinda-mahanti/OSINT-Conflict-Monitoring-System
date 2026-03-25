def severity_score(event_type):
    scores = {
        "airstrike": 5,
        "attack": 4,
        "protest": 2,
        "conflict": 3
    }
    return scores.get(event_type, 1)

def confidence_score(source_type):
    scores = {
        "news": 0.8,
        "report": 0.9,
        "social": 0.6
    }
    return scores.get(source_type, 0.5)