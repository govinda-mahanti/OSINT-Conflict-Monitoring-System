import feedparser

def scrape_military_times():
    url = "https://www.militarytimes.com/arc/outboundfeeds/rss/"
    feed = feedparser.parse(url)

    articles = []

    for entry in feed.entries:
        articles.append({
            "title": entry.title,
            "link": entry.link,
            "source": "Military Times",
            "date": entry.published,
            "summary": entry.summary,
            "event_type": "conflict",
            "source_type": "news"
        })

    print(f"Scraped {len(articles)} articles from Military Times")
    
    return articles