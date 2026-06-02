from repositories.job_repository import JobRepository
from repositories.profile_repository import ProfileRepository
from utils.embeddings import calculate_cosine_similarity
from fastapi import HTTPException
import logging

logger = logging.getLogger(__name__)


class RecommendationService:
    def __init__(self, db):
        self.job_repo = JobRepository(db)
        self.profile_repo = ProfileRepository(db)

    def recommend_candidates_for_job(self, job_id: int, limit: int = 12):
        job = self.job_repo.get_by_id_with_embedding(job_id)
        if not job:
            logger.error(f"Job {job_id} not found")
            return {"error": "Job not found"}, 404
        if not job.job_embedding:
            logger.error(f"Job {job_id} has no embedding")
            return {"error": "Job embedding missing"}, 400

        candidates = self.profile_repo.get_all_with_embeddings()
        all_candidates = self.profile_repo.get_all()
        candidates_with_embedding = len(candidates)
        total_candidates = len(all_candidates)

        logger.info(f"Found {candidates_with_embedding} candidates with embeddings out of {total_candidates} total")

        if candidates_with_embedding == 0:
            logger.warning(f"No candidates with resume embeddings found for job {job_id}. Total candidates: {total_candidates}")

        scored = []
        for c in candidates:
            if not c.resume_embedding:
                logger.debug(f"Skipping candidate {c.user_id} - no resume embedding")
                continue
            score = calculate_cosine_similarity(job.job_embedding, c.resume_embedding)
            scored.append({
                "id": c.id,
                "userId": c.user_id,
                "fullName": c.full_name,
                "location": c.major or c.school or "",
                "jobApplied": job.title,
                "resume_url": c.resume_url,
                "major": c.major,
                "degree": c.education_level,
                "experience": c.experiences,
                "similarity_score": score
            })

        scored.sort(key=lambda x: x["similarity_score"], reverse=True)
        logger.info(f"Returning {len(scored[:limit])} recommended candidates for job {job_id}")
        return {"candidates": scored[:limit], "total": len(scored)}, 200
