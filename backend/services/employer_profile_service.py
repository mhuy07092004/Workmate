from repositories.employer_profile_repository import EmployerProfileRepository

class EmployerProfileService:
    def __init__(self, db):
        self.profile_repo = EmployerProfileRepository(db)

    def get_profile(self, user_id: int):
        profile = self.profile_repo.get_by_user_id(user_id)
        if not profile:
            return {"error": "Employer profile not found."}, 404
        return {"profile": profile}, 200

    def create_profile(self, profile_data: dict):
        profile = self.profile_repo.save(profile_data)
        return {"message": "Employer profile created successfully.", "profile": profile}, 201

    def update_profile(self, user_id: int, profile_data: dict):
        profile = self.profile_repo.update(user_id, profile_data)
        if not profile:
            return {"error": "Employer profile not found."}, 404
        return {"message": "Employer profile updated successfully.", "profile": profile}, 200

    def delete_profile(self, user_id: int):
        profile = self.profile_repo.delete_by_user_id(user_id)
        if not profile:
            return {"error": "Employer profile not found."}, 404
        return {"message": "Employer profile deleted successfully."}, 200