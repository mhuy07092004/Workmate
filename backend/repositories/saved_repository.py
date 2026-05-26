from models.saved_item import SavedItem
from sqlalchemy import select

class SavedRepository:
    def __init__(self, db):
        self.db = db

    def get_all(self) -> list[SavedItem]:
        return self.db.execute(select(SavedItem)).scalars().all()
    
    def get_by_id(self, id: int) -> SavedItem:
        return self.db.execute(select(SavedItem).where(SavedItem.id == id)).scalars().first()
    
    def get_by_user(self, user_id: int) -> list[SavedItem]:
        return self.db.execute(select(SavedItem).where(SavedItem.user_id == user_id)).scalars().all()
    
    def save(self, saved_data: dict) -> SavedItem:
        saved_item = SavedItem(**saved_data)
        self.db.add(saved_item)
        self.db.commit()
        self.db.refresh(saved_item)
        return saved_item

    def delete(self, id: int) -> SavedItem:
        saved_item = self.get_by_id(id)
        if not saved_item:
            return None
        self.db.delete(saved_item)
        self.db.commit()
        return saved_item