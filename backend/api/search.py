"""
Search API endpoints for both Supabase PostgreSQL and Zilliz Cloud.
Uses direct connections similar to the test scripts.
"""
from flask_restx import Namespace, Resource, fields
from flask import request
import os
import psycopg2
from core.vector_db import VectorDB
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Create namespace
api = Namespace("search", description="Search operations")

# Define models
search_model = api.model(
    "Search",
    {
        "query": fields.String(required=True, description="Search query"),
        "limit": fields.Integer(required=False, description="Number of results to return", default=5),
    },
)

search_result = api.model(
    "SearchResult",
    {
        "id": fields.String(description="Result ID"),
        "content": fields.String(description="Result content"),
        "metadata": fields.Raw(description="Result metadata"),
        "score": fields.Float(description="Similarity score"),
        "source": fields.String(description="Source database"),
    },
)

search_response = api.model(
    "SearchResponse",
    {
        "results": fields.List(fields.Nested(search_result), description="Search results"),
        "query": fields.String(description="Original query"),
        "total": fields.Integer(description="Total number of results"),
    },
)


@api.route("")
class Search(Resource):
    @api.expect(search_model)
    @api.marshal_with(search_response)
    def post(self):
        """
        Search across both databases.
        """
        data = request.json
        query = data.get("query", "")
        limit = data.get("limit", 5)

        # Initialize results
        results = []

        # Search vector database
        try:
            # Initialize VectorDB directly (like in test_Zilliz_connection.py)
            vector_db = VectorDB()
            vector_results = vector_db.similarity_search(query, top_k=limit)

            # Format vector results
            for result in vector_results:
                results.append(
                    {
                        "id": result["metadata"].get("id", "unknown"),
                        "content": result["content"],
                        "metadata": result["metadata"],
                        "score": result["score"],
                        "source": "vector_db",
                    }
                )
        except Exception as e:
            api.logger.error(f"Error searching vector database: {e}")

        # Search PostgreSQL database
        try:
            # Get database URL from environment (like in test_supabase_connection.py)
            database_url = os.getenv("SUPABASE_DIRECT_URL")
            if database_url:
                # Connect to PostgreSQL
                conn = psycopg2.connect(database_url)
                cursor = conn.cursor()

                # Example query - adjust based on your schema
                cursor.execute(
                    """
                    SELECT id, email, full_name, created_at
                    FROM users
                    WHERE 
                        email ILIKE %s OR
                        full_name ILIKE %s
                    LIMIT %s
                    """,
                    (f"%{query}%", f"%{query}%", limit),
                )

                # Process results
                for row in cursor.fetchall():
                    results.append(
                        {
                            "id": str(row[0]),
                            "content": f"User: {row[2]} ({row[1]})",
                            "metadata": {
                                "email": row[1],
                                "full_name": row[2],
                                "created_at": row[3].isoformat() if row[3] else None,
                            },
                            "score": 1.0,  # Direct match score
                            "source": "postgresql",
                        }
                    )

                # Close cursor and connection
                cursor.close()
                conn.close()
        except Exception as e:
            api.logger.error(f"Error searching PostgreSQL database: {e}")

        # Sort results by score (descending)
        results.sort(key=lambda x: x["score"], reverse=True)

        # Return response
        return {
            "results": results[:limit],
            "query": query,
            "total": len(results),
        }


@api.route("/vector")
class VectorSearch(Resource):
    @api.expect(search_model)
    @api.marshal_with(search_response)
    def post(self):
        """
        Search only in the vector database.
        """
        data = request.json
        query = data.get("query", "")
        limit = data.get("limit", 5)

        # Initialize results
        results = []

        # Search vector database
        try:
            # Initialize VectorDB directly (like in test_Zilliz_connection.py)
            vector_db = VectorDB()
            vector_results = vector_db.similarity_search(query, top_k=limit)

            # Format vector results
            for result in vector_results:
                results.append(
                    {
                        "id": result["metadata"].get("id", "unknown"),
                        "content": result["content"],
                        "metadata": result["metadata"],
                        "score": result["score"],
                        "source": "vector_db",
                    }
                )
        except Exception as e:
            api.logger.error(f"Error searching vector database: {e}")

        # Return response
        return {
            "results": results,
            "query": query,
            "total": len(results),
        }


@api.route("/sql")
class SQLSearch(Resource):
    @api.expect(search_model)
    @api.marshal_with(search_response)
    def post(self):
        """
        Search only in the PostgreSQL database.
        """
        data = request.json
        query = data.get("query", "")
        limit = data.get("limit", 5)

        # Initialize results
        results = []

        # Search PostgreSQL database
        try:
            # Get database URL from environment (like in test_supabase_connection.py)
            database_url = os.getenv("SUPABASE_DIRECT_URL")
            if database_url:
                # Connect to PostgreSQL
                conn = psycopg2.connect(database_url)
                cursor = conn.cursor()

                # Example query - adjust based on your schema
                cursor.execute(
                    """
                    SELECT id, email, full_name, created_at
                    FROM users
                    WHERE 
                        email ILIKE %s OR
                        full_name ILIKE %s
                    LIMIT %s
                    """,
                    (f"%{query}%", f"%{query}%", limit),
                )

                # Process results
                for row in cursor.fetchall():
                    results.append(
                        {
                            "id": str(row[0]),
                            "content": f"User: {row[2]} ({row[1]})",
                            "metadata": {
                                "email": row[1],
                                "full_name": row[2],
                                "created_at": row[3].isoformat() if row[3] else None,
                            },
                            "score": 1.0,  # Direct match score
                            "source": "postgresql",
                        }
                    )

                # Close cursor and connection
                cursor.close()
                conn.close()
        except Exception as e:
            api.logger.error(f"Error searching PostgreSQL database: {e}")

        # Return response
        return {
            "results": results,
            "query": query,
            "total": len(results),
        }
