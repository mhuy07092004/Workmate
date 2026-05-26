from repositories.candidate_repository import CandidateRepository
from repositories.job_repository import JobRepository
from utils.embeddings import generate_embedding, calculate_cosine_similarity
from fastapi import HTTPException

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
                    "created_at": job.created_at.isoformat() if job.created_at else None
                })
            
            # Sort by similarity score (highest first)
            job_scores.sort(key=lambda x: x["similarity_score"], reverse=True)
            
            # Return top N jobs
            top_jobs = job_scores[:limit]
            
            return {
                "jobs": top_jobs,
                "total_recommendations": len(top_jobs),
                "message": "Recommendations generated based on resume similarity"
            }, 200
        
        except HTTPException as e:
            raise e
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error generating recommendations: {str(e)}")

    def update_candidate_resume_embedding(self, user_id: int, resume_text: str):
        """
        Update candidate's resume text and generate/store embedding
        
        Args:
            user_id: The candidate's user ID
            resume_text: The resume content as text
        
        Returns:
            Updated candidate profile
        """
        try:
            # Generate embedding from resume text
            embedding = generate_embedding(resume_text)
            
            if not embedding:
                raise HTTPException(status_code=400, detail="Could not generate embedding from resume text")
            
            # Update resume text
            self.candidate_repo.update_resume_text(user_id, resume_text)
            
            # Update embedding
            candidate = self.candidate_repo.update_resume_embedding(user_id, embedding)
            
            return {"message": "Resume embedding updated successfully", "candidate": candidate}, 200
        
        except HTTPException as e:
            raise e
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error updating resume embedding: {str(e)}")

    def batch_generate_job_embeddings(self, jobs_data: list):
        """
        Generate embeddings for multiple jobs and store them
        
        Args:
            jobs_data: List of job dictionaries with id, description, requirements
        
        Returns:
            Number of jobs updated
        """
        try:
            updated_count = 0
            
            for job_data in jobs_data:
                job_id = job_data.get("id")
                description = job_data.get("description", "")
                requirements = job_data.get("requirements", "")
                
                # Combine description and requirements for embedding
                combined_text = f"{description} {requirements}"
                
                # Generate embedding
                embedding = generate_embedding(combined_text)
                
                if embedding:
                    job = self.job_repo.get_by_id(job_id)
                    if job:
                        job.job_embedding = embedding
                        self.job_repo.db.commit()
                        updated_count += 1
            
            return {"message": f"Updated embeddings for {updated_count} jobs"}, 200
        
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error batch generating embeddings: {str(e)}")