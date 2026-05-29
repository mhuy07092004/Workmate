from fastapi import APIRouter, Depends, HTTPException
from database import SessionLocal
from services.application_service import ApplicationService
from services.job_service import JobService
from services.auth_service import get_current_user

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

router = APIRouter(tags=["application"])
ALLOWED_STATUSES = ["applied", "reviewing", "shortlist", "rejected"]


@router.get("/user/{user_id}")
def get_user_applications(user_id: int, db = Depends(get_db), current_user = Depends(get_current_user)):
    """
    Get all applications for a specific user.
    """
    service = ApplicationService(db)
    result, status = service.get_applications_for_user(user_id)
    return result


@router.get("/job/{job_id}")
def get_job_applicants(job_id: int, db = Depends(get_db), current_user = Depends(get_current_user)):
    """
    Get all applicants for a specific job.
    """
    service = ApplicationService(db)
    result, status = service.get_applicants_for_job(job_id, current_user)
    return result


@router.post("/")
def apply_to_job(application_data: dict, db = Depends(get_db), current_user = Depends(get_current_user)):
    """
    Submit a job application.
    Expected JSON:
    {
        "user_id": 1,
        "job_id": 5,
        "status": "applied"
    }
    """
    service = ApplicationService(db)
    result, status = service.apply_to_job(application_data, current_user)
    if status != 201:
        raise HTTPException(status_code=status, detail=result.get("error"))
    return result


@router.put("/{application_id}/status")
def update_application_status(
    application_id: int, 
    status_data: dict, 
    db = Depends(get_db), 
    current_user = Depends(get_current_user)
):
    """
    Update application status.
    Only the employer who owns the job can update the status.
    Expected JSON:
    {
        "status": "applied" | "reviewing" | "shortlist" | "rejected"
    }
    """
    new_status = status_data.get("status")
    
    # Validate status
    if new_status not in ALLOWED_STATUSES:
        raise HTTPException(
            status_code=400, 
            detail=f"Invalid status. Allowed values: {', '.join(ALLOWED_STATUSES)}"
        )
    
    # Call service with current_user for authorization
    service = ApplicationService(db)
    result, status_code = service.update_application_status(application_id, new_status, current_user)
    
    if status_code != 200:
        raise HTTPException(status_code=status_code, detail=result.get("error"))
    
    return result


@router.delete("/{application_id}")
def delete_application(application_id: int, db = Depends(get_db), current_user = Depends(get_current_user)):
    """
    Delete an application.
    """
    service = ApplicationService(db)
    result, status = service.delete_application(application_id)
    if status != 200:
        raise HTTPException(status_code=status, detail=result.get("error"))
    return result