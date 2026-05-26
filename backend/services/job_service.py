from repositories.job_repository import JobRepository
from fastapi import HTTPException
from utils.embeddings import generate_embedding

class JobService:
    def __init__(self, db):
        self.job_repo = JobRepository(db)

    def get_jobs(self):
        jobs = self.job_repo.get_all()
        return {"jobs": jobs}, 200

    def get_job(self, id: int):
        job = self.job_repo.get_by_id(id)
        if not job:
            raise HTTPException(404, "Job not found")
        return {"job": job}, 200

    def create_job(self, job_data: dict):
        combined_text = f"{job_data.get('description', '')} {job_data.get('requirements', '')}"
        embedding = generate_embedding(combined_text)
        if embedding:
            job_data['job_embedding'] = embedding
        job = self.job_repo.save(job_data)
        return {"message": "Job created successfully", "job": job}, 201

    def update_job(self, id: int, job_data: dict):
        if "description" in job_data or "requirements" in job_data:
            combined_text = f"{job_data.get('description', '')} {job_data.get('requirements', '')}"
            job_data["job_embedding"] = generate_embedding(combined_text)
        job = self.job_repo.update(id, job_data)
        if not job:
            return {"error": "Job not found"}, 404
        return {"message": "Job updated successfully", "job": job}, 200

    def delete_job(self, id: int):
        job = self.job_repo.delete(id)
        if not job:
            return {"error": "Job not found"}, 404
        return {"message": "Job deleted successfully"}, 200
    
    def search_jobs(self, filters: dict):
        jobs = self.job_repo.search(filters)
        return {"jobs": jobs}, 200