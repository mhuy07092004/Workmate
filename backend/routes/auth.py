from fastapi import APIRouter, Depends, HTTPException
from database import SessionLocal
from services.auth_service import AuthService


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

router = APIRouter(tags=["auth"])

@router.post("/signup")


def sign_up(user_data: dict, db = Depends(get_db)):
    """
    Register a new user (candidate or employer).
    Expected JSON:
    {
        "email": "user@example.com",
        "password": "securepass",
        "full_name": "John Doe",
        "role": "candidate"
    }
    """
    service = AuthService(db)
    result, status = service.register(user_data)
    if status != 201:
        raise HTTPException(status_code=status, detail=result.get("error"))
    return result

@router.post("/signin")


def sign_in(credentials: dict, db = Depends(get_db)):
    """
    Authenticate a user and return a JWT token.
    Expected JSON:
    {
        "email": "user@example.com",
        "password": "securepass"
    }
    """
    service = AuthService(db)
    result, status = service.authenticate(credentials)
    if status != 200:
        raise HTTPException(status_code=status, detail=result.get("error"))
    return result
