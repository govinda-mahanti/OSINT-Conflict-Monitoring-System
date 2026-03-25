from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

client = MongoClient(os.getenv("MONGO_URI"))
db = client["osint_db"]
collection = db["events"]

# Prevent duplicate claim_text
collection.create_index("claim_text", unique=True)
collection.create_index("event_datetime_utc")
collection.create_index("country")
collection.create_index("event_type")
collection.create_index("severity_score")
collection.create_index("source_name")

def insert_event(event):
    try:
        collection.insert_one(event)
    except:
        pass

def get_all_events():
    return list(collection.find({}, {"_id": 0}))