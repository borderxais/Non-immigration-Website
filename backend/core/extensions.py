# extensions.py
import os
from dotenv import load_dotenv
from supabase import create_client, Client
import urllib.parse
from flask_sqlalchemy import SQLAlchemy

# Load environment variables
load_dotenv()

# Initialize SQLAlchemy
db = SQLAlchemy()

# Parse the DATABASE_URL to extract Supabase credentials
database_url = os.getenv("SUPABASE_URL", "")
direct_url = os.getenv("SUPABASE_DIRECT_URL", "")

# Extract project reference from the URL
# Example: postgresql://postgres.jpphlvxzjgfqdgcyybcw:password@aws-0-us-west-1.pooler.supabase.com:6543/postgres
# We need to extract 'jpphlvxzjgfqdgcyybcw'
project_ref = ""
if database_url:
    try:
        parsed_url = urllib.parse.urlparse(database_url)
        username = parsed_url.username
        if username and "." in username:
            project_ref = username.split(".")[1]
    except Exception as e:
        print(f"Error parsing DATABASE_URL: {e}")

# Construct Supabase URL and key
# Note: This is a simplified approach. In production, you should store the actual Supabase URL and key
supabase_url = f"https://{project_ref}.supabase.co"
# Since we don't have the actual API key in the DATABASE_URL, we'll need to use an environment variable
# We need the service role secret key for backend operations, not the anon public key
supabase_key = os.getenv("SUPABASE_KEY", "")

if not supabase_key:
    print("Warning: SUPABASE_KEY not found in environment variables.")
    print("Please add your service role secret API key as SUPABASE_KEY to your .env file.")
    print("You can find this key in your Supabase dashboard under Project Settings > API.")

# Create a singleton instance of the Supabase client
supabase = None
if supabase_url and supabase_key:
    try:
        # Create client without any extra arguments that might cause issues
        supabase = create_client(supabase_url, supabase_key)
    except TypeError as e:
        # If there's a TypeError about unexpected arguments, try a more basic approach
        if "unexpected keyword argument" in str(e):
            print(f"Warning: {e}")
            print("Attempting to create Supabase client with basic parameters...")
            try:
                from supabase.client import Client as SupabaseClient
                supabase = SupabaseClient(supabase_url, supabase_key)
            except Exception as inner_e:
                print(f"Error creating Supabase client with basic parameters: {inner_e}")
    except Exception as e:
        print(f"Error initializing Supabase client: {e}")

# Function to get the Supabase client
def get_supabase_client() -> Client:
    """
    Returns the initialized Supabase client instance.
    
    Returns:
        Client: The Supabase client instance
    """
    if not supabase:
        raise ValueError("Supabase client not initialized. Please check your environment variables.")
    return supabase
