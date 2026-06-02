from fastapi import APIRouter, Depends, HTTPException
from database import SessionLocal
from services.post_service import PostService
from services.auth_service import get_current_user


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

router = APIRouter(tags=["post"])


@router.get("/")


def get_posts(db = Depends(get_db)):
    """
    Retrieve all posts.
    """
    service = PostService(db)
    result, status = service.get_posts()
    return result


@router.get("/{post_id}")


def get_post(post_id: int, db = Depends(get_db)):
    """
    Retrieve a specific post by ID.
    """
    service = PostService(db)
    result, status = service.get_post(post_id)
    if status != 200:
        raise HTTPException(status_code=status, detail=result.get("error"))
    return result


@router.post("/")


def create_post(post_data: dict, db = Depends(get_db), current_user = Depends(get_current_user)):
    """
    Create a new post.
    Expected JSON:
    {
        "author_id": 1,
        "content": "Post content here...",
        "image_url": "https://example.com/image.jpg"
    }
    """
    service = PostService(db)
    result, status = service.create_post(post_data)
    if status != 201:
        raise HTTPException(status_code=status, detail=result.get("error"))
    return result


@router.put("/{post_id}")


def update_post(post_id: int, post_data: dict, db = Depends(get_db), current_user = Depends(get_current_user)):
    """
    Update an existing post.
    """
    service = PostService(db)
    result, status = service.update_post(post_id, post_data)
    if status != 200:
        raise HTTPException(status_code=status, detail=result.get("error"))
    return result


@router.delete("/{post_id}")


def delete_post(post_id: int, db = Depends(get_db), current_user = Depends(get_current_user)):
    """
    Delete a post by ID.
    """
    service = PostService(db)
    result, status = service.delete_post(post_id)
    if status != 200:
        raise HTTPException(status_code=status, detail=result.get("error"))
    return result


@router.post("/{post_id}/comments")


def add_comment(post_id: int, comment_data: dict, db = Depends(get_db), current_user = Depends(get_current_user)):
    """
    Add a comment to a post.
    Expected JSON:
    {
        "post_id": 1,
        "user_id": 2,
        "content": "Comment content..."
    }
    """
    service = PostService(db)
    result, status = service.add_comment(post_id, comment_data)
    if status != 201:
        raise HTTPException(status_code=status, detail=result.get("error"))
    return result
