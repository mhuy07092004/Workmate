from repositories.subscription_repository import SubscriptionRepository
from repositories.user_repository import UserRepository

class SubscriptionService:
    def __init__(self, db):
        self.subscription_repo = SubscriptionRepository(db)
        self.user_repo = UserRepository(db)

    def get_subscriptions(self):
        subscriptions = self.subscription_repo.get_all()
        return {"subscriptions": subscriptions}, 200
    
    def get_subscription(self, subscription_id: int):
        subscription = self.subscription_repo.get_by_id(subscription_id)
        if not subscription:
            return {"error": "Subscription not found"}, 404
        return {"subscription": subscription}, 200
    
    def get_user_subscription(self, user_id: int):
        # Check if user exists
        user = self.user_repo.get_by_id(user_id)
        if not user:
            return {"error": "User not found"}, 404
        
        subscription = self.subscription_repo.get_by_user_id(user_id)
        if not subscription:
            return {"error": "No subscription found for user"}, 404
        return {"subscription": subscription}, 200
    
    def create_subscription(self, subscription_data: dict):
        # Validate user exists
        user = self.user_repo.get_by_id(subscription_data.get("user_id"))
        if not user:
            return {"error": "User not found"}, 404
        
        # Check if user already has a subscription
        existing = self.subscription_repo.get_by_user_id(subscription_data.get("user_id"))
        if existing:
            return {"error": "User already has an active subscription"}, 400
        
        subscription = self.subscription_repo.save(subscription_data)
        return {"message": "Subscription created successfully", "subscription": subscription}, 201
    
    def upgrade_subscription(self, user_id: int, subscription_data: dict):
        # Validate user exists
        user = self.user_repo.get_by_id(user_id)
        if not user:
            return {"error": "User not found"}, 404
        
        subscription = self.subscription_repo.get_by_user_id(user_id)
        if not subscription:
            return {"error": "No subscription found for user"}, 404
        
        subscription = self.subscription_repo.update(subscription.id, subscription_data)
        return {"message": "Subscription updated successfully", "subscription": subscription}, 200
    
    def cancel_subscription(self, user_id: int):
        # Validate user exists
        user = self.user_repo.get_by_id(user_id)
        if not user:
            return {"error": "User not found"}, 404
        
        subscription = self.subscription_repo.get_by_user_id(user_id)
        if not subscription:
            return {"error": "No subscription found for user"}, 404
        
        subscription = self.subscription_repo.delete(subscription.id)
        return {"message": "Subscription cancelled successfully"}, 200