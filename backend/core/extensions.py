# extensions.py
import os
from dotenv import load_dotenv
from supabase import create_client, Client
import urllib.parse

# Load environment variables
load_dotenv()

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
# or prompt the user to add it
supabase_key = os.getenv("SUPABASE_KEY", "")

if not supabase_key:
    print("Warning: SUPABASE_KEY not found in environment variables.")
    print("Please add SUPABASE_KEY to your .env file or set it as an environment variable.")

# Create a singleton instance of the Supabase client
supabase = None
if supabase_url and supabase_key:
    try:
        supabase = create_client(supabase_url, supabase_key)
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
