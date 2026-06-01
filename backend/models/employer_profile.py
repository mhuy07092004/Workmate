from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from database import Base


class EmployerProfile(Base):
    __tablename__ = "employer_profiles"

    id = Column(Integer, primary_key=True, unique=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    phone = Column(String, unique=True, nullable=False)
    job_title = Column(String, nullable=True)
    company_name = Column(String, nullable=True)
    industry = Column(String, nullable=True)
    company_size = Column(String, nullable=True)
    company_website = Column(String, nullable=True)
    company_location = Column(String, nullable=True)
    about_company = Column(Text, nullable=True)
    profile_picture_url = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
