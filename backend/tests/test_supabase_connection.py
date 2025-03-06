import os
try:
    # Try importing psycopg2 first (if installed)
    import psycopg2
except ImportError:
    # If not found, try importing from psycopg2-binary
    print("Using psycopg2-binary instead of psycopg2")
    import psycopg2
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

# Get Supabase database URL from .env
DATABASE_URL = os.getenv("SUPABASE_URL")

def test_supabase_connection():
    """Test the connection to Supabase PostgreSQL database."""
    try:
        # Connect to Supabase database
        conn = psycopg2.connect(DATABASE_URL)
        cursor = conn.cursor()

        # Execute a simple query
        cursor.execute("SELECT version();")
        db_version = cursor.fetchone()
        
        print("Connection to Supabase PostgreSQL successful!")
        print(f"PostgreSQL database version: {db_version}")
        
        # Close the connection
        cursor.close()
        conn.close()
        return True
    except Exception as e:
        print(f"Error connecting to Supabase PostgreSQL: {e}")
        return False

# Run the test
if __name__ == "__main__":
    test_supabase_connection()
