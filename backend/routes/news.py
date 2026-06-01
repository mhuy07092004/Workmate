from fastapi import APIRouter, Depends, HTTPException
from database import SessionLocal
from services.news_service import NewsService
from services.auth_service import get_current_user


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

router = APIRouter(tags=["news"])

@router.get("/")


def get_news(db = Depends(get_db), current_user = Depends(get_current_user)):
    """
    Retrieve all news items.
    Requires an authenticated user via JWT.
    """
    service = NewsService(db)
    result, status = service.get_news()
    if status != 200:
        raise HTTPException(status_code=status, detail=result.get("error"))
    return result

@router.get("/{news_id}")


def get_news_item(news_id: int, db = Depends(get_db), current_user = Depends(get_current_user)):
    """
    Retrieve a news item by ID.
    Requires an authenticated user via JWT.
    """
    service = NewsService(db)
    result, status = service.get_item(news_id)
    if status != 200:
        raise HTTPException(status_code=status, detail=result.get("error"))
    return result

@router.post("/")


def create_news(news_data: dict, db = Depends(get_db), current_user = Depends(get_current_user)):
    """
    Create a new news item.
    Expected JSON:
    {
        "headline": "Company news headline",
        "company": "TechCorp",
        "content": "Detailed news content...",
        "image_url": "https://example.com/image.jpg",
        "posted_time": "2026-05-15 09:00"
    }
    """
    service = NewsService(db)
    result, status = service.create_news(news_data)
    if status != 201:
        raise HTTPException(status_code=status, detail=result.get("error"))
    return result

@router.put("/{news_id}")


def update_news(news_id: int, news_data: dict, db = Depends(get_db), current_user = Depends(get_current_user)):
    """
    Update an existing news item by ID.
    Expected JSON:
    {
        "headline": "Updated headline",
        "company": "TechCorp",
        "content": "Updated content...",
        "image_url": "https://example.com/new-image.jpg",
        "posted_time": "2026-05-15 09:00"
    }
    """
    service = NewsService(db)
    result, status = service.update_news(news_id, news_data)
    if status != 200:
        raise HTTPException(status_code=status, detail=result.get("error"))
    return result

@router.delete("/{news_id}")


def delete_news(news_id: int, db = Depends(get_db), current_user = Depends(get_current_user)):
    """
    Delete a news item by ID.
    Requires an authenticated user via JWT.
    """
    service = NewsService(db)
    result, status = service.delete_news(news_id)
    if status != 200:
        raise HTTPException(status_code=status, detail=result.get("error"))
    return result
