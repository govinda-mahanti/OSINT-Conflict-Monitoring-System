import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '.')))

from app.scrapers.gdelt_scraper import scrape_gdelt

articles = scrape_gdelt()

print("Total:", len(articles))
for a in articles[:5]:
    print(a["title"])