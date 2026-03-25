import requests
import zipfile
import io
import csv
from datetime import datetime

def scrape_gdelt():
    print("Downloading latest GDELT data...")

    last_update_url = "http://data.gdeltproject.org/gdeltv2/lastupdate.txt"
    response = requests.get(last_update_url, timeout=15)
    latest_file_url = response.text.split("\n")[2].split(" ")[2]

    zip_response = requests.get(latest_file_url, timeout=30)

    z = zipfile.ZipFile(io.BytesIO(zip_response.content))
    filename = z.namelist()[0]

    articles = []

    with z.open(filename) as f:
        reader = csv.reader(io.TextIOWrapper(f, 'utf-8'))

        for row in reader:
            try:
                source = row[3]
                url = row[4]
                themes = row[5]

                articles.append({
                    "title": url,
                    "link": url,
                    "source": source,
                    "date": datetime.now().isoformat(),
                    "summary": themes,
                    "event_type": "news",
                    "source_type": "gdelt"
                })

            except:
                continue

    print(f"GDELT Export Scraped: {len(articles)} articles")
    return articles