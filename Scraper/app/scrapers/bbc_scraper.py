import feedparser

def scrape_bbc():
    url = "http://feeds.bbci.co.uk/news/world/rss.xml"
    feed = feedparser.parse(url)

    articles = []

    for entry in feed.entries:
        articles.append({
            "title": entry.title,
            "link": entry.link,
            "source": "BBC",
            "date": entry.published,
            "summary": entry.summary,
            "event_type": "conflict",
            "source_type": "news"
        })

    print(f"Scraped {len(articles)} articles from BBC")
    return articles