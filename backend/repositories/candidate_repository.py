from models.profile import Profile
from models.user import User
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

    def search(self, filters: dict) -> list:
        """
        Search candidates by filters (NOT keyword - that's done in service with fuzzy matching)
        
        Filters applied:
          - location: Substring match
          - experience_level: Exact match (if implemented in Profile model)
          - degree_type: Exact match
          - major: Substring match
        """
        query = select(Profile)
        
        # Apply filters (keyword search is done in service with fuzzy matching)
        if filters.get("location"):
            query = query.where(Profile.location.ilike(f"%{filters['location']}%"))
        
        if filters.get("degree_type"):
            query = query.where(Profile.education_level == filters['degree_type'])
        
        if filters.get("major"):
            query = query.where(Profile.major.ilike(f"%{filters['major']}%"))
        
        return self.db.execute(query).scalars().all()

    def get_all(self) -> list:
        """Get all candidates"""
        query = select(Profile)
        return self.db.execute(query).scalars().all()