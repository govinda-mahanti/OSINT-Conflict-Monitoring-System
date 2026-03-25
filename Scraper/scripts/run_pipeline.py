import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.scrapers.bbc_scraper import scrape_bbc
from app.scrapers.reliefweb_scraper import scrape_reliefweb
from app.scrapers.reuters_scraper import scrape_reuters
from app.scrapers.gdelt_scraper import scrape_gdelt
from app.scrapers.news_scraper import scrape_newsapi
from app.processors.normalize import normalize_event
from app.processors.deduplicate import is_duplicate
from app.processors.scoring import severity_score, confidence_score
from app.database.mongodb import insert_event, get_all_events
from app.processors.filter_conflict import is_relevant_conflict

def run_pipeline():
    print("Starting pipeline...")

    raw_events = []
    raw_events += scrape_bbc()
    raw_events += scrape_reliefweb()
    raw_events += scrape_reuters()
    # raw_events += scrape_gdelt()
    raw_events += scrape_newsapi()
    print("Total scraped:", len(raw_events))

    existing_events = get_all_events()

    for event in raw_events:
        normalized = normalize_event(event)

        # FILTER ONLY IRAN–ISRAEL–US CONFLICT
        if not is_relevant_conflict(normalized["claim_text"]):
            print("Not relevant, skipping...")
            continue

        if is_duplicate(normalized, existing_events):
            print("Duplicate found, skipping...")
            continue

        normalized["severity_score"] = severity_score(normalized["event_type"])
        normalized["confidence_score"] = confidence_score(normalized["source_type"])

        insert_event(normalized)
        print("Inserted:", normalized["claim_text"])

    print("Pipeline finished.")

if __name__ == "__main__":
    run_pipeline()