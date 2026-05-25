from repositories.news_repository import NewsRepository

class NewsService:
    def __init__(self, db):
        self.news_repo = NewsRepository(db)

    def get_news(self):
        return {"news": self.news_repo.get_all()}, 200

    def get_item(self, id):
        news = self.news_repo.get_by_id(id)
        if not news:
            return {"error": "News item not found."}, 404
        return {"news": news}, 200

    def create_news(self, news_data: dict):
        news = self.news_repo.save(news_data)
        return {"message": "News created successfully.", "news": news}, 201

    def update_news(self, id, news_data: dict):
        news = self.news_repo.update(id, news_data)
        if not news:
            return {"error": "News item not found."}, 404
        return {"message": "News updated successfully.", "news": news}, 200

    def delete_news(self, id):
        news = self.news_repo.delete(id)
        if not news:
            return {"error": "News item not found."}, 404
        return {"message": "News deleted successfully."}, 200