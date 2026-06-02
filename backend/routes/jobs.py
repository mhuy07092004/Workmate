from fastapi import APIRouter, Depends, HTTPException
from database import SessionLocal
from services.job_service import JobService
from services.auth_service import get_current_user


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

router = APIRouter(tags=["job"])


@router.get("/")


def get_all_jobs(db = Depends(get_db)):
    """
    Retrieve all jobs.
    """
    service = JobService(db)
    result, status = service.get_jobs()
    return result


@router.get("/{job_id}")


def get_job(job_id: int, db = Depends(get_db)):
    """
    Retrieve a job post by job ID.
    """
    service = JobService(db)
    result, status = service.get_job(job_id)
    if status != 200:
        raise HTTPException(status_code=status, detail=result.get("error"))
    return result


@router.post("/")


def create_job(job_dict: dict, db = Depends(get_db), current_user = Depends(get_current_user)):
    """
    Create a new job post.

    Expected JSON:
    {
        "title": "Senior Software Engineer",
        "company": "Tech Company",
        "description": "We are looking for...",
        "requirements": "Must have: Python, React...",
        "location": "Sydney, NSW",
        "job_type": "Full-time",
        "work_arrangement": "Hybrid",
        "salary_min": 80000,
        "salary_max": 120000
    }

    Note: user_id is automatically set from the authenticated user.
    """
    job_dict["user_id"] = current_user.get("user_id")
    service = JobService(db)
    result, status = service.create_job(job_dict)
    if status != 201:
        raise HTTPException(status_code=status, detail=result.get("error"))
    return result


@router.put("/{job_id}")


def update_job(job_id: int, job_dict: dict, db = Depends(get_db), current_user = Depends(get_current_user)):
    """
    Update an existing job post by job ID.

    Only the authenticated job owner (employer) can update their job.
    """
    service = JobService(db)
    result, status = service.update_job(job_id, job_dict)
    if status != 200:
        raise HTTPException(status_code=status, detail=result.get("error"))
    return result


@router.delete("/{job_id}")


def delete_job(job_id: int, db = Depends(get_db), current_user = Depends(get_current_user)):
    """
    Delete a job by ID.

    Only the authenticated job owner (employer) can delete their job.
    """
    service = JobService(db)
    result, status = service.delete_job(job_id)
    if status != 200:
        raise HTTPException(status_code=status, detail=result.get("error"))
    return result


@router.post("/search")


def search_jobs(filters: dict, db = Depends(get_db)):
    """
    Search jobs by keyword and filters.

    Expected JSON:
    {
        "keyword": "python developer",
        "location": "Sydney",
        "job_type": "Full-time",
        "work_arrangement": "Hybrid",
        "salary_min": 80000,
        "salary_max": 150000,
        "company": "TechCorp"
    }

    All filters are optional. Keyword search uses fuzzy matching with typo tolerance.
    """
    service = JobService(db)
    result, status = service.search_jobs(filters)
    return result
