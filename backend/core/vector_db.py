"""
Vector database configuration and utilities for Zilliz Cloud integration.
"""
import os
from typing import List, Optional, Dict, Any

from pymilvus import connections, Collection, utility, CollectionSchema, FieldSchema, DataType
from sentence_transformers import SentenceTransformer
import numpy as np
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Zilliz Cloud configuration
ZILLIZ_CLOUD_URI = os.getenv("ZILLIZ_CLOUD_URI")
ZILLIZ_CLOUD_TOKEN = os.getenv("ZILLIZ_CLOUD_TOKEN")
ZILLIZ_COLLECTION_NAME = os.getenv("ZILLIZ_COLLECTION_NAME", "visa_assistant_vectors")

# Embedding model
EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "all-MiniLM-L6-v2")


class VectorDB:
    """Vector database client for Zilliz Cloud."""

    def __init__(self):
        """Initialize the vector database connection."""
        self.encoder = SentenceTransformer(EMBEDDING_MODEL)

        # Connect to Zilliz Cloud
        connections.connect(
            alias="default",
            uri=ZILLIZ_CLOUD_URI,
            token=ZILLIZ_CLOUD_TOKEN,
        )

        # Ensure collection exists
        self._ensure_collection_exists()

        # Get collection
        self.collection = Collection(ZILLIZ_COLLECTION_NAME)
        self.collection.load()

    def _ensure_collection_exists(self) -> None:
        """Ensure the collection exists, create it if not."""
        if not utility.has_collection(ZILLIZ_COLLECTION_NAME):
            print(f"Collection {ZILLIZ_COLLECTION_NAME} does not exist. Creating...")
            
            # Define fields
            fields = [
                FieldSchema(name="id", dtype=DataType.INT64, is_primary=True, auto_id=True),
                FieldSchema(name="content", dtype=DataType.VARCHAR, max_length=65535),
                FieldSchema(name="metadata", dtype=DataType.JSON),
                FieldSchema(name="embedding", dtype=DataType.FLOAT_VECTOR, dim=384)  # Match embedding model
            ]

            # Create schema and collection
            schema = CollectionSchema(fields=fields, description="Visa Assistant Knowledge Base")
            collection = Collection(name=ZILLIZ_COLLECTION_NAME, schema=schema)

            # Create index
            index_params = {
                "metric_type": "COSINE",
                "index_type": "HNSW",
                "params": {"M": 8, "efConstruction": 64}
            }
            collection.create_index(field_name="embedding", index_params=index_params)
            print(f"Collection {ZILLIZ_COLLECTION_NAME} created successfully.")
        else:
            print(f"Collection {ZILLIZ_COLLECTION_NAME} already exists.")

    def add_documents(self, documents: List[Dict[str, Any]]) -> None:
        """
        Add documents to the vector database.

        Args:
            documents: List of documents with 'content' and optional 'metadata'
        """
        if not documents:
            print("No documents provided for insertion.")
            return
        
        contents = [doc["content"] for doc in documents]
        metadata = [doc.get("metadata", {}) for doc in documents]

        # Generate embeddings
        embeddings = self.encoder.encode(contents)

        # Insert into collection
        entities = [
            contents,
            metadata,
            embeddings.tolist()
        ]

        # Insert into collection
        self.collection.insert(entities)
        self.collection.flush()
        print(f"Inserted {len(documents)} documents successfully.")

    def similarity_search(self, query: str, top_k: int = 5) -> List[Dict[str, Any]]:
        """
        Perform similarity search.

        Args:
            query: Query text
            top_k: Number of results to return
            
        Returns:
            List of documents with similarity scores
        """
        # Generate query embedding
        query_embedding = self.encoder.encode([query])[0]  # Ensure correct shape

        # Search parameters
        search_params = {"metric_type": "COSINE", "params": {"ef": 64}}
        
        # Perform search
        results = self.collection.search(
            data=[query_embedding.tolist()],
            anns_field="embedding",
            param=search_params,
            limit=top_k,
            output_fields=["content", "metadata"]
        )

        # Format results
        documents = []
        for hits in results:
            for hit in hits:
                documents.append({
                    "content": hit.entity.content,  
                    "metadata": hit.entity.metadata,
                    "score": hit.score
                })

        return documents


# Create a singleton instance
_vector_db_instance = None

def get_vector_db() -> VectorDB:
    """
    Returns the initialized VectorDB instance.
    
    Returns:
        VectorDB: The vector database instance
    """
    global _vector_db_instance
    
    if _vector_db_instance is None:
        try:
            _vector_db_instance = VectorDB()
        except Exception as e:
            raise ValueError(f"Failed to initialize VectorDB: {e}")
    
    return _vector_db_instance
