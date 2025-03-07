import os
import psycopg2
from psycopg2.extras import RealDictCursor
from flask_sqlalchemy import SQLAlchemy

# Initialize SQLAlchemy
db = SQLAlchemy()

# Load environment variables
DATABASE_URL = os.getenv("SUPABASE_URL")
supabase_user = os.getenv("SUPABASE_USER", "postgres")
supabase_db = os.getenv("SUPABASE_DB", "postgres")
supabase_port = os.getenv("SUPABASE_PORT", "5432")

# Check if Supabase credentials are available
if not DATABASE_URL:
    print("SUPABASE_URL not found in environment variables.")
    print("SQL search functionality will be limited.")

# Create a PostgreSQL connection for Supabase
pg_conn = None
if DATABASE_URL:
    try:
        pg_conn = psycopg2.connect(DATABASE_URL)
        print("Successfully connected to PostgreSQL database")
    except Exception as e:
        print(f"Error connecting to PostgreSQL: {e}")

# Function to get the PostgreSQL connection
def get_pg_connection():
    """
    Returns the PostgreSQL connection for Supabase.
    
    Returns:
        connection: The PostgreSQL connection
    """
    if not pg_conn:
        raise ValueError("PostgreSQL connection not initialized. Please check your environment variables.")
    return pg_conn

# Function to execute a query on PostgreSQL
def execute_pg_query(query, params=None):
    """
    Execute a query on the PostgreSQL database.
    
    Args:
        query (str): The SQL query to execute
        params (tuple, optional): Parameters for the query
        
    Returns:
        list: Query results as a list of dictionaries
    """
    if not pg_conn:
        raise ValueError("PostgreSQL connection not initialized")
    
    try:
        cursor = pg_conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute(query, params)
        results = cursor.fetchall()
        cursor.close()
        return [dict(row) for row in results]
    except Exception as e:
        print(f"Error executing PostgreSQL query: {e}")
        return []
