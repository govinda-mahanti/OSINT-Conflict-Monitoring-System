from datetime import datetime, timedelta, UTC
import dateparser

def filter_recent_articles(articles, days=2):
    filtered = []
    cutoff = datetime.now(UTC) - timedelta(days=days)

    for article in articles:
        try:
            raw_date = article.get("date", "")
            article_date = dateparser.parse(raw_date)

            if not article_date:
                continue

            # Convert to UTC if no timezone
            if article_date.tzinfo is None:
                article_date = article_date.replace(tzinfo=UTC)

            if article_date >= cutoff:
                filtered.append(article)

        except Exception as e:
            print("Date parse error:", raw_date)
            continue

    return filtered