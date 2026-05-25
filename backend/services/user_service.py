from repositories.user_repository import UserRepository
from werkzeug.security import generate_password_hash, check_password_hash
from jose import jwt
from datetime import datetime, timedelta
from config import SECRET_KEY, ACCESS_TOKEN_EXPIRE_MINUTES, ALGORITHM

class UserService:
    def __init__(self, db):
        self.user_repo = UserRepository(db)

    def get_all_users(self) -> list:
        return self.user_repo.get_all()
    
    def get_user(self, user_id: int):
        user = self.user_repo.get_by_id(user_id)
        if not user:
            return {"error": "User not found"}, 404
        return {"user": user}, 200
    
    def add_user(self, user_data: dict):
        if self.user_repo.get_by_email(user_data.get("email")):
            return {"error": "Email already exists"}, 400
        
        user_data["password"] = generate_password_hash(user_data["password"])
        user = self.user_repo.save(user_data)
        return {"message": "User created successfully", "user": user}, 201
    
    def update_user(self, user_id: int, user_data: dict):
        user = self.user_repo.update(user_id, user_data)
        if not user:
            return {"error": "User not found"}, 404
        return {"message": "User updated successfully", "user": user}, 200
    
    def delete_user(self, user_id: int):
        user = self.user_repo.delete(user_id)
        if not user:
            return {"error": "User not found"}, 404
        return {"message": "User deleted successfully"}, 200