import os
from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from backend.database import engine, Base, SessionLocal
from backend.routes import (
    meetings, decisions, tasks, chat, 
    events, audit, evaluation, demo, docs_info
)
from backend.services.seed_data import seed_database
from backend.models import Meeting

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Hospital Decision-to-Action Extractor & Action Tracking API",
    description="Backend API for extracting hospital decisions from transcripts, tracking tasks, managing human approvals, and processing out-of-order events.",
    version="1.0.0"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(meetings.router)
app.include_router(decisions.router)
app.include_router(tasks.router)
app.include_router(chat.router)
app.include_router(events.router)
app.include_router(audit.router)
app.include_router(evaluation.router)
app.include_router(demo.router)
app.include_router(docs_info.router)

@app.on_event("startup")
def startup_db_seed():
    db = SessionLocal()
    try:
        meeting_count = db.query(Meeting).count()
        if meeting_count == 0:
            print("Seeding database with 50+ meetings, decisions, tasks, chat, and events...")
            res = seed_database(db)
            print(f"Database seeded successfully: {res}")
    finally:
        db.close()

@app.get("/", response_class=HTMLResponse)
def read_root():
    template_path = os.path.join(os.path.dirname(__file__), "templates", "index.html")
    with open(template_path, "r", encoding="utf-8") as f:
        html_content = f.read()
    return HTMLResponse(content=html_content)

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "system": "Hospital Decision-to-Action Engine"}
