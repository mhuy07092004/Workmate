from models.subscription import Subscription
from sqlalchemy import select


class SubscriptionRepository:
    def __init__(self, db):
        self.db = db

    def get_all(self) -> list[Subscription]:
        return self.db.execute(select(Subscription)).scalars().all()

    def get_by_id(self, id: int):
        return self.db.execute(select(Subscription).where(Subscription.id == id)).scalars().first()

    def get_by_user_id(self, user_id: int):
        return self.db.execute(select(Subscription).where(Subscription.user_id == user_id)).scalars().first()

    def save(self, subscription_data: dict) -> Subscription:
        subscription = Subscription(**subscription_data)
        self.db.add(subscription)
        self.db.commit()
        self.db.refresh(subscription)
        return subscription

    def update(self, id: int, subscription_data: dict) -> Subscription:
        subscription = self.get_by_id(id)
        if not subscription:
            return None
        for key, value in subscription_data.items():
            setattr(subscription, key, value)
        self.db.commit()
        self.db.refresh(subscription)
        return subscription

    def delete(self, id: int) -> Subscription:
        subscription = self.get_by_id(id)
        if not subscription:
            return None
        self.db.delete(subscription)
        self.db.commit()
        return subscription

    def commit(self):
        self.db.commit()
