from repositories.application_repository import ApplicationRepository
from repositories.job_repository import JobRepository
from repositories.profile_repository import ProfileRepository
from repositories.user_repository import UserRepository

class ApplicationService:
    def __init__(self, db):
        self.application_repo = ApplicationRepository(db)
        self.job_repo = JobRepository(db)
        self.profile_repo = ProfileRepository(db)
        self.user_repo = UserRepository(db)

    def get_applications_for_user(self, user_id: int):
        applications = self.application_repo.get_by_user(user_id)
        return {"applications": applications}, 200
    
    def get_applicants_for_job(self, job_id: int, current_user: dict):
        job = self.job_repo.get_by_id(job_id)
        if not job:
            return {"error": "Job not found"}, 404

        # Only employer who owns the job may view applicants
        if current_user.get("role") != "employer" or job.user_id != current_user.get("user_id"):
            return {"error": "Forbidden"}, 403

        applications = self.application_repo.get_by_job(job_id)
        applicants = []
        for app in applications:
            profile = self.profile_repo.get_by_user_id(app.user_id)
            user = self.user_repo.get_by_id(app.user_id)
            applicants.append({
                "application_id": app.id,
                "user_id": app.user_id,
                "fullName": profile.full_name if profile else (user.full_name if user else ""),
                "location": getattr(profile, "school", "") or "",
                "jobApplied": job.title,
                "resume_url": profile.resume_url if profile else None,
                "status": app.status,
                "applied_at": app.applied_at.isoformat() if app.applied_at else None
            })
        return {"applicants": applicants}, 200
    
    def apply_to_job(self, application_data: dict, current_user: dict):
        if current_user.get("role") == "employer":
            return {"error": "Employers cannot apply for jobs."}, 403

        user_id = current_user.get("user_id")
        job_id = application_data.get("job_id")
        if not job_id:
            return {"error": "job_id is required."}, 400

        if self.application_repo.exists(user_id, job_id):
            return {"error": "You have already applied to this job."}, 400

        application_data["user_id"] = user_id
        application = self.application_repo.save(application_data)
        return {"message": "Application submitted successfully", "application": application}, 201
    
    def update_application_status(self, id: int, status: str):
        application = self.application_repo.update_status(id, status)
        if not application:
            return {"error": "Application not found"}, 404
        return {"message": "Application status updated", "application": application}, 200
    
    def delete_application(self, id: int):
        application = self.application_repo.delete(id)
        if not application:
            return {"error": "Application not found"}, 404
        return {"message": "Application deleted successfully"}, 200