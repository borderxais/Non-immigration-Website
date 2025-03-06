# app.py
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from flask_restx import Api
import os

load_dotenv()

from core.extensions import db  # Import the shared db instance

app = Flask(__name__)
api = Api(app, doc="/docs", prefix="/api")

CORS(app)

# Configure database - use Supabase PostgreSQL
supabase_url = os.getenv("SUPABASE_URL")
if supabase_url:
    # Use Supabase PostgreSQL in production/development
    app.config["SQLALCHEMY_DATABASE_URI"] = supabase_url
else:
    # Fallback to SQLite for testing or if Supabase URL is not provided
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///:memory:"

app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Initialize the SQLAlchemy instance with the app
db.init_app(app)

# Import namespaces after db is initialized
from api.ds160 import api as ds160_ns
from api.consultation import api as consultation_ns
from api.auth import api as auth_ns
from api.search import api as search_ns
from api.chat import chat_bp

# Register namespaces
api.add_namespace(ds160_ns, path="/ds160")
api.add_namespace(consultation_ns, path="/consultation")
api.add_namespace(auth_ns, path="/auth")
api.add_namespace(search_ns, path="/search")

# Register blueprints
app.register_blueprint(chat_bp, url_prefix='/api/chat')


@app.route("/health")
def health_check():
    return {"status": "healthy", "version": "1.0.0"}


if __name__ == "__main__":
    with app.app_context():
        db.create_all()  # Create tables
    app.run(debug=os.getenv("FLASK_DEBUG", "True") == "True")
