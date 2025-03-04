from flask_restx import Namespace, Resource
from flask import request, jsonify
from models.user import User
from core.extensions import db

api = Namespace("auth", description="Authentication API")


@api.route("/register")
class RegisterResource(Resource):
    def post(self):
        """Register a new user"""
        data = request.json

        # Check if user already exists
        if User.query.filter_by(email=data["email"]).first():
            return jsonify({"error": "Email already registered"}), 400

        # Create new user
        user = User(email=data["email"], full_name=data["full_name"])
        user.set_password(data["password"])

        db.session.add(user)
        db.session.commit()

        return jsonify({"message": "User registered successfully"}), 201


@api.route("/login")
class LoginResource(Resource):
    def post(self):
        """Log in a user"""
        data = request.json
        user = User.query.filter_by(email=data["email"]).first()

        if user and user.check_password(data["password"]):
            # TODO: Generate and return JWT token
            return jsonify({"message": "Login successful"}), 200

        return jsonify({"error": "Invalid credentials"}), 401
