import os
import PyPDF2
from repositories.profile_repository import ProfileRepository
from utils.embeddings import generate_embedding
import logging

logger = logging.getLogger(__name__)

class ProfileService:
    def __init__(self, db):
        self.profile_repo = ProfileRepository(db)

    def _extract_text_from_pdf(self, pdf_path: str) -> str:
        """Extract text from PDF file"""
        try:
            with open(pdf_path, "rb") as f:
                reader = PyPDF2.PdfReader(f)
                text = "\n".join(page.extract_text() or "" for page in reader.pages)
                if not text or text.strip() == "":
                    logger.warning(f"PDF extraction returned empty text from {pdf_path}")
                return text
        except Exception as e:
            logger.error(f"Failed to extract text from PDF {pdf_path}: {str(e)}")
            return ""

    def _populate_resume_embedding(self, profile_data: dict):
        """Generate and populate resume embedding for profile data"""
        resume_path = profile_data.get("resume_url")
        if not resume_path or not os.path.exists(resume_path):
            logger.debug(f"Resume path not found or doesn't exist: {resume_path}")
            return

        resume_text = self._extract_text_from_pdf(resume_path)
        if not resume_text:
            logger.warning(f"Could not extract meaningful text from resume: {resume_path}")
            return

        try:
            embedding = generate_embedding(resume_text)
            if embedding:
                profile_data["resume_text"] = resume_text
                profile_data["resume_embedding"] = embedding
                logger.info(f"Successfully generated embedding for resume: {resume_path}")
            else:
                logger.warning(f"Embedding generation returned None for resume: {resume_path}")
        except Exception as e:
            logger.error(f"Failed to generate embedding for resume {resume_path}: {str(e)}")

    def generate_resume_embedding_for_user(self, user_id: int, resume_path: str):
        """Generate and update resume embedding for an existing user's profile"""
        try:
            profile = self.profile_repo.get_by_user_id(user_id)
            if not profile:
                logger.warning(f"Profile not found for user {user_id}")
                return False
            
            if not os.path.exists(resume_path):
                logger.error(f"Resume file does not exist: {resume_path}")
                return False
            
            resume_text = self._extract_text_from_pdf(resume_path)
            if not resume_text:
                logger.warning(f"Could not extract text from resume: {resume_path}")
                return False
            
            embedding = generate_embedding(resume_text)
            if not embedding:
                logger.error(f"Failed to generate embedding for resume: {resume_path}")
                return False
            
            # Update profile with new embedding and text
            update_data = {
                "resume_url": resume_path,
                "resume_text": resume_text,
                "resume_embedding": embedding
            }
            
            self.profile_repo.update(user_id, update_data)
            logger.info(f"Successfully generated and stored embedding for user {user_id}")
            return True
            
        except Exception as e:
            logger.error(f"Error generating embedding for user {user_id}: {str(e)}")
            return False

    def get_profile(self, user_id: int):
        profile = self.profile_repo.get_by_user_id(user_id)
        if not profile:
            return {"error": "Profile not found."}, 404
        return {"profile": profile}, 200

    def create_profile(self, profile_data: dict):
        self._populate_resume_embedding(profile_data)
        profile = self.profile_repo.save(profile_data)
        return {"message": "Profile created successfully.", "profile": profile}, 201

    def update_profile(self, user_id: int, profile_data: dict):
        profile = self.profile_repo.get_by_user_id(user_id)
        if not profile:
            return {"error": "Profile not found"}, 404

        if "resume_url" not in profile_data and profile.resume_url:
            profile_data["resume_url"] = profile.resume_url

        self._populate_resume_embedding(profile_data)
        profile = self.profile_repo.update(user_id, profile_data)
        if not profile:
            return {"error": "Profile not found"}, 404
        return {"message": "Profile updated successfully.", "profile": profile}, 200

    def delete_profile(self, user_id: int):
        profile = self.profile_repo.delete_by_user_id(user_id)
        if not profile:
            return {"error": "Profile not found"}, 404
        return {"message": "Profile deleted successfully."}, 200