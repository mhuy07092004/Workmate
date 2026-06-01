from fastapi import APIRouter, Depends, HTTPException
from database import SessionLocal
from services.candidate_service import CandidateService

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/recommended-jobs/{user_id}")


def get_recommended_jobs(user_id: int, limit: int = 10, db = Depends(get_db)):
    """
    Get recommended jobs for a candidate based on resume similarity

    Args:
        user_id: The candidate's user ID
        limit: Maximum number of jobs to return (default 10)

    Returns:
        List of jobs sorted by similarity score (highest first)
    """
    candidate_service = CandidateService(db)
    result, status_code = candidate_service.get_recommended_jobs(user_id, limit)
    return result

@router.post("/search")


def search_candidates(filters: dict, db = Depends(get_db)):
    """
    Search candidates by keyword and filters

    Request body:
    {
        "keyword": "python developer",  # Searches name, resume, profile
        "location": "Sydney",
        "degree_type": "Bachelor",
        "major": "Computer Science"
    }

    Returns:
        List of candidates matching criteria
    """
    candidate_service = CandidateService(db)
    result, status_code = candidate_service.search_candidates(filters)
    return result

@router.post("/update-resume-embedding/{user_id}")


def update_resume_embedding(user_id: int, resume_data: dict, db = Depends(get_db)):
    """
    Update candidate's resume and generate embedding

    Args:
        user_id: The candidate's user ID
        resume_data: Dictionary with 'resume_text' key containing resume content

    Returns:
        Confirmation message
    """
    resume_text = resume_data.get("resume_text")

    if not resume_text:
        raise HTTPException(status_code=400, detail="resume_text is required")

    candidate_service = CandidateService(db)
    result, status_code = candidate_service.update_candidate_resume_embedding(user_id, resume_text)
    return result

@router.post("/batch-generate-job-embeddings")


def batch_generate_job_embeddings(jobs_data: list, db = Depends(get_db)):
    """
    Generate embeddings for multiple jobs (admin/batch operation)

    Args:
        jobs_data: List of job dictionaries with id, description, requirements

    Returns:
        Count of updated jobs
    """
    candidate_service = CandidateService(db)
    result, status_code = candidate_service.batch_generate_job_embeddings(jobs_data)
    return result
