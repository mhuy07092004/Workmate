from repositories.user_repository import UserRepository
from werkzeug.security import generate_password_hash, check_password_hash
from jose import jwt
from datetime import datetime, timedelta
from config import SECRET_KEY, ACCESS_TOKEN_EXPIRE_MINUTES, ALGORITHM
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError

security = HTTPBearer()

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )

class AuthService:
    def __init__(self, db):
        self.user_repo = UserRepository(db)
    
    def register(self, data: dict):
        """
        Register a new user with email and password validation.
        Returns: (response_dict, status_code)
        """
        required_fields = ["email", "password", "full_name", "role"]
        
        for field in required_fields:
            if not data.get(field) or not str(data[field]).strip():
                return {"error": f"{field} is required."}, 400

        # Check if email already exists
        existing_user = self.user_repo.get_by_email(data["email"])
        if existing_user:
            return {"error": "Email already registered."}, 400

        # Hash password before saving
        user_data = {
            "full_name": data["full_name"],
            "email": data["email"],
            "password": generate_password_hash(data["password"]),
            "role": data["role"],  # "candidate" or "employer"
        }

        user = self.user_repo.save(user_data)
        return {"message": "User registered successfully."}, 201
    
    def _create_access_token(self, user):
        """Create JWT access token with user info."""
        payload = {
            "sub": user.email,
            "role": user.role,
            "user_id": user.id,
            "exp": datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        }
        encoded_jwt = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt    
    
    def authenticate(self, data: dict):
        """
        Authenticate user with email and password.
        Returns: (response_dict, status_code)
        On success: {"access_token": "<jwt_token>"}
        """
        required_fields = ["email", "password"]
        
        for field in required_fields:
            if not data.get(field) or not str(data[field]).strip():
                return {"error": f"{field} is required."}, 400

        email = data["email"]
        password = data["password"]

        # Find user by email
        user = self.user_repo.get_by_email(email)

        # Validate email exists and password matches
        if not user or not check_password_hash(user.password, password):
            return {"error": "Invalid email or password."}, 401

        # Generate JWT token
        access_token = self._create_access_token(user)

        return {
            "access_token": access_token,
            "user": {
                "id": user.id,
                "email": user.email,
                "full_name": user.full_name,
                "role": user.role
            }
        }, 200