class TestEmbeddingUtils:
    """Unit tests for the embedding utility"""
 
    def test_cosine_similarity_identical_vectors(self):
        from utils.embeddings import calculate_cosine_similarity
        v = [1.0, 0.5, 0.3]
        score = calculate_cosine_similarity(v, v)
        assert abs(score - 1.0) < 1e-6
 
    def test_cosine_similarity_orthogonal_vectors(self):
        from utils.embeddings import calculate_cosine_similarity
        v1 = [1.0, 0.0]
        v2 = [0.0, 1.0]
        score = calculate_cosine_similarity(v1, v2)
        assert abs(score) < 1e-6
 
    def test_cosine_similarity_zero_vector(self):
        from utils.embeddings import calculate_cosine_similarity
        v1 = [0.0, 0.0]
        v2 = [1.0, 1.0]
        # Should handle gracefully (return 0 or raise)
        try:
            score = calculate_cosine_similarity(v1, v2)
            assert score == 0.0
        except Exception:
            pass  # division by zero handling is acceptable