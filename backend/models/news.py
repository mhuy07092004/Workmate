from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from database import Base


class News(Base):
    __tablename__ = "news"

    id = Column(Integer, primary_key=True, unique=True)
    headline = Column(String, nullable=False)
    company = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    image_url = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
