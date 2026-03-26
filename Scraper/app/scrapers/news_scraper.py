import requests

def scrape_newsapi():
    url = "https://newsapi.org/v2/everything?q=Iran%20Israel%20US%20conflict&language=en&sortBy=publishedAt&apiKey=fdc7e3eca4a54b739d82ff114b4a613e"

    try:
        response = requests.get(url)
        data = response.json()

        articles = []

        if data["status"] == "ok":
            for article in data["articles"]:
                articles.append({
                    "title": article["title"],
                    "link": article["url"],
                    "source": article["source"]["name"],
                    "date": article["publishedAt"],
                    "summary": article["description"],
                    "event_type": "conflict",
                    "source_type": "news"
                })

        print(f"Scraped {len(articles)} articles from NewsAPI")
        
        return articles

    except Exception as e:
        print("Error scraping NewsAPI:", e)
        return []