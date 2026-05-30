from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from database import init_db
from routes import auth, users, jobs, news, posts, applications, candidates, profiles, saved, subscriptions
from seed_data import seed_database
from database import SessionLocal
from routes import employer_profiles, recommendations



app = FastAPI(title="Workmate API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

from fastapi.staticfiles import StaticFiles
import os

# After the CORS middleware, add:
# Create uploads directory if it doesn't exist
os.makedirs("uploads/resumes", exist_ok=True)
os.makedirs("uploads/profiles", exist_ok=True)

# Serve uploaded files as static content
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

@app.on_event("startup")
def on_startup():
    init_db()
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()

app.include_router(auth.router, prefix="/auth")
app.include_router(users.router, prefix="/users")
app.include_router(profiles.router, prefix="/profiles")
app.include_router(jobs.router, prefix="/jobs")
app.include_router(posts.router, prefix="/posts")
app.include_router(applications.router, prefix="/applications")
app.include_router(saved.router, prefix="/saved")
app.include_router(news.router, prefix="/news")
app.include_router(employer_profiles.router, prefix="/employer_profiles")
app.include_router(recommendations.router, prefix="/recommendations")
app.include_router(candidates.router, prefix="/candidates")
app.include_router(subscriptions.router, prefix="/subscriptions")