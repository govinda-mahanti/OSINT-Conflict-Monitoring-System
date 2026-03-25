import feedparser

def scrape_reuters():
    feeds = [
        "https://www.reutersagency.com/feed/?best-topics=middle-east",
        "https://www.reutersagency.com/feed/?best-topics=conflict",
        "https://www.reutersagency.com/feed/?best-topics=military"
    ]

    articles = []

    for url in feeds:
        feed = feedparser.parse(url)

        for entry in feed.entries:
            articles.append({
                "title": entry.title,
                "link": entry.link,
                "source": "Reuters",
                "date": entry.published if "published" in entry else "",
                "summary": entry.title,
                "event_type": "conflict",
                "source_type": "news"
            })

    print(f"Scraped {len(articles)} articles from Reuters")
    return articles[:15]