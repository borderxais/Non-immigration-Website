"""
Database initialization script.
This script creates all tables defined in the models.
"""
import os
import sys

# Add the parent directory to the path so we can import the app
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import app, db
from models.user import User
from models.ds160 import DS160Form
from sqlalchemy import inspect

def init_db():
    """Initialize the database by creating all tables."""
    with app.app_context():
        print("Creating database tables...")
        db.create_all()
        print("Database tables created successfully!")

        # Check if tables were created
        inspector = inspect(db.engine)
        tables = inspector.get_table_names()
        print(f"Tables in database: {', '.join(tables)}")

if __name__ == "__main__":
    init_db()
