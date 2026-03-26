import requests
from bs4 import BeautifulSoup

def scrape_reliefweb():
    url = "https://reliefweb.int/updates"
    headers = {"User-Agent": "Mozilla/5.0"}

    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.text, "html.parser")

    articles = []

    for item in soup.select(".rw-river-article__title a"):
        title = item.get_text(strip=True)
        link = "https://reliefweb.int" + item["href"]

        articles.append({
            "title": title,
            "link": link,
            "source": "ReliefWeb",
            "date": "",
            "summary": title,
            "event_type": "conflict",
            "source_type": "report"
        })

    print(f"Scraped {len(articles)} articles from ReliefWeb")
   
    return articles