"""
Script to update environment variables in .env file.
This script allows you to add or update variables without exposing sensitive information.
"""
import os
import sys
from dotenv import load_dotenv, set_key

def update_env_variable(key, value):
    """Update an environment variable in the .env file."""
    env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), '.env')
    
    # Check if .env file exists
    if not os.path.exists(env_path):
        print(f"Error: .env file not found at {env_path}")
        return False
    
    # Update the .env file
    set_key(env_path, key, value)
    print(f"Successfully updated {key} in .env file")
    return True

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python update_env.py KEY VALUE")
        sys.exit(1)
    
    key = sys.argv[1]
    value = sys.argv[2]
    
    if update_env_variable(key, value):
        print(f"Environment variable {key} has been updated")
    else:
        print(f"Failed to update environment variable {key}")
