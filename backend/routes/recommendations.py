from fastapi import APIRouter, Depends, HTTPException
from database import SessionLocal
from services.recommendation_service import RecommendationService

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/candidates")


def get_recommended_candidates(job_id: int, limit: int = 12, db = Depends(get_db)):
    svc = RecommendationService(db)
    result, status = svc.recommend_candidates_for_job(job_id, limit)
    if status != 200:
        raise HTTPException(status_code=status, detail=result.get("error"))
    return result
