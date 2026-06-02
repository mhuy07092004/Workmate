from fastapi import APIRouter, Depends, HTTPException
from database import SessionLocal
from services.subscription_service import SubscriptionService
from services.auth_service import get_current_user


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

router = APIRouter(tags=["subscription"])

@router.get("/")


def get_all_subscriptions(db = Depends(get_db)):
    """
    Retrieve all subscriptions (admin only).
    """
    service = SubscriptionService(db)
    result, status = service.get_subscriptions()
    return result

@router.get("/{subscription_id}")


def get_subscription(subscription_id: int, db = Depends(get_db)):
    """
    Retrieve a subscription by subscription ID.
    """
    service = SubscriptionService(db)
    result, status = service.get_subscription(subscription_id)
    if status != 200:
        raise HTTPException(status_code=status, detail=result.get("error"))
    return result

@router.get("/user/{user_id}")


def get_user_subscription(user_id: int, db = Depends(get_db)):
    """
    Retrieve subscription for a specific user.
    """
    service = SubscriptionService(db)
    result, status = service.get_user_subscription(user_id)
    if status != 200:
        raise HTTPException(status_code=status, detail=result.get("error"))
    return result

@router.post("/")


def create_subscription(subscription_dict: dict, db = Depends(get_db), current_user = Depends(get_current_user)):
    """
    Create a new subscription.
    """
    service = SubscriptionService(db)
    result, status = service.create_subscription(subscription_dict)
    if status != 201:
        raise HTTPException(status_code=status, detail=result.get("error"))
    return result

@router.put("/{user_id}")


def upgrade_subscription(user_id: int, subscription_dict: dict, db = Depends(get_db), current_user = Depends(get_current_user)):
    """
    Upgrade or change a user's subscription tier/period.
    """
    service = SubscriptionService(db)
    result, status = service.upgrade_subscription(user_id, subscription_dict)
    if status != 200:
        raise HTTPException(status_code=status, detail=result.get("error"))
    return result

@router.delete("/{user_id}")


def cancel_subscription(user_id: int, db = Depends(get_db), current_user = Depends(get_current_user)):
    """
    Cancel a user's subscription.
    """
    service = SubscriptionService(db)
    result, status = service.cancel_subscription(user_id)
    if status != 200:
        raise HTTPException(status_code=status, detail=result.get("error"))
    return result
