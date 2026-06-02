from models.user import User
from sqlalchemy import select


class UserRepository:
    def __init__(self, db):
        self.db = db

    def get_all(self) -> list[User]:
        return self.db.execute(select(User)).scalars().all()

    def get_by_email(self, email: str):
        return self.db.execute(select(User).where(User.email == email)).scalars().first()

    def get_by_id(self, id: int):
        return self.db.execute(select(User).where(User.id == id)).scalars().first()

    def save(self, user_data: dict) -> User:
        user = User(**user_data)
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user

    def update(self, id: int, user_data: dict) -> User:
        user = self.get_by_id(id)
        if not user:
            return None
        for key, value in user_data.items():
            setattr(user, key, value)
        self.db.commit()
        self.db.refresh(user)
        return user

    def delete(self, id: int) -> User:
        user = self.get_by_id(id)
        if not user:
            return None
        self.db.delete(user)
        self.db.commit()
        return user

    def commit(self):
        self.db.commit()
