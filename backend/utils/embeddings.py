from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# Initialize the model once (cached)
model = None


def get_model():
    """Get or initialize the sentence transformer model"""
    global model
    if model is None:
        model = SentenceTransformer('all-MiniLM-L6-v2')
    return model


def generate_embedding(text: str) -> list:
    """
    Generate embedding for a given text

    Args:
        text: The text to embed (resume or job description)

    Returns:
        List of floats representing the embedding
    """
    if not text or not isinstance(text, str):
        return None

    model = get_model()
    embedding = model.encode(text, convert_to_tensor=False)
    return embedding.tolist()


def calculate_cosine_similarity(embedding1: list, embedding2: list) -> float:
    """
    Calculate cosine similarity between two embeddings

    Args:
        embedding1: First embedding (list of floats)
        embedding2: Second embedding (list of floats)

    Returns:
        Cosine similarity score between 0 and 1
    """
    if not embedding1 or not embedding2:
        return 0.0

    embedding1 = np.array(embedding1).reshape(1, -1)
    embedding2 = np.array(embedding2).reshape(1, -1)

    similarity = cosine_similarity(embedding1, embedding2)[0][0]
    return float(similarity)


def batch_generate_embeddings(texts: list) -> list:
    """
    Generate embeddings for multiple texts efficiently

    Args:
        texts: List of texts to embed

    Returns:
        List of embeddings
    """
    model = get_model()
    embeddings = model.encode(texts, convert_to_tensor=False)
    return [embedding.tolist() for embedding in embeddings]
