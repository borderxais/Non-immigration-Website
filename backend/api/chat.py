from flask import Blueprint, request, jsonify
from flask_restx import Api, Resource, Namespace
import openai
import os
from core.extensions import get_supabase_client
from core.vector_db import VectorDB
from models.user import User
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create Blueprint
chat_bp = Blueprint('chat', __name__)
api = Api(chat_bp, version='1.0', title='Chat API', description='Chat API for visa assistant')
ns = Namespace('chat', description='Chat operations')
api.add_namespace(ns)

# Initialize VectorDB
vector_db = VectorDB()

# Get OpenAI API key from environment variable
openai_api_key = os.getenv("OPENAI_API_KEY")
if not openai_api_key:
    logger.warning("OPENAI_API_KEY not found in environment variables. Chat responses will be limited.")

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
            except Exception as e:
                logger.error(f"Error searching vector database: {str(e)}")
            
            # Get user-specific data if user_id is provided
            user_data = []
            if user_id:
                try:
                    # Connect to Supabase
                    supabase = get_supabase_client()
                    
                    # Query user-specific data
                    user = User.get_by_id(supabase, user_id)
                    if user:
                        # Get user's DS-160 forms and other relevant data
                        user_data = User.get_user_data(supabase, user_id)
                except Exception as e:
                    logger.error(f"Error fetching user data: {str(e)}")
            
            # Combine search results
            context = []
            
            # Add vector search results to context
            for result in vector_results:
                context.append({
                    "content": result.get("content", ""),
                    "source": "vector_db",
                    "score": result.get("score", 0)
                })
            
            # Add user data to context
            for item in user_data:
                context.append({
                    "content": str(item),
                    "source": "user_data",
                    "score": 1.0  # User data is highly relevant
                })
            
            # Generate response
            if openai_api_key and context:
                try:
                    # Format context for OpenAI
                    formatted_context = "\n\n".join([item["content"] for item in context])
                    
                    # Create system prompt
                    system_prompt = f"""You are a helpful visa assistant for BorderX, a company that helps people with US non-immigrant visa applications.
                    Use the following information to answer the user's question. If you don't know the answer based on the provided information, 
                    say that you don't have enough information and suggest they contact a visa consultant for personalized advice.
                    
                    CONTEXT INFORMATION:
                    {formatted_context}
                    """
                    
                    # Call OpenAI API
                    client = openai.OpenAI(api_key=openai_api_key)
                    response = client.chat.completions.create(
                        model="gpt-3.5-turbo",
                        messages=[
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": query}
                        ],
                        temperature=0.7,
                        max_tokens=500
                    )
                    
                    answer = response.choices[0].message.content
                    
                    return {
                        "answer": answer,
                        "sources": context
                    }
                    
                except Exception as e:
                    logger.error(f"Error calling OpenAI API: {str(e)}")
                    # Fall back to basic response
            
            # If OpenAI is not available or failed, return basic response
            if context:
                # Use the most relevant result as the answer
                answer = context[0]["content"]
                return {
                    "answer": answer,
                    "sources": context
                }
            else:
                return {
                    "answer": "I don't have specific information about that. Could you please ask something about visa applications or the DS-160 form?",
                    "sources": []
                }
                
        except Exception as e:
            logger.error(f"Error in chat endpoint: {str(e)}")
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
            
            # Connect to Supabase
            supabase = get_supabase_client()
            
            # Query chat history
            result = supabase.table("chat_history").select("*").eq("user_id", user_id).execute()
            
            return {"history": result.data}
            
        except Exception as e:
            logger.error(f"Error getting chat history: {str(e)}")
            return {"error": str(e)}, 500
    
    def post(self):
        """
        Save a chat message to history
        """
        try:
            data = request.json
            user_id = data.get("user_id")
            message = data.get("message")
            response = data.get("response")
            
            if not user_id or not message:
                return {"error": "Missing required fields"}, 400
            
            # Connect to Supabase
            supabase = get_supabase_client()
            
            # Save chat message
            result = supabase.table("chat_history").insert({
                "user_id": user_id,
                "message": message,
                "response": response,
                "created_at": "now()"
            }).execute()
            
            return {"success": True, "id": result.data[0]["id"]}
            
        except Exception as e:
            logger.error(f"Error saving chat history: {str(e)}")
            return {"error": str(e)}, 500
