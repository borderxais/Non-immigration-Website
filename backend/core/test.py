from vector_db import get_vector_db
db = get_vector_db()
print("VectorDB initialized!")

import os
import sys
import traceback
import logging
from datetime import datetime

# # Set up logging
# log_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "logs")
# os.makedirs(log_dir, exist_ok=True)
# log_file = os.path.join(log_dir, f"vector_db_test_{datetime.now().strftime('%Y%m%d_%H%M%S')}.log")

# logging.basicConfig(
#     level=logging.INFO,
#     format='%(asctime)s - %(levelname)s - %(message)s',
#     handlers=[
#         logging.FileHandler(log_file),
#         logging.StreamHandler(sys.stdout)
#     ]
# )

# logger = logging.getLogger(__name__)

# # Print Python environment information
# logger.info(f"Python executable: {sys.executable}")
# logger.info(f"Python version: {sys.version}")
# logger.info(f"Current working directory: {os.getcwd()}")

# # Try importing required modules
# try:
#     logger.info("Importing pymilvus...")
#     from pymilvus import connections, Collection, utility, CollectionSchema, FieldSchema, DataType
#     logger.info("pymilvus imported successfully!")
# except ImportError as e:
#     logger.error(f"Error importing pymilvus: {e}")
#     logger.error("Traceback:")
#     logger.error(traceback.format_exc())
#     sys.exit(1)

# try:
#     logger.info("Importing sentence_transformers...")
#     from sentence_transformers import SentenceTransformer
#     logger.info("sentence_transformers imported successfully!")
# except ImportError as e:
#     logger.error(f"Error importing sentence_transformers: {e}")
#     logger.error("Traceback:")
#     logger.error(traceback.format_exc())
#     sys.exit(1)

# # Try importing our vector_db module
# try:
#     logger.info("Importing vector_db module...")
#     from vector_db import get_vector_db
#     logger.info("vector_db module imported successfully!")
# except ImportError as e:
#     logger.error(f"Error importing vector_db: {e}")
#     logger.error("Traceback:")
#     logger.error(traceback.format_exc())
#     sys.exit(1)

# # Check environment variables
# logger.info("\nChecking environment variables:")
# zilliz_uri = os.getenv("ZILLIZ_CLOUD_URI")
# zilliz_token = os.getenv("ZILLIZ_CLOUD_TOKEN")
# collection_name = os.getenv("ZILLIZ_COLLECTION_NAME")
# embedding_model = os.getenv("EMBEDDING_MODEL")

# logger.info(f"ZILLIZ_CLOUD_URI: {'Set' if zilliz_uri else 'Not set'}")
# logger.info(f"ZILLIZ_CLOUD_TOKEN: {'Set' if zilliz_token else 'Not set'}")
# logger.info(f"ZILLIZ_COLLECTION_NAME: {collection_name}")
# logger.info(f"EMBEDDING_MODEL: {embedding_model}")

# if not zilliz_uri or not zilliz_token:
#     logger.warning("Warning: Zilliz Cloud credentials not set. Please update your .env file.")
#     sys.exit(1)

# Initialize vector database
try:
    logger.info("\nInitializing VectorDB...")
    db = get_vector_db()
    logger.info("VectorDB initialized successfully!")
    
    # Test adding documents
    logger.info("\nTesting document insertion...")
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
    
    logger.info(f"Adding {len(test_docs)} test documents...")
    db.add_documents(test_docs)
    logger.info("Documents added successfully!")
    
    # Test similarity search
    logger.info("\nTesting similarity search...")
    query = "What is a DS-160 form?"
    logger.info(f"Query: '{query}'")
    results = db.similarity_search(query, top_k=2)
    
    logger.info(f"Found {len(results)} results:")
    for i, result in enumerate(results):
        logger.info(f"Result {i+1}:")
        logger.info(f"  Content: {result['content']}")
        logger.info(f"  Metadata: {result['metadata']}")
        logger.info(f"  Score: {result['score']}")
    
    logger.info("\nAll tests completed successfully!")
    logger.info(f"Log file created at: {log_file}")
    
except Exception as e:
    logger.error(f"Error during VectorDB operations: {e}")
    logger.error("Traceback:")
    logger.error(traceback.format_exc())
    sys.exit(1)

query = "How to apply for a US visa?"
results = db.similarity_search(query, top_k=3)
print(results)

from pymilvus import Collection
collection = Collection("visa_assistant_vectors")

collection.delete(expr="id >= 0")  # Deletes all entries
print("✅ All documents deleted!")

print("Total documents in collection:", collection.num_entities)

