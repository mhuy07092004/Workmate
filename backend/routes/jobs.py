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
    """
    service = JobService(db)
    result, status = service.delete_job(job_id)
    if status != 200:
        raise HTTPException(status_code=status, detail=result.get("error"))
    return result


@router.post("/search")
def search_jobs(filters: dict, db = Depends(get_db)):
    """
    Search jobs by filters.
    Expected JSON:
    {
        "location": "Sydney",
        "title": "Developer",
        "company": "TechCorp",
        "job_type": "Full-time",
        "salary_min": 80000,
        "salary_max": 150000
    }
    """
    service = JobService(db)
    result, status = service.search_jobs(filters)
    return result