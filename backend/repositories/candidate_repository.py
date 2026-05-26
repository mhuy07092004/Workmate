from models.profile import Profile
from sqlalchemy.sql import select
from fastapi import HTTPException

class CandidateRepository:
    def __init__(self, db):
        self.db = db

    def get_candidate_by_user_id(self, user_id: int):
        """Get candidate profile by user_id"""
        query = select(Profile).where(Profile.user_id == user_id)
        return self.db.execute(query).scalars().first()

    def get_candidate_with_resume_embedding(self, user_id: int):
        """Get candidate with resume embedding"""
        candidate = self.get_candidate_by_user_id(user_id)
        if not candidate:
            raise HTTPException(status_code=404, detail="Candidate not found")

        if not candidate.resume_embedding:
            raise HTTPException(status_code=400, detail="Candidate resume embedding missing")
        return candidate

    def update_resume_embedding(self, user_id: int, embedding: list) -> Profile:
        """Update candidate's resume embedding"""
        candidate = self.get_candidate_by_user_id(user_id)
        if not candidate:
            raise HTTPException(status_code=404, detail="Candidate not found")
        
        candidate.resume_embedding = embedding
        self.db.commit()
        self.db.refresh(candidate)
        return candidate

    def update_resume_text(self, user_id: int, resume_text: str) -> Profile:
        """Update candidate's resume text"""
        candidate = self.get_candidate_by_user_id(user_id)
        if not candidate:
            raise HTTPException(status_code=404, detail="Candidate not found")
        
        candidate.resume_text = resume_text
        self.db.commit()
        self.db.refresh(candidate)
        return candidate