from repositories.candidate_repository import CandidateRepository
from repositories.job_repository import JobRepository
from utils.embeddings import generate_embedding, calculate_cosine_similarity
from fastapi import HTTPException
from fuzzywuzzy import fuzz

class CandidateService:
    def __init__(self, db):
        self.candidate_repo = CandidateRepository(db)
        self.job_repo = JobRepository(db)

    def get_recommended_jobs(self, user_id: int, limit: int = 10):
        """
        Get recommended jobs for a candidate based on resume similarity
        
        Args:
            user_id: The candidate's user ID
            limit: Maximum number of jobs to return (default 10)
        
        Returns:
            List of jobs with similarity scores, sorted by score (highest first)
        """
        try:
            # Get candidate's resume embedding
            candidate = self.candidate_repo.get_candidate_with_resume_embedding(user_id)
            resume_embedding = candidate.resume_embedding
            
            # Get all jobs with embeddings
            jobs = self.job_repo.get_all_with_embeddings()
            
            if not jobs:
                return {"jobs": [], "message": "No jobs available with embeddings"}, 200
            
            # Calculate similarity for each job
            job_scores = []
            for job in jobs:
                similarity_score = calculate_cosine_similarity(
                    resume_embedding,
                    job.job_embedding
                )
                job_scores.append({
                    "id": job.id,
                    "title": job.title,
                    "company": job.company,
                    "location": job.location,
                    "job_type": job.job_type,
                    "description": job.description,
                    "requirements": job.requirements,
                    "salary_min": job.salary_min,
                    "salary_max": job.salary_max,
                    "similarity_score": similarity_score,
                    "user_id": job.user_id,
                    "created_at": job.created_at,
                })
            
            # Sort by similarity score (highest first) and limit
            job_scores.sort(key=lambda x: x["similarity_score"], reverse=True)
            job_scores = job_scores[:limit]
            
            return {"jobs": job_scores}, 200
            
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    def update_candidate_resume_embedding(self, user_id: int, resume_text: str):
        """
        Update candidate's resume text and regenerate embedding
        
        Args:
            user_id: The candidate's user ID
            resume_text: The resume text to embed
        
        Returns:
            Updated candidate profile
        """
        try:
            # Generate embedding from resume text
            embedding = generate_embedding(resume_text)
            
            if not embedding:
                raise HTTPException(status_code=400, detail="Failed to generate embedding")
            
            # Update resume text and embedding
            self.candidate_repo.update_resume_text(user_id, resume_text)
            candidate = self.candidate_repo.update_resume_embedding(user_id, embedding)
            
            return {"message": "Resume embedding updated successfully", "candidate": candidate}, 200
            
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    def batch_generate_job_embeddings(self, jobs_data: list):
        """
        Generate embeddings for multiple jobs (batch operation)
        
        Args:
            jobs_data: List of job dicts with id, description, requirements
        
        Returns:
            Count of updated jobs
        """
        try:
            count = 0
            for job_data in jobs_data:
                job_id = job_data.get("id")
                description = job_data.get("description", "")
                requirements = job_data.get("requirements", "")
                
                combined_text = f"{description} {requirements}"
                embedding = generate_embedding(combined_text)
                
                if embedding:
                    self.job_repo.update(job_id, {"job_embedding": embedding})
                    count += 1
            
            return {"message": f"Updated {count} job embeddings", "count": count}, 200
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    def search_candidates(self, filters: dict):
        """
        Search candidates by keyword (in profile/resume) and apply filters.
        
        Filters:
          - keyword: Searches name, skills, experience, education (with fuzzy matching)
          - location: Exact filter
          - experience_level: Range filter
          - degree_type: Exact filter
          - major: Substring filter
        
        Returns:
            List of candidates matching criteria, sorted by fuzzy match score
        """
        candidates = self.candidate_repo.search(filters)

        # Handle fuzzy keyword search
        if filters.get("keyword"):
            search_keyword = filters["keyword"].lower()
            
            # Filter by fuzzy matching on candidate profile content
            filtered_candidates = []
            for candidate in candidates:
                # Combine all searchable candidate fields
                candidate_content = f"{candidate.full_name or ''} {candidate.resume_text or ''} {candidate.about_you or ''}".lower()
                
                # Use fuzzy matching with 70% threshold for typo tolerance
                match_score = fuzz.token_set_ratio(search_keyword, candidate_content)
                
                if match_score >= 70:
                    filtered_candidates.append((candidate, match_score))
            
            # Sort by match score (highest first)
            filtered_candidates.sort(key=lambda x: x[1], reverse=True)
            candidates = [cand for cand, score in filtered_candidates]

        return {"candidates": candidates}, 200