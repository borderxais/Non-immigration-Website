import os
import sys
import traceback
import logging
from datetime import datetime

# Add the parent directory to the Python path so we can import the core module
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Now import from core
from core.vector_db import get_vector_db

# Initialize vector database
try:
    print("Initializing VectorDB...")
    db = get_vector_db()
    print("VectorDB initialized successfully!")
    
    # Test adding documents
    print("\nTesting document insertion...")
    test_docs = [
        {
            "content": "The DS-160 is an online form for US nonimmigrant visa applications.",
            "metadata": {"category": "visa_form", "type": "DS-160"}
        },
        {
            "content": "A US visitor visa (B1/B2) is for temporary travel to the United States.",
            "metadata": {"category": "visa_type", "type": "B1/B2"}
        }
    ]
    
    print(f"Adding {len(test_docs)} test documents...")
    db.add_documents(test_docs)
    print("Documents added successfully!")
    
    # Test similarity search
    print("\nTesting similarity search...")
    query = "What is a DS-160 form?"
    print(f"Query: '{query}'")
    results = db.similarity_search(query, top_k=2)
    
    print(f"Found {len(results)} results:")
    for i, result in enumerate(results):
        print(f"Result {i+1}:")
        print(f"  Content: {result['content']}")
        print(f"  Metadata: {result['metadata']}")
        print(f"  Score: {result['score']}")
    
    # Test another query
    query = "How to apply for a US visa?"
    print(f"\nQuery: '{query}'")
    results = db.similarity_search(query, top_k=3)
    print(f"Found {len(results)} results:")
    for i, result in enumerate(results):
        print(f"Result {i+1}:")
        print(f"  Content: {result['content']}")
        print(f"  Metadata: {result['metadata']}")
        print(f"  Score: {result['score']}")
    
    # Optional: Clean up the collection
    print("\nCleaning up test documents...")
    from pymilvus import Collection
    collection = Collection(os.getenv("ZILLIZ_COLLECTION_NAME", "visa_assistant_vectors"))
    
    # Uncomment the following line to delete all documents
    # collection.delete(expr="id >= 0")  # Deletes all entries
    # print("✅ All documents deleted!")
    
    print(f"Total documents in collection: {collection.num_entities}")
    print("\nAll tests completed successfully!")
    
except Exception as e:
    print(f"Error during VectorDB operations: {e}")
    print("Traceback:")
    traceback.print_exc()
    sys.exit(1)
