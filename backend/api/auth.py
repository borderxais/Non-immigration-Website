from flask_restx import Namespace, Resource
from flask import request, jsonify, make_response
from models import ds160
from models.user import User
from core.extensions import db
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from datetime import timedelta

api = Namespace("auth", description="Authentication API")

# Allowed origins - keep in sync with other API files
ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
    'http://192.168.86.59:3000',
    'https://visaimmigration.netlify.app',
    'https://www.visaimmigration.netlify.app',
    'https://leonexusus.com'
]

# Helper function to add CORS headers
def add_cors_headers(response_data, status_code=200):
    origin = request.headers.get('Origin')
    headers = {}
    if origin in ALLOWED_ORIGINS:
        headers = {
            'Access-Control-Allow-Origin': origin,
            'Access-Control-Allow-Headers': 'Content-Type,Authorization',
            'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
            'Access-Control-Allow-Credentials': 'true'
        }
    return response_data, status_code, headers

@api.route("/register")
class RegisterResource(Resource):
    def post(self):
        """Register a new user"""
        data = request.json

        # Check if user already exists
        if User.query.filter_by(email=data["email"]).first():
            return jsonify({"error": "Email already registered"}), 400

        # Create new user
        user = User(email=data["email"], username=data["username"])
        user.set_password(data["password"])

        db.session.add(user)
        db.session.commit()

        # Generate access token
        access_token = create_access_token(
            identity=str(user.id), expires_delta=timedelta(days=1)
        )

        return (
            {
                "user": {
                    "id": str(user.id),
                    "username": user.username,
                    "email": user.email,
                    "createdAt": user.created_at.isoformat(),
                },
                "token": access_token,
            },
            201,
        )


@api.route("/login")
class LoginResource(Resource):
    def options(self):
        """Handle preflight OPTIONS request"""
        origin = request.headers.get('Origin')
        headers = {}
        if origin in ALLOWED_ORIGINS:
            headers = {
                'Access-Control-Allow-Origin': origin,
                'Access-Control-Allow-Headers': 'Content-Type,Authorization',
                'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
                'Access-Control-Allow-Credentials': 'true'
            }
        return {'success': True}, 200, headers
        
    def post(self):
        """Log in a user"""
        data = request.json
        user = User.query.filter_by(email=data["email"]).first()

        if user and user.check_password(data["password"]):
            # Generate access token
            access_token = create_access_token(
                identity=str(user.id), expires_delta=timedelta(days=1)
            )

            response_data = {
                "user": {
                    "id": str(user.id),
                    "username": user.username,
                    "email": user.email,
                    "createdAt": user.created_at.isoformat(),
                },
                "token": access_token,
            }
            
            return add_cors_headers(response_data)

        return add_cors_headers({"error": "Invalid credentials"}, 401)


@api.route("/me")
class UserResource(Resource):
    @jwt_required()
    def get(self):
        """Get current user information"""
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)

        if not user:
            return jsonify({"error": "User not found"}), 404

        return (
            {
                "id": str(user.id),
                "username": user.username,
                "email": user.email,
                "createdAt": user.created_at.isoformat(),
            },
            200,
        )


@api.route("/reset-password")
class PasswordResetRequestResource(Resource):
    def post(self):
        """Request password reset"""
        data = request.json
        user = User.query.filter_by(email=data["email"]).first()

        if not user:
            # Don't reveal that the user doesn't exist
            return {"success": True}, 200

        # TODO: Generate reset token and send email
        # For now, just return success
        return {"success": True}, 200


@api.route("/reset-password/confirm")
class PasswordResetConfirmResource(Resource):
    def post(self):
        """Complete password reset"""
        data = request.json
        # TODO: Validate reset token and update password
        return {"success": True}, 200


@api.route("/change-password")
class ChangePasswordResource(Resource):
    @jwt_required()
    def post(self):
        """Change password"""
        data = request.json
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)

        if not user:
            return jsonify({"error": "User not found"}), 404

        if not user.check_password(data["current_password"]):
            return jsonify({"error": "Current password is incorrect"}), 400

        user.set_password(data["new_password"])
        db.session.commit()

        return {"success": True}, 200


@api.route("/profile")
class ProfileResource(Resource):
    @jwt_required()
    def put(self):
        """Update user profile"""
        data = request.json
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)

        if not user:
            return jsonify({"error": "User not found"}), 404

        # Update user fields
        if "username" in data:
            user.username = data["username"]

        db.session.commit()

        return (
            {
                "id": str(user.id),
                "username": user.username,
                "email": user.email,
                "createdAt": user.created_at.isoformat(),
            },
            200,
        )
