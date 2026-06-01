from models.post import Post
from sqlalchemy import select


class PostRepository:
    def __init__(self, db):
        self.db = db

    def get_all(self):
        posts = self.db.query(Post).all()
        return [post.to_dict() for post in posts]

    def get_by_id(self, id):
        post = self.db.query(Post).filter(Post.id == id).first()
        return post.to_dict() if post else None

    def get_by_author_id(self, author_id: int) -> list[Post]:
        return self.db.execute(select(Post).where(Post.author_id == author_id)).scalars().all()

    def save(self, post_data: dict) -> Post:
        post = Post(**post_data)
        self.db.add(post)
        self.db.commit()
        self.db.refresh(post)
        return post

    def update(self, id: int, post_data: dict) -> Post:
        post = self.get_by_id(id)
        if not post:
            return None
        for key, value in post_data.items():
            setattr(post, key, value)
        self.db.commit()
        self.db.refresh(post)
        return post

    def delete(self, id: int) -> Post:
        post = self.get_by_id(id)
        if not post:
            return None
        self.db.delete(post)
        self.db.commit()
        return post

    def add_comment(self, comment_data: dict):
        from models.comment import Comment
        comment = Comment(**comment_data)
        self.db.add(comment)
        self.db.commit()
        self.db.refresh(comment)
        return comment
