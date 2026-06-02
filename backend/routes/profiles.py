from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from database import SessionLocal
from services.profile_service import ProfileService
from services.auth_service import get_current_user
import os
from datetime import datetime

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

router = APIRouter(tags=["profile"])

BASE_URL = os.getenv("BASE_URL", "http://localhost:8000")
UPLOAD_DIR = "uploads"
RESUME_DIR = os.path.join(UPLOAD_DIR, "resumes")
PROFILE_DIR = os.path.join(UPLOAD_DIR, "profiles")

os.makedirs(RESUME_DIR, exist_ok=True)
os.makedirs(PROFILE_DIR, exist_ok=True)


@router.get("/{user_id}")
def get_profile(user_id: int, db=Depends(get_db)):
    service = ProfileService(db)
    result, status = service.get_profile(user_id)
    if status != 200:
        raise HTTPException(status_code=status, detail=result.get("error"))
    return result


@router.post("/upload/{user_id}")
async def upload_files(
    user_id: int,
    resume: UploadFile = File(None),
    profile_picture: UploadFile = File(None),
    db=Depends(get_db),
    current_user=Depends(get_current_user),
):
    file_urls = {}
    resume_filepath = None  # ✅ Track local filepath for embedding generation

    try:
        if resume:
            if resume.content_type != "application/pdf":
                raise HTTPException(status_code=400, detail="Resume must be PDF")

            filename = f"{user_id}_{datetime.now().timestamp()}.pdf"
            filepath = os.path.join(RESUME_DIR, filename)
            resume_filepath = filepath  # ✅ Store for embedding call below

            with open(filepath, "wb") as f:
                f.write(await resume.read())

            # ✅ Create public URL for response and database storage
            file_urls["resume_url"] = f"{BASE_URL}/uploads/resumes/{filename}"

        if profile_picture:
            if profile_picture.content_type not in ["image/jpeg", "image/png", "image/jpg"]:
                raise HTTPException(status_code=400, detail="Profile picture must be JPG or PNG")

            filename = f"{user_id}_{datetime.now().timestamp()}.jpg"
            filepath = os.path.join(PROFILE_DIR, filename)

            with open(filepath, "wb") as f:
                f.write(await profile_picture.read())

            file_urls["profile_picture_url"] = f"{BASE_URL}/uploads/profiles/{filename}"

        # ✅ FIX: Pass LOCAL filepath for PDF extraction + PUBLIC URL for storage
        if "resume_url" in file_urls and resume_filepath:
            service = ProfileService(db)
            service.generate_resume_embedding_for_user(
                user_id,
                resume_filepath,  # Local filesystem path for os.path.exists() and PDF reading
                file_urls["resume_url"]  # Public URL to store in database
            )

        return file_urls

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"File upload failed: {str(e)}")


@router.post("/")
def create_profile(profile_data: dict, db=Depends(get_db), current_user=Depends(get_current_user)):
    service = ProfileService(db)
    result, status = service.create_profile(profile_data)
    if status != 201:
        raise HTTPException(status_code=status, detail=result.get("error"))
    return result


@router.put("/{user_id}")
def update_profile(user_id: int, profile_data: dict, db=Depends(get_db), current_user=Depends(get_current_user)):
    service = ProfileService(db)
    result, status = service.update_profile(user_id, profile_data)
    if status != 200:
        raise HTTPException(status_code=status, detail=result.get("error"))
    return result


@router.delete("/{user_id}")
def delete_profile(user_id: int, db=Depends(get_db), current_user=Depends(get_current_user)):
    service = ProfileService(db)
    result, status = service.delete_profile(user_id)
    if status != 200:
        raise HTTPException(status_code=status, detail=result.get("error"))
    return result