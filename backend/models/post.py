from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, unique=True)
    author_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    content = Column(Text, nullable=False)
    image_url = Column(String, nullable=True)
    likes = Column(Integer, default=0)
    comments_count = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationship to User
    author = relationship("User", foreign_keys=[author_id])

    def to_dict(self):
        return {
            "id": self.id,
            "author_id": self.author_id,
            "author": self.author.full_name if self.author else "Unknown",
            "content": self.content,
            "image_url": self.image_url,
            "likes": self.likes,
            "comments_count": self.comments_count,
            "timestamp": self.created_at.isoformat() if self.created_at else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
