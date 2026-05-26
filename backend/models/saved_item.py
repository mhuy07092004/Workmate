from sqlalchemy import Column, Integer, DateTime, ForeignKey
from sqlalchemy.sql import func
from database import Base

class SavedItem(Base):
    __tablename__ = "saved_items"

    id = Column(Integer, primary_key=True, unique=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    job_id = Column(Integer, ForeignKey("jobs.id"), nullable=True)
    candidate_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    saved_at = Column(DateTime(timezone=True), server_default=func.now())