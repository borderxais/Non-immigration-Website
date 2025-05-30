from flask import request
from flask_restx import Namespace, Resource
from flask_jwt_extended import jwt_required, get_jwt_identity, current_user
from models.evaluation import EvaluationResult
from models.user import User, UserRole
from models.temp_credentials import TempUserCredential
from core.extensions import db
import logging
import random
import string

# Set up logging
logger = logging.getLogger(__name__)

api = Namespace('evaluation', description='Evaluation related operations')

@api.route('/result')
class EvaluationResultResource(Resource):
    def post(self):
        """Save evaluation result"""
        data = request.get_json()
        
        if not data:
            return {"error": "No data provided"}, 400
            
        # Extract required fields
        email = data.get('email')
        score = data.get('score')
        risk_level = data.get('riskLevel')
        form_data = data.get('formData')
        
        if not email or score is None or not risk_level or not form_data:
            return {"error": "Missing required fields"}, 400
            
        try:
            
            # Create new evaluation result
            evaluation_result = EvaluationResult(
                email=email,
                name=data.get('name'),
                phone=data.get('phone'),
                score=score,
                risk_level=risk_level,
                form_data=form_data
            )
            
            # Save to database
            db.session.add(evaluation_result)
            db.session.commit()
            
            return evaluation_result.to_dict(), 201
            
        except Exception as e:
            logger.error(f"Error saving evaluation result: {str(e)}")
            db.session.rollback()
            return {"error": f"Failed to save evaluation result: {str(e)}"}, 500
            
@api.route('/results')
class EvaluationResultsResource(Resource):
    @jwt_required()
    def get(self):
        """Get all evaluation results (admin only)"""
        # Get current user
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        # Check if user is admin
        if not user or user.role != 'admin':
            return {"error": "Unauthorized. Admin access required."}, 403
            
        # Get all evaluation results
        results = EvaluationResult.query.order_by(EvaluationResult.created_at.desc()).all()
        
        return [result.to_dict() for result in results], 200
        
@api.route('/results/user')
class UserEvaluationResultsResource(Resource):
    @jwt_required()
    def get(self):
        """Get evaluation results for the current user"""
        current_user_id = get_jwt_identity()
        
        # Get user's evaluation results by email instead of user_id since we removed that field
        user = User.query.get(current_user_id)
        if not user:
            return {"error": "User not found"}, 404
            
        results = EvaluationResult.query.filter_by(email=user.email).order_by(EvaluationResult.created_at.desc()).all()
        
        return [result.to_dict() for result in results], 200
        
@api.route('/create-user')
class CreateUserFromEvaluationResource(Resource):
    @jwt_required()
    def post(self):
        """Create a new user account from evaluation email (admin only)"""
        # Check if current user is admin
        current_user_id = get_jwt_identity()
        admin_user = User.query.get(current_user_id)
        
        if not admin_user or admin_user.role != UserRole.ADMIN:
            return {"error": "Unauthorized. Admin access required."}, 403
            
        data = request.get_json()
        if not data or 'email' not in data:
            return {"error": "Email is required"}, 400
            
        email = data['email']
        
        # Check if user already exists
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return {"error": "User with this email already exists"}, 400
            
        # Generate random username and password
        username = email.split('@')[0] + '_' + ''.join(random.choices(string.ascii_lowercase + string.digits, k=4))
        password = ''.join(random.choices(string.ascii_letters + string.digits + string.punctuation, k=12))
        
        try:
            # Create new user
            new_user = User(username=username, email=email, role=UserRole.USER)
            new_user.set_password(password)
            
            db.session.add(new_user)
            db.session.flush()  # Flush to get the user ID
            
            # Store credentials for admin
            temp_creds = TempUserCredential(
                user_id=new_user.id,
                email=email,
                username=username,
                password=password
            )
            
            db.session.add(temp_creds)
            db.session.commit()
            
            return {
                "message": "User created successfully",
                "user": new_user.to_dict(),
                "credentials": {
                    "username": username,
                    "password": password
                }
            }, 201
            
        except Exception as e:
            logger.error(f"Error creating user: {str(e)}")
            db.session.rollback()
            return {"error": f"Failed to create user: {str(e)}"}, 500
            
@api.route('/check-user')
class CheckUserExistsResource(Resource):
    @jwt_required()
    def get(self):
        """Check if a user exists with the given email (admin only)"""
        # Check if current user is admin
        current_user_id = get_jwt_identity()
        admin_user = User.query.get(current_user_id)
        
        if not admin_user or admin_user.role != UserRole.ADMIN:
            return {"error": "Unauthorized. Admin access required."}, 403
            
        email = request.args.get('email')
        if not email:
            return {"error": "Email parameter is required"}, 400
            
        # Check if user exists
        user = User.query.filter_by(email=email).first()
        
        return {"exists": user is not None}, 200

@api.route('/temp-credentials')
class TempCredentialsResource(Resource):
    @jwt_required()
    def get(self):
        """Get all temporary credentials (admin only)"""
        # Check if current user is admin
        current_user_id = get_jwt_identity()
        admin_user = User.query.get(current_user_id)
        
        if not admin_user or admin_user.role != UserRole.ADMIN:
            return {"error": "Unauthorized. Admin access required."}, 403
            
        # Get all temp credentials
        credentials = TempUserCredential.query.order_by(TempUserCredential.created_at.desc()).all()
        
        return [cred.to_dict() for cred in credentials], 200
        
    @jwt_required()
    def post(self):
        """Mark temporary credentials as used (admin only)"""
        # Check if current user is admin
        current_user_id = get_jwt_identity()
        admin_user = User.query.get(current_user_id)
        
        if not admin_user or admin_user.role != UserRole.ADMIN:
            return {"error": "Unauthorized. Admin access required."}, 403
            
        data = request.get_json()
        if not data or 'credential_id' not in data:
            return {"error": "Credential ID is required"}, 400
            
        credential_id = data['credential_id']
        
        try:
            # Find and update the credential
            credential = TempUserCredential.query.get(credential_id)
            if not credential:
                return {"error": "Credential not found"}, 404
                
            credential.is_used = True
            db.session.commit()
            
            return {"message": "Credential marked as used"}, 200
            
        except Exception as e:
            logger.error(f"Error updating credential: {str(e)}")
            db.session.rollback()
            return {"error": f"Failed to update credential: {str(e)}"}, 500
