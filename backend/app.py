# app.py
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from flask_restx import Api
from flask_jwt_extended import JWTManager
import os
from datetime import timedelta

load_dotenv()

from core.extensions import db  # Import the shared db instance

app = Flask(__name__)

# Configure CORS to allow requests from the frontend
CORS(
    app,
    resources={
        r"/*": {
            "origins": [
                "http://localhost:3000",
                "http://localhost:3001",
                "http://127.0.0.1:3000",
                "http://127.0.0.1:3001",
            ],
            "methods": ["GET", "POST", "OPTIONS", "PUT", "DELETE"],
            "allow_headers": ["Content-Type", "Authorization"],
        }
    },
)


# Add CORS headers to all responses
# @app.after_request
# def after_request(response):
#     response.headers.add("Access-Control-Allow-Origin", "*")
#     response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
#     response.headers.add("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS")
#     return response


# Handle OPTIONS requests explicitly
@app.route("/<path:path>", methods=["OPTIONS"])
@app.route("/", methods=["OPTIONS"])
def options_handler(*args, **kwargs):
    return jsonify({})


api = Api(app, doc="/docs", prefix="/api")

# Configure database - use Supabase PostgreSQL
supabase_url = os.getenv("SUPABASE_URL")
if supabase_url:
    # Use Supabase PostgreSQL in production/development
    app.config["SQLALCHEMY_DATABASE_URI"] = supabase_url
else:
    # Fallback to SQLite for testing or if Supabase URL is not provided
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///:memory:"

app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Configure JWT
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "dev-secret-key")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=1)
jwt = JWTManager(app)

# Initialize the database instance with the app
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
app.register_blueprint(chat_bp)


@app.route("/health")
def health_check():
    return {"status": "healthy", "version": "1.0.0"}


if __name__ == "__main__":
    with app.app_context():
        db.create_all()  # Create tables
    app.run(debug=os.getenv("FLASK_DEBUG", "True") == "True")
