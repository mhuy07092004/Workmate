from repositories.job_repository import JobRepository
from fastapi import HTTPException
from utils.embeddings import generate_embedding
from fuzzywuzzy import fuzz

class JobService:
    def __init__(self, db):
        self.job_repo = JobRepository(db)

    def get_jobs(self):
        jobs = self.job_repo.get_all()
        return {"jobs": [self._serialize_job(job) for job in jobs]}, 200

    def get_job(self, id: int):
        job = self.job_repo.get_by_id(id)
        if not job:
            raise HTTPException(404, "Job not found")
        return {"job": self._serialize_job(job)}, 200

    def create_job(self, job_data: dict):
        """Create a new job with embedding generation"""
        combined_text = f"{job_data.get('description', '')} {job_data.get('requirements', '')}"
        embedding = generate_embedding(combined_text)
        if embedding:
            job_data['job_embedding'] = embedding
        
        job = self.job_repo.save(job_data)
        return {"message": "Job created successfully", "job": self._serialize_job(job)}, 201

    def update_job(self, id: int, job_data: dict):
        """Update job and regenerate embedding if description/requirements changed"""
        if "description" in job_data or "requirements" in job_data:
            combined_text = f"{job_data.get('description', '')} {job_data.get('requirements', '')}"
            job_data["job_embedding"] = generate_embedding(combined_text)
        
        job = self.job_repo.update(id, job_data)
        if not job:
            return {"error": "Job not found"}, 404
        return {"message": "Job updated successfully", "job": self._serialize_job(job)}, 200

    def delete_job(self, id: int):
        job = self.job_repo.delete(id)
        if not job:
            return {"error": "Job not found"}, 404
        return {"message": "Job deleted successfully"}, 200
    
    def search_jobs(self, filters: dict):
        """
        Search jobs by keyword (in description + requirements) and apply filters.
        """
        jobs = self.job_repo.search(filters)
        
        print(f"DEBUG: Initial jobs from repo: {len(jobs)}")  # NEW
        print(f"DEBUG: Filters: {filters}")  # NEW

        # Handle fuzzy keyword search in description + requirements
        if filters.get("keyword"):
            search_keyword = filters["keyword"].lower()
            print(f"DEBUG: Searching for keyword: '{search_keyword}'")  # NEW
            
            # Filter by fuzzy matching on description + requirements
            filtered_jobs = []
            for job in jobs:
                job_content = f"{job.title or ''} {job.description or ''} {job.requirements or ''}".lower()
                
                # Use fuzzy matching with 30% threshold for typo tolerance
                match_score = fuzz.partial_ratio(search_keyword, job_content)
                
                print(f"DEBUG: Job '{job.title}' score: {match_score}")  # NEW
                
                if match_score >= 50:
                    filtered_jobs.append((job, match_score))
            
            print(f"DEBUG: Matched jobs: {len(filtered_jobs)}")  # NEW
            
            # Sort by match score (highest first)
            filtered_jobs.sort(key=lambda x: x[1], reverse=True)
            jobs = [job for job, score in filtered_jobs]

        return {"jobs": [self._serialize_job(job) for job in jobs]}, 200
        """
        Search jobs by keyword (in description + requirements) and apply filters.
        
        Filters:
          - keyword: Searches description + requirements (with fuzzy matching for typos)
          - location: Exact filter
          - job_type: Exact filter
          - salary_min: Range filter
          - salary_max: Range filter
          - company: Exact filter
        
        Returns:
            List of jobs matching criteria, sorted by fuzzy match score (highest first)
        """
        jobs = self.job_repo.search(filters)

        # Handle fuzzy keyword search in description + requirements
        if filters.get("keyword"):
            search_keyword = filters["keyword"].lower()
            
            # Filter by fuzzy matching on description + requirements
            filtered_jobs = []
            for job in jobs:
                job_content = f"{job.title or ''} {job.description or ''} {job.requirements or ''}".lower()
                
                # Use fuzzy matching with 70% threshold for typo tolerance
                match_score = fuzz.token_set_ratio(search_keyword, job_content)
                
                if match_score >= 30:
                    filtered_jobs.append((job, match_score))
            
            # Sort by match score (highest first)
            filtered_jobs.sort(key=lambda x: x[1], reverse=True)
            jobs = [job for job, score in filtered_jobs]

        return {"jobs": [self._serialize_job(job) for job in jobs]}, 200

    def _serialize_job(self, job):
        """Convert Job model to dict for JSON serialization"""
        if not job:
            return None
        
        return {
            "id": job.id,
            "user_id": job.user_id,
            "title": job.title,
            "company": job.company,
            "job_type": job.job_type,
            "location": job.location,
            "description": job.description,
            "requirements": job.requirements,
            "salary_min": job.salary_min,
            "salary_max": job.salary_max,
            "work_arrangement": job.work_arrangement or "Hybrid",  # NEW: 2nd submission
            "job_embedding": job.job_embedding,
            "created_at": job.created_at.isoformat() if job.created_at else None,
            "updated_at": job.updated_at.isoformat() if job.updated_at else None,
        }