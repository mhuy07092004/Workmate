from fastapi import APIRouter, Depends, HTTPException
from database import SessionLocal
from services.user_service import UserService
from services.auth_service import get_current_user


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

router = APIRouter(tags=["user"])


@router.get("/")


def show_all(db = Depends(get_db)):
    """
    Get all users.
    """
    service = UserService(db)
    return service.get_all_users()


@router.get("/{user_id}")


def get_user(user_id: int, db = Depends(get_db)):
    """
    Get a specific user by ID.
    """
    service = UserService(db)
    result, status = service.get_user(user_id)
    if status != 200:
        raise HTTPException(status_code=status, detail=result.get("error"))
    return result


@router.post("/")


def create_user(user_data: dict, db = Depends(get_db)):
    """
    Create a new user.
    Expected JSON:
    {
        "full_name": "John Doe",
        "email": "john@example.com",
        "password": "securepass",
        "role": "candidate"
    }
    """
    service = UserService(db)
    result, status = service.add_user(user_data)
    if status != 201:
        raise HTTPException(status_code=status, detail=result.get("error"))
    return result


@router.put("/{user_id}")


def update_user(user_id: int, user_data: dict, db = Depends(get_db), current_user = Depends(get_current_user)):
    """
    Update a user.
    """
    service = UserService(db)
    result, status = service.update_user(user_id, user_data)
    if status != 200:
        raise HTTPException(status_code=status, detail=result.get("error"))
    return result


@router.delete("/{user_id}")


def delete_user(user_id: int, db = Depends(get_db), current_user = Depends(get_current_user)):
    """
    Delete a user.
    """
    service = UserService(db)
    result, status = service.delete_user(user_id)
    if status != 200:
        raise HTTPException(status_code=status, detail=result.get("error"))
    return result
