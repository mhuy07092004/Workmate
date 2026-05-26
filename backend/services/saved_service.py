from repositories.saved_repository import SavedRepository

class SavedService:
    def __init__(self, db):
        self.saved_repo = SavedRepository(db)

    def get_saved_items(self, user_id: int):
        items = self.saved_repo.get_by_user(user_id)
        return {"saved_items": items}, 200
    
    def save_item(self, saved_data: dict):
        saved_item = self.saved_repo.save(saved_data)
        return {"message": "Item saved successfully", "saved_item": saved_item}, 201
    
    def delete_saved_item(self, id: int):
        saved_item = self.saved_repo.delete(id)
        if not saved_item:
            return {"error": "Saved item not found"}, 404
        return {"message": "Saved item deleted successfully"}, 200
    
    def is_job_saved(self, user_id: int, job_id: int):
        """Check if job is saved"""
        is_saved = self.saved_repo.is_job_saved(user_id, job_id)
        return {"is_saved": is_saved}, 200

    def save_job(self, user_id: int, job_id: int):
        """Save a job (prevent duplicates)"""
        if self.saved_repo.is_job_saved(user_id, job_id):
            return {"error": "Job already saved"}, 400
        
        saved_item = self.saved_repo.save({"user_id": user_id, "job_id": job_id, "candidate_id": user_id})
        return {"message": "Job saved successfully", "saved_item": saved_item}, 201

    def unsave_job(self, user_id: int, job_id: int):
        """Unsave a job"""
        saved_item = self.saved_repo.delete_by_job(user_id, job_id)
        if not saved_item:
            return {"error": "Saved job not found"}, 404
        return {"message": "Job unsaved successfully"}, 200

    def toggle_save_job(self, user_id: int, job_id: int):
        """Toggle save status"""
        if self.saved_repo.is_job_saved(user_id, job_id):
            return self.unsave_job(user_id, job_id)
        else:
            return self.save_job(user_id, job_id)