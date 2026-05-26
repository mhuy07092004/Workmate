from models.news import News
from sqlalchemy import select

class NewsRepository:
    def __init__(self, db):
        self.db = db

    def get_all(self):
        return self.db.execute(select(News)).scalars().all()

    def get_by_id(self, id):
        return self.db.execute(select(News).where(News.id == id)).scalars().first()

    def save(self, news_data: dict):
        news = News(**news_data)
        self.db.add(news)
        self.db.commit()
        self.db.refresh(news)
        return news

    def update(self, id, news_data: dict):
        news = self.get_by_id(id)
        if not news:
            return None
        for key, value in news_data.items():
            setattr(news, key, value)
        self.db.commit()
        self.db.refresh(news)
        return news

    def delete(self, id):
        news = self.get_by_id(id)
        if not news:
            return None
        self.db.delete(news)
        self.db.commit()
        return news