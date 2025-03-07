from flask import Blueprint, request, jsonify
from flask_restx import Api, Resource, Namespace
import os
from core.extensions import get_pg_connection, execute_pg_query
from core.vector_db import VectorDB
from models.user import User
import logging

# Import OpenAI with new client
try:
    from openai import OpenAI
    USING_NEW_CLIENT = True
except ImportError:
    # Fallback to old client for compatibility
    import openai
    USING_NEW_CLIENT = False

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create Blueprint
chat_bp = Blueprint('chat', __name__, url_prefix='/api/chat')  # Add url_prefix to the Blueprint
api = Api(chat_bp, version='1.0', title='Chat API', description='Chat API for visa assistant')
ns = Namespace('', description='Chat operations')  # Empty namespace path since the blueprint already has the prefix
api.add_namespace(ns)

# Initialize VectorDB
vector_db = VectorDB()

# Get OpenAI API key from environment variable
openai_api_key = os.getenv("OPENAI_API_KEY")
if not openai_api_key:
    logger.warning("OPENAI_API_KEY not found in environment variables. Chat responses will be limited.")
else:
    logger.info("OpenAI API key found. Chat responses will use OpenAI.")
    # Initialize OpenAI client if using new version
    if USING_NEW_CLIENT:
        openai_client = OpenAI(api_key=openai_api_key)
        logger.info("Using new OpenAI client")
    else:
        # Set API key for old client
        openai.api_key = openai_api_key
        logger.info("Using legacy OpenAI client")

@ns.route('')
class ChatResource(Resource):
    def post(self):
        """
        Process a chat message and return a response
        """
        try:
            data = request.json
            query = data.get("message", "")
            user_id = data.get("user_id", None)
            
            if not query:
                return {"error": "No message provided"}, 400
            
            # Get search results from vector database
            vector_results = []
            try:
                vector_results = vector_db.similarity_search(query, top_k=3)
                logger.info(f"Found {len(vector_results)} results from vector search")
            except Exception as e:
                logger.error(f"Error searching vector database: {str(e)}")
            
            # Get user-specific data if user_id is provided
            user_data = []
            if user_id:
                try:
                    # Query PostgreSQL directly instead of using Supabase client
                    sql_query = """
                    SELECT u.id, u.email, u.full_name, f.form_type, f.status, f.submission_date
                    FROM users u
                    LEFT JOIN forms f ON u.id = f.user_id
                    WHERE u.id = %s
                    """
                    user_data = execute_pg_query(sql_query, (user_id,))
                    logger.info(f"Found {len(user_data)} user-specific data points")
                except Exception as e:
                    logger.error(f"Error getting user data: {str(e)}")
            
            # Combine vector search results and user data
            context = []
            
            # Add vector search results to context
            for result in vector_results:
                context.append({
                    "content": result["content"],
                    "metadata": result["metadata"],
                    "score": result["score"],
                    "source": "vector_db"
                })
            
            # Add user data to context if available
            for item in user_data:
                context.append({
                    "content": f"User {item.get('full_name', 'unknown')} has submitted a {item.get('form_type', 'unknown')} form with status {item.get('status', 'unknown')}.",
                    "metadata": item,
                    "score": 1.0,  # High relevance for user-specific data
                    "source": "user_db"
                })
            
            # If OpenAI API key is available, use it to generate a response
            if openai_api_key:
                # Prepare messages for OpenAI
                messages = [
                    {"role": "system", "content": "You are a helpful visa assistant. Use the provided context to answer the user's question accurately. If you don't know the answer, say so."},
                ]
                
                # Add context to the messages
                if context:
                    context_text = "\n\n".join([f"Source {i+1}: {item['content']}" for i, item in enumerate(context)])
                    messages.append({"role": "system", "content": f"Here is some context that might help you answer the user's question:\n\n{context_text}"})
                
                # Add user query
                messages.append({"role": "user", "content": query})
                
                # Call OpenAI API
                try:
                    logger.info("Calling OpenAI API...")
                    
                    if USING_NEW_CLIENT:
                        # Use new OpenAI client
                        response = openai_client.chat.completions.create(
                            model="gpt-3.5-turbo",
                            messages=messages,
                            max_tokens=500,
                            temperature=0.7
                        )
                        answer = response.choices[0].message.content
                    else:
                        # Use legacy OpenAI client
                        response = openai.ChatCompletion.create(
                            model="gpt-3.5-turbo",
                            messages=messages,
                            max_tokens=500,
                            temperature=0.7
                        )
                        answer = response.choices[0].message.content
                    
                    logger.info("Successfully received response from OpenAI")
                    
                    return {
                        "answer": answer,
                        "sources": context,
                        "response_source": "openai"  # Indicate that response came from OpenAI
                    }
                except Exception as e:
                    logger.error(f"Error calling OpenAI API: {str(e)}")
                    logger.error("Falling back to vector database response")
                    # Fall back to basic response if OpenAI fails
            
            # If OpenAI is not available or fails, use a basic response based on the context
            if context:
                answer = f"Based on my information: {context[0]['content']}"
                if len(context) > 1:
                    answer += f"\n\nI also found: {context[1]['content']}"
                
                return {
                    "answer": answer,
                    "sources": context,
                    "response_source": "vector_db"  # Indicate that response came from vector database
                }
            else:
                answer = "I'm sorry, I couldn't find any relevant information to answer your question."
                
                return {
                    "answer": answer,
                    "sources": [],
                    "response_source": "fallback"  # Indicate that response is a fallback
                }
            
        except Exception as e:
            logger.error(f"Error processing chat request: {str(e)}")
            return {"error": str(e)}, 500

@ns.route('/history')
class ChatHistoryResource(Resource):
    def get(self):
        """
        Get chat history for a user
        """
        try:
            user_id = request.args.get("user_id")
            if not user_id:
                return {"error": "No user_id provided"}, 400
            
            # Query chat history from database
            sql_query = """
            SELECT user_message, ai_response, response_source, created_at
            FROM chat_history
            WHERE user_id = %s
            ORDER BY created_at DESC
            LIMIT 50
            """
            
            history = execute_pg_query(sql_query, (user_id,))
            
            return {"history": history}
        except Exception as e:
            logger.error(f"Error getting chat history: {str(e)}")
            return {"error": str(e)}, 500
    
    def post(self):
        """
        Save a chat message and response to history
        """
        try:
            data = request.json
            user_id = data.get("user_id")
            user_message = data.get("user_message")
            ai_response = data.get("ai_response")
            response_source = data.get("response_source", "unknown")
            
            if not all([user_id, user_message, ai_response]):
                return {"error": "Missing required fields"}, 400
            
            # Insert chat history into database
            sql_query = """
            INSERT INTO chat_history (user_id, user_message, ai_response, response_source)
            VALUES (%s, %s, %s, %s)
            RETURNING id
            """
            
            result = execute_pg_query(sql_query, (user_id, user_message, ai_response, response_source), fetch_one=True)
            
            return {"success": True, "id": result.get("id")}
        except Exception as e:
            logger.error(f"Error saving chat history: {str(e)}")
            return {"error": str(e)}, 500
