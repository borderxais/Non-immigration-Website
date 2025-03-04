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
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///:memory:"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Initialize the SQLAlchemy instance with the app
db.init_app(app)

# Import namespaces after db is initialized
from api.ds160 import api as ds160_ns
from api.consultation import api as consultation_ns
from api.auth import api as auth_ns

# Register namespaces
api.add_namespace(ds160_ns, path="/ds160")
api.add_namespace(consultation_ns, path="/consultation")
api.add_namespace(auth_ns, path="/auth")


@app.route("/health")
def health_check():
    return {"status": "healthy", "version": "1.0.0"}


if __name__ == "__main__":
    with app.app_context():
        db.create_all()  # Create tables
    app.run(debug=os.getenv("FLASK_DEBUG", "True") == "True")
