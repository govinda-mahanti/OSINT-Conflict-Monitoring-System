from flask import Flask
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime, UTC
import atexit

from scripts.run_pipeline import run_pipeline

app = Flask(__name__)

def run_job():
    print("\n[Scheduler] Pipeline started at:", datetime.now(UTC))
    try:
        run_pipeline()
        print("[Scheduler] Pipeline finished")
    except Exception as e:
        print("[Scheduler] Pipeline error:", e)

scheduler = BackgroundScheduler()
scheduler.add_job(run_job, 'interval', hours=3)
scheduler.start()

# Run once at startup
run_job()

atexit.register(lambda: scheduler.shutdown())

@app.route("/")
def home():
    return "Scheduler is running"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)