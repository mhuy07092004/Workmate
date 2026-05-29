from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from sqlalchemy.dialects.sqlite import JSON
from database import Base

class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, unique=True)
    user_id = Column(Integer, nullable=True)  # Employer who posted this job
    title = Column(String, nullable=False)
    company = Column(String, nullable=False)
    job_type = Column(String, nullable=False)  # Full-time, Part-time, Contract, Temporary
    location = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    requirements = Column(Text, nullable=False)
    salary_min = Column(Integer, nullable=False)
    salary_max = Column(Integer, nullable=False)
    
    # 2ND SUBMISSION: Work arrangement field
    work_arrangement = Column(String, nullable=True)  # On-site, Remote, Hybrid
    
    job_embedding = Column(JSON, nullable=True)  # Combined embedding of description + requirements
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())