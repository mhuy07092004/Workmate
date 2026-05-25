from repositories.post_repository import PostRepository

class PostService:
    def __init__(self, db):
        self.post_repo = PostRepository(db)

    def get_posts(self):
        posts = self.post_repo.get_all()
        return {"posts": posts}, 200
    
    def get_post(self, id: int):
        post = self.post_repo.get_by_id(id)
        if not post:
            return {"error": "Post not found"}, 404
        return {"post": post}, 200
    
    def create_post(self, post_data: dict):
        post = self.post_repo.save(post_data)
        return {"message": "Post created successfully", "post": post}, 201
    
    def update_post(self, id: int, post_data: dict):
        post = self.post_repo.update(id, post_data)
        if not post:
            return {"error": "Post not found"}, 404
        return {"message": "Post updated successfully", "post": post}, 200
    
    def delete_post(self, id: int):
        post = self.post_repo.delete(id)
        if not post:
            return {"error": "Post not found"}, 404
        return {"message": "Post deleted successfully"}, 200
    
    def add_comment(self, post_id: int, comment_data: dict):
        comment = self.post_repo.add_comment(comment_data)
        return {"message": "Comment added successfully", "comment": comment}, 201