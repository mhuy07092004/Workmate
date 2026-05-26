from fastapi import APIRouter, Depends, HTTPException
from database import SessionLocal
from services.employer_profile_service import EmployerProfileService
from services.auth_service import get_current_user

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

router = APIRouter(tags=["employer_profile"])

@router.get("/{user_id}")
def get_employer_profile(user_id: int, db = Depends(get_db), current_user = Depends(get_current_user)):
    service = EmployerProfileService(db)
    result, status = service.get_profile(user_id)
    if status != 200:
        raise HTTPException(status_code=status, detail=result.get("error"))
    return result

@router.post("/")
def create_employer_profile(profile_data: dict, db = Depends(get_db), current_user = Depends(get_current_user)):
    service = EmployerProfileService(db)
    result, status = service.create_profile(profile_data)
    if status != 201:
        raise HTTPException(status_code=status, detail=result.get("error"))
    return result

@router.put("/{user_id}")
def update_employer_profile(user_id: int, profile_data: dict, db = Depends(get_db), current_user = Depends(get_current_user)):
    service = EmployerProfileService(db)
    result, status = service.update_profile(user_id, profile_data)
    if status != 200:
        raise HTTPException(status_code=status, detail=result.get("error"))
    return result