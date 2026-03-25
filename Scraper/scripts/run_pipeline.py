import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from datetime import datetime

from app.scrapers.bbc_scraper import scrape_bbc
from app.scrapers.news_scraper import scrape_newsapi
from app.scrapers.reliefweb_scraper import scrape_reliefweb
from app.scrapers.militarytimes_scraper import scrape_military_times

from app.database.mongodb import insert_event, get_all_events

from app.processors.filter_conflict import is_relevant_conflict
from app.processors.normalize import normalize_event
from app.processors.deduplicate import is_duplicate
from app.processors.ai_extractor import extract_event_ai
from app.processors.scoring import severity_score, confidence_score


def run_pipeline():
    raw_events = []

    # Scrapers
    bbc = scrape_bbc()
    news = scrape_newsapi()
    relief = scrape_reliefweb()
    military_times = scrape_military_times()

    print("BBC:", len(bbc))
    print("NewsAPI:", len(news))
    print("ReliefWeb:", len(relief))
    print("MilitaryTimes:", len(military_times))

    raw_events += bbc
    raw_events += news
    raw_events += relief
    raw_events += military_times

    print("Total scraped:", len(raw_events))

    # Load existing events from MongoDB
    existing_events = get_all_events()

    processed_events = []

    for event in raw_events:
        text = (event.get("title") or "") + " " + (event.get("summary") or "")

        # Step 1: Conflict filter
        if not is_relevant_conflict(text):
            continue

        # Step 2: Normalize
        normalized = normalize_event(event)

        # Step 3: Deduplicate
        if is_duplicate(normalized, existing_events):
            continue

        # Step 4: AI Extraction
        ai_event = extract_event_ai(
            text=normalized["claim_text"],
            source=normalized["source"],
            url=normalized["link"],
            date=normalized["date"]
        )

        if not ai_event:
            continue

        # Step 5: Scoring
        ai_event["severity_score"] = severity_score(ai_event["event_type"])
        ai_event["confidence_score"] = confidence_score(ai_event["source_type"])

        # Step 6: Add timestamps
        ai_event["event_datetime_utc"] = normalized["date"]
        ai_event["last_updated_at"] = str(datetime.utcnow())

        processed_events.append(ai_event)

    print("Processed events:", len(processed_events))

    # Step 7: Store in MongoDB
    for event in processed_events:
        insert_event(event)

    print("Stored in MongoDB")


if __name__ == "__main__":
    run_pipeline()