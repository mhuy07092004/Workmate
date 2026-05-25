from fastapi import APIRouter, Depends, HTTPException
from database import SessionLocal
from services.saved_service import SavedService
from services.auth_service import get_current_user

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

router = APIRouter(tags=["saved"])


@router.get("/user/{user_id}")
def get_saved_items(user_id: int, db = Depends(get_db), current_user = Depends(get_current_user)):
    """
    Get all saved items for a user.
    """
    service = SavedService(db)
    result, status = service.get_saved_items(user_id)
    return result


@router.post("/")
def save_item(saved_data: dict, db = Depends(get_db), current_user = Depends(get_current_user)):
    """
    Save a job or candidate.
    Expected JSON:
    {
        "user_id": 1,
        "job_id": 5,  (optional)
        "candidate_id": 3  (optional)
    }
    """
    service = SavedService(db)
    result, status = service.save_item(saved_data)
    if status != 201:
        raise HTTPException(status_code=status, detail=result.get("error"))
    return result


@router.delete("/{saved_id}")
def delete_saved_item(saved_id: int, db = Depends(get_db), current_user = Depends(get_current_user)):
    """
    Delete a saved item.
    """
    service = SavedService(db)
    result, status = service.delete_saved_item(saved_id)
    if status != 200:
        raise HTTPException(status_code=status, detail=result.get("error"))
    return result