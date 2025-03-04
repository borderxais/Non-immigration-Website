from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Configure database
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///visa_assistant.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Import routes after app initialization to avoid circular imports
from api.ds160 import ds160_bp
from api.consultation import consultation_bp
from api.auth import auth_bp

# Register blueprints
app.register_blueprint(ds160_bp, url_prefix='/api/ds160')
app.register_blueprint(consultation_bp, url_prefix='/api/consultation')
app.register_blueprint(auth_bp, url_prefix='/api/auth')

@app.route('/health')
def health_check():
    return {'status': 'healthy', 'version': '1.0.0'}

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=os.getenv('FLASK_DEBUG', 'True') == 'True')
