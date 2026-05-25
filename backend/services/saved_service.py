from repositories.saved_repository import SavedRepository

class SavedService:
    def __init__(self, db):
        self.saved_repo = SavedRepository(db)

    def get_saved_items(self, user_id: int):
        items = self.saved_repo.get_by_user(user_id)
        return {"saved_items": items}, 200
    
    def save_item(self, saved_data: dict):
        saved_item = self.saved_repo.save(saved_data)
        return {"message": "Item saved successfully", "saved_item": saved_item}, 201
    
    def delete_saved_item(self, id: int):
        saved_item = self.saved_repo.delete(id)
        if not saved_item:
            return {"error": "Saved item not found"}, 404
        return {"message": "Saved item deleted successfully"}, 200