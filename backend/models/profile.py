from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from sqlalchemy.dialects.sqlite import JSON
from database import Base

class Profile(Base):
    __tablename__ = "profiles"

    id = Column(Integer, primary_key=True, unique=True)
    user_id = Column(Integer, unique=True, nullable=False)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    phone = Column(String, unique=True, nullable=False)
    education_level = Column(String, nullable=True)
    major = Column(String, nullable=True)
    school = Column(String, nullable=True)
    about_you = Column(Text, nullable=True)
    profile_picture_url = Column(String, nullable=True)
    resume_url = Column(String, nullable=True)
    resume_text = Column(Text, nullable=True)  # New: Plain text of resume
    resume_embedding = Column(JSON, nullable=True)  # New: Embedding of resume
    experiences = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())