from models.profile import Profile
from sqlalchemy import select

class ProfileRepository:
    def __init__(self, db):
        self.db = db

    def get_all(self):
        return self.db.execute(select(Profile)).scalars().all()

    def get_by_user_id(self, user_id: int):
        return (
            self.db.execute(select(Profile).where(Profile.user_id == user_id))
            .scalars()
            .first()
        )

    def get_all_with_embeddings(self):
        return self.db.execute(select(Profile).where(Profile.resume_embedding != None)).scalars().all()

    def save(self, profile_data: dict):
        profile = Profile(**profile_data)
        self.db.add(profile)
        self.db.commit()
        self.db.refresh(profile)
        return profile

    def update(self, user_id: int, profile_data: dict):
        profile = self.get_by_user_id(user_id)
        if not profile:
            return None

        for key, value in profile_data.items():
            setattr(profile, key, value)
        self.db.commit()
        self.db.refresh(profile)
        return profile

    def delete_by_user_id(self, user_id: int):
        profile = self.get_by_user_id(user_id)
        if not profile:
            return None
        self.db.delete(profile)
        self.db.commit()
        return profile