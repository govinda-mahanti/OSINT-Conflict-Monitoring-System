import sys
import os
import time
from datetime import datetime, UTC

# Allow imports from app/
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Scrapers
from app.scrapers.bbc_scraper import scrape_bbc
from app.scrapers.news_scraper import scrape_newsapi
from app.scrapers.reliefweb_scraper import scrape_reliefweb
from app.scrapers.militarytimes_scraper import scrape_military_times

# Database
from app.database.mongodb import insert_event, get_all_events

# Processors
from app.processors.filter_conflict import is_relevant_conflict
from app.processors.normalize import normalize_event
from app.processors.deduplicate import is_duplicate
from app.processors.ai_extractor import extract_event_ai
from app.processors.scoring import severity_score, confidence_score
from app.processors.date_filter import filter_recent_articles
from app.processors.country_normalizer import normalize_country


def run_pipeline():
    print("Starting pipeline...\n")

    raw_events = []

    # Step 1 — Scrape
    bbc = scrape_bbc()
    news = scrape_newsapi()
    relief = scrape_reliefweb()
    military = scrape_military_times()

    print("BBC:", len(bbc))
    print("NewsAPI:", len(news))
    print("ReliefWeb:", len(relief))
    print("MilitaryTimes:", len(military))

    raw_events.extend(bbc)
    raw_events.extend(news)
    raw_events.extend(relief)
    raw_events.extend(military)

    print("\nTotal scraped:", len(raw_events))

    # Step 2 — Date filter
    raw_events = filter_recent_articles(raw_events, days=2)
    print("After date filter:", len(raw_events))

    # Step 3 — Load existing events
    existing_events = get_all_events()

    processed_events = []

    # Counters for debugging
    conflict_pass = 0
    dedup_pass = 0
    ai_pass = 0
    country_pass = 0

    # Step 4 — Process each event
    for event in raw_events:
        full_text = (event.get("title") or "") + " " + (event.get("summary") or "")

        # Conflict filter
        if not is_relevant_conflict(full_text):
            continue
        conflict_pass += 1

        # Normalize
        normalized = normalize_event(event)

        # Deduplicate
        if is_duplicate(normalized, existing_events):
            continue
        dedup_pass += 1

        # AI Extraction (SEND FULL TEXT)
        ai_event = extract_event_ai(
            text=full_text,
            source=normalized["source"],
            url=normalized["link"],
            date=normalized["date"]
        )

        if not ai_event:
            continue
        ai_pass += 1

        # Normalize country
        ai_event["country"] = normalize_country(ai_event.get("country"))

        # Region filter
        allowed_countries = ["Iran", "Israel", "Syria", "Iraq", "Yemen", "Lebanon", "Gaza", "United States"]
        if ai_event["country"] not in allowed_countries:
            continue
        country_pass += 1

        # Scoring
        ai_event["severity_score"] = severity_score(ai_event["event_type"])
        ai_event["confidence_score"] = confidence_score(ai_event["source_type"])

        # Timestamps
        ai_event["event_datetime_utc"] = normalized["date"]
        ai_event["last_updated_at"] = str(datetime.now(UTC))

        processed_events.append(ai_event)

        print("Processed:", ai_event["event_type"], "-", ai_event["country"])

        time.sleep(2)  # Avoid rate limit

    print("\n--- Pipeline Stats ---")
    print("After conflict filter:", conflict_pass)
    print("After deduplication:", dedup_pass)
    print("After AI extraction:", ai_pass)
    print("After country filter:", country_pass)

    print("\nTotal processed events:", len(processed_events))

    # Step 5 — Store in MongoDB
    for event in processed_events:
        insert_event(event)

    print("Stored in MongoDB")
    print("\nPipeline finished.")


if __name__ == "__main__":
    run_pipeline()