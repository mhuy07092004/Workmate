# backend/models/job.py
from sqlalchemy import Column, Integer, String, Text, DateTime, Float, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.dialects.sqlite import JSON
from database import Base

class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, unique=True)
    user_id = Column(Integer, nullable=True)  # Employer who posted this job
    title = Column(String, nullable=False)
    company = Column(String, nullable=False)
    job_type = Column(String, nullable=False)
    location = Column(String, nullable=False)
    description = Column(String, nullable=False)
    requirements = Column(String, nullable=False)
    salary_min = Column(Integer, nullable=False)
    salary_max = Column(Integer, nullable=False)
    job_embedding = Column(JSON, nullable=True)  # New: Combined embedding of description + requirements
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())