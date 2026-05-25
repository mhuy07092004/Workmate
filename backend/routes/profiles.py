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

UPLOAD_DIR = "uploads"
os.makedirs(f"{UPLOAD_DIR}/resumes", exist_ok=True)
os.makedirs(f"{UPLOAD_DIR}/profiles", exist_ok=True)


@router.get("/{user_id}")
def get_profile(user_id: int, db = Depends(get_db), current_user = Depends(get_current_user)):
    """
    Retrieve a profile by user ID.
    Requires an authenticated user via JWT.
    """
    service = ProfileService(db)
    result, status = service.get_profile(user_id)
    if status != 200:
        raise HTTPException(status_code=status, detail=result.get("error"))
    return result

@router.post("/upload/{user_id}")
async def upload_files(user_id: int, 
                      resume: UploadFile = File(None), 
                      profile_picture: UploadFile = File(None),
                      db = Depends(get_db),
                      current_user = Depends(get_current_user)):
    """Upload resume and/or profile picture - requires authentication"""
    file_urls = {}
    
    try:
        if resume:
            if resume.content_type != "application/pdf":
                raise HTTPException(status_code=400, detail="Resume must be PDF")
            filename = f"{user_id}_{datetime.now().timestamp()}.pdf"
            filepath = f"{UPLOAD_DIR}/resumes/{filename}"
            with open(filepath, "wb") as f:
                f.write(await resume.read())
            file_urls["resume_url"] = filepath
        
        if profile_picture:
            if profile_picture.content_type not in ["image/jpeg", "image/png", "image/jpg"]:
                raise HTTPException(status_code=400, detail="Profile picture must be JPG or PNG")
            filename = f"{user_id}_{datetime.now().timestamp()}.jpg"
            filepath = f"{UPLOAD_DIR}/profiles/{filename}"
            with open(filepath, "wb") as f:
                f.write(await profile_picture.read())
            file_urls["profile_picture_url"] = filepath
        
        # If resume was uploaded, trigger embedding generation
        if "resume_url" in file_urls:
            service = ProfileService(db)
            service.generate_resume_embedding_for_user(user_id, file_urls["resume_url"])
        
        return file_urls
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"File upload failed: {str(e)}")

@router.post("/")
def create_profile(profile_data: dict, db = Depends(get_db), current_user = Depends(get_current_user)):
    """
    Create a new profile for the authenticated user.
    Expected JSON:
    {
        "user_id": 1,
        "full_name": "John Candidate",
        "email": "user@example.com",
        "phone": "+61 400 000 000",
        "education_level": "Bachelor",
        "major": "Computer Science",
        "school": "Tech University",
        "about_you": "My profile summary...",
        "profile_picture_url": "https://example.com/avatar.jpg",
        "resume_url": "https://example.com/resume.pdf",
        "experiences": [
            {
                "position": "Software Engineer",
                "company_name": "TechCorp",
                "from_date": "2022-01",
                "until_date": "2023-05",
                "is_currently_working": false
            }
        ]
    }
    """
    service = ProfileService(db)
    result, status = service.create_profile(profile_data)
    if status != 201:
        raise HTTPException(status_code=status, detail=result.get("error"))
    return result


@router.put("/{user_id}")
def update_profile(user_id: int, profile_data: dict, db = Depends(get_db), current_user = Depends(get_current_user)):
    service = ProfileService(db)
    result, status = service.update_profile(user_id, profile_data)
    if status not in (200, 201):
        raise HTTPException(status_code=status, detail=result.get("error"))
    return result