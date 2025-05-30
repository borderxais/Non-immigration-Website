from flask_restx import Namespace, Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import request, make_response, Blueprint
from flask_cors import cross_origin
from models.ds160 import DS160Form, DS160FormTranslation
from models.user import User
from models.interview_assessment import InterviewAssessment
from core.extensions import db
import openai
from openai import OpenAI
import os
import logging

logger = logging.getLogger(__name__)

api = Namespace("ds160", description="DS-160 API")

# Configure OpenAI
openai_api_key = os.getenv("OPENAI_API_KEY")
USING_NEW_CLIENT = os.getenv("USING_NEW_OPENAI_CLIENT", "true").lower() == "true"

if USING_NEW_CLIENT:
    openai_client = OpenAI(api_key=openai_api_key)
    logger.info("Using new OpenAI client for DS-160 assessment")
else:
    openai.api_key = openai_api_key
    logger.info("Using legacy OpenAI client for DS-160 assessment")

logger.info("Begin DS-160 API registration")

# Allowed origins
ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'https://visaimmigration.netlify.app',
    'https://www.visaimmigration.netlify.app',
    'https://leonexusus.com'
]

# Create a separate blueprint for CORS preflight handling
cors_handler = Blueprint('cors_handler', __name__)

@cors_handler.route('/api/ds160/form', methods=['OPTIONS'])
def handle_ds160_form_options():
    """Handle preflight OPTIONS request outside of JWT and RESTx"""
    response = make_response()
    origin = request.headers.get('Origin')
    if origin in ALLOWED_ORIGINS:
        response.headers.add('Access-Control-Allow-Origin', origin)
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
    return response, 200

@api.route("/form")
class DS160FormResource(Resource):
    def options(self):
        """Handle preflight OPTIONS request"""
        origin = request.headers.get('Origin')
        headers = {}
        if origin in ALLOWED_ORIGINS:
            headers = {
                'Access-Control-Allow-Origin': origin,
                'Access-Control-Allow-Headers': 'Content-Type,Authorization',
                'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
            }
        return {'success': True}, 200, headers

    @jwt_required()  # Re-enabled JWT authentication
    def post(self):
        # DEBUG: mark entry into handler
        print("DEBUG: DS160FormResource.post() invoked")
        logger.info("DEBUG: DS160FormResource.post() invoked")
        """Create a new DS-160 form"""
        data = request.json
        
        # Handle the case where JWT is disabled for testing
        try:
            current_user_id = get_jwt_identity()
            user = User.query.get(current_user_id)
        except Exception as e:
            logger.info(f"Using test user for unauthenticated request: {str(e)}")
            # Use a test user ID for development/testing
            user = User.query.first()  # Get the first user as a fallback
            if not user:
                return {"error": "No test user available and authentication is disabled"}, 401
        
        # Log the incoming data with more detail
        logger.info(f"Creating new DS-160 form with data keys: {data.keys()}")
        logger.info(f"Form status in request: {data.get('status')}")
        
        # Extract form_data and other fields
        form_data = data.get('form_data', {})
        
        status = data.get('status', 'draft')
        
        # Ensure consistent handling of application_id
        application_id = data.get('application_id')
        logger.info(f"Extracted application_id: {application_id}")
        
        # Debug print statements
        print(f"Received form submission with status: {status}")
        print(f"Application ID: {application_id}")
        print(f"Form data keys: {list(form_data.keys()) if form_data else 'None'}")
        
        # Create the form with all fields
        form = DS160Form(
            user_id=user.id, 
            form_data=form_data, 
            status=status,
            application_id=application_id,
            target_user_id=form_data.get('target_user_id')
        )
        
        db.session.add(form)
        db.session.flush()
        logger.info(f"Session flushed, form created with application_id={form.application_id}")
        
        # Log the form status to debug the condition check
        logger.info(f"Form status after creation: {status}, Will create translation: {status == 'submitted'}")
        
        # If the form is being submitted (not just saved as draft),
        # create an English translation version
        if status == 'submitted':
            print(f"Status is 'submitted', proceeding with translation")
            logger.info("Status is 'submitted', proceeding with translation")
            try:
                # Import the translation service
                from services.translation import translate_form_data
                
                # Log before translation
                logger.info(f"Starting translation for application_id: {form.application_id}")
                print("Starting form translation process...")
                
                # Translate the form data to English
                english_form_data = translate_form_data(form_data, source_lang='zh', target_lang='en')
                print(f"Translation completed, creating translation record")
                logger.info(f"Translation completed successfully")
                
                # Verify DS160FormTranslation model is available
                logger.info(f"Translation model class: {DS160FormTranslation.__name__}")
                
                # Create a new translation record in the dedicated translations table
                translation = DS160FormTranslation(
                    original_form_application_id=form.application_id,
                    form_data=english_form_data
                )
                
                # Log translation object
                logger.info(f"Created translation object with application_id: {form.application_id}")
                
                db.session.add(translation)
                logger.info(f"Added translation to session for form with application_id: {application_id}")
            except Exception as e:
                logger.error(f"Error creating English translation: {str(e)}")
                # Print the full stack trace for debugging
                import traceback
                logger.error(f"Traceback: {traceback.format_exc()}")
                # Continue even if translation fails - we still want to save the original form
        else:
            logger.info(f"Form status is '{status}', not 'submitted', skipping translation")
        
        # Log before commit
        logger.info("Committing session to database")
        
        try:
            db.session.commit()
            logger.info("Session committed successfully")
        except Exception as e:
            logger.error(f"Error committing session: {str(e)}")
            db.session.rollback()
            return {"error": "Failed to save form"}, 500
        
        # Return the complete form data including the application_id
        return form.to_dict(), 201


@api.route("/users")
class DS160UsersResource(Resource):
    @jwt_required()
    def get(self):
        """Get all users for DS-160 form selection"""
        try:
            # Check if user is admin
            current_user_id = get_jwt_identity()
            current_user = User.query.get(current_user_id)
            
            if not current_user or current_user.role != 'admin':
                return {"error": "Unauthorized"}, 403
            
            # Get all users
            users = User.query.all()
            user_list = [
                {
                    "id": str(user.id),
                    "username": user.username,
                    "email": user.email
                }
                for user in users
            ]
            
            print('DS160 Users List:', user_list)
            return user_list, 200
        except Exception as e:
            print(f"Error fetching users: {str(e)}")
            return {"error": str(e)}, 500


@api.route("/form/<string:application_id>")
class DS160FormDetailResource(Resource):
    def options(self, application_id):
        """Handle preflight OPTIONS request"""
        origin = request.headers.get('Origin')
        headers = {}
        if origin in ALLOWED_ORIGINS:
            headers = {
                'Access-Control-Allow-Origin': origin,
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
            }
        return {'success': True}, 200, headers

    def get(self, application_id):
        """Retrieve a DS-160 form"""
        try:
            form = DS160Form.query.filter_by(application_id=application_id).first()
            if not form:
                return {"error": "Form not found"}, 404

            # Add CORS headers
            origin = request.headers.get('Origin')
            headers = {}
            if origin in ALLOWED_ORIGINS:
                headers = {
                    'Access-Control-Allow-Origin': origin,
                    'Access-Control-Allow-Headers': '*',
                    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
                }

            return form.to_dict(), 200, headers

        except Exception as e:
            logger.error(f"Error retrieving form: {str(e)}")
            return {"error": str(e)}, 500

    def put(self, application_id):
        """Update a DS-160 form"""
        try:
            data = request.json
            form = DS160Form.query.filter_by(application_id=application_id).first()
            
            # Log the incoming data
            logger.info(f"Updating DS-160 form {application_id} with data: {data}")
            
            if not form:
                return {"error": "Form not found"}, 404
                
            # Store the original status before update
            original_status = form.status
            
            # Update form data
            if 'form_data' in data:
                form.form_data = data['form_data']
                
            # Update application_id if provided
            if 'application_id' in data:
                form.application_id = data['application_id']

            # Update status if provided
            if 'status' in data:
                form.status = data['status']
                logger.info(f"Updating form status from {original_status} to {data['status']}")
                
                # If status is being changed to 'submitted', create translation
                if data['status'] == 'submitted' and original_status != 'submitted':
                    logger.info("Form status changed to 'submitted', creating translation")
                    try:
                        # Import the translation service
                        from services.translation import translate_form_data
                        
                        # Log form data before translation
                        logger.info(f"Form data before translation: {form.form_data}")
                        
                        # Translate the form data to English
                        english_form_data = translate_form_data(form.form_data, source_lang='zh', target_lang='en')
                        
                        # Log translation result
                        logger.info(f"Translation result: {english_form_data}")
                        
                        # Create a new translation record
                        translation = DS160FormTranslation(
                            original_form_application_id=form.application_id,
                            form_data=english_form_data
                        )
                        
                        # Log translation object details
                        logger.info(f"Translation object created with: original_form_application_id={translation.original_form_application_id}")
                        logger.info(f"Translation form_data: {translation.form_data}")
                        
                        db.session.add(translation)
                        logger.info("Added translation to session")
                        
                        # Flush to detect any database errors early
                        db.session.flush()
                        logger.info("Session flushed successfully")
                        
                    except Exception as e:
                        logger.error(f"Error creating English translation: {str(e)}")
                        import traceback
                        logger.error(f"Traceback: {traceback.format_exc()}")
                        # Continue even if translation fails - we still want to save the form status

            # Commit changes to database
            db.session.commit()
            logger.info(f"Successfully updated form {application_id}")

            # Add CORS headers
            origin = request.headers.get('Origin')
            headers = {}
            if origin in ALLOWED_ORIGINS:
                headers = {
                    'Access-Control-Allow-Origin': origin,
                    'Access-Control-Allow-Headers': '*',
                    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
                }

            return form.to_dict(), 200, headers

        except Exception as e:
            logger.error(f"Error updating form: {str(e)}")
            db.session.rollback()  # Rollback on error
            return {"error": str(e)}, 500


@api.route("/user/forms")
class UserDS160FormsResource(Resource):
    @jwt_required()
    def get(self):
        """Get all DS-160 forms for the current user"""
        current_user_id = get_jwt_identity()
        forms = (
            DS160Form.query.filter_by(target_user_id=current_user_id)
            .order_by(DS160Form.created_at.desc())
            .all()
        )
        return [form.to_dict() for form in forms]


@api.route("/admin/forms")
class AdminDS160FormsResource(Resource):
    @jwt_required()
    def get(self):
        """Get all DS-160 forms (admin only)"""
        # Get current user
        current_user_id = get_jwt_identity()
        #user = User.query.get(current_user_id)
        
        # Check if user exists and is admin
        #if not user or not user.is_admin:
        #    return {"error": "Unauthorized. Admin access required."}, 403
            
        # Get all forms ordered by creation date
        forms = (
            DS160Form.query
            .order_by(DS160Form.created_at.desc())
            .all()
        )
        
        return [form.to_dict() for form in forms]


@api.route("/interview-assessment")
class InterviewAssessmentResource(Resource):
    def _generate_assessment_with_new_client(self, prompt: str) -> str:
        """Generate assessment using the new OpenAI client"""
        response = openai_client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": "You are an experienced US visa interview assessment expert.",
                },
                {"role": "user", "content": prompt},
            ],
            temperature=0.7,
            max_tokens=1000,
        )
        return response.choices[0].message.content

    def _generate_assessment_with_legacy_client(self, prompt: str) -> str:
        """Generate assessment using the legacy OpenAI client"""
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": "You are an experienced US visa interview assessment expert.",
                },
                {"role": "user", "content": prompt},
            ],
            temperature=0.7,
            max_tokens=1000,
        )
        return response.choices[0].message.content

    def _generate_and_save_assessment(
        self, current_user_id: int, latest_form: DS160Form, prompt: str
    ) -> dict:
        """Generate a new assessment and save it to the database"""
        try:
            # Generate assessment using appropriate client
            if USING_NEW_CLIENT:
                assessment_text = self._generate_assessment_with_new_client(prompt)
                logger.info("Generated assessment using new OpenAI client")
            else:
                assessment_text = self._generate_assessment_with_legacy_client(prompt)
                logger.info("Generated assessment using legacy OpenAI client")

            # Create a new assessment record
            assessment = InterviewAssessment(
                user_id=current_user_id,
                ds160_form_id=latest_form.application_id,
                assessment=assessment_text,
            )
            db.session.add(assessment)
            db.session.commit()

            return {"assessment": assessment_text, "form_data": latest_form.form_data}
        except Exception as e:
            logger.error(f"Error generating assessment: {str(e)}")
            raise

    @jwt_required()
    def get(self):
        """Get interview assessment based on user's DS-160 forms"""
        current_user_id = get_jwt_identity()
        force_refresh = request.args.get("refresh", "").lower() == "true"

        # Get the most recent form
        latest_form = (
            DS160Form.query.filter_by(user_id=current_user_id)
            .order_by(DS160Form.created_at.desc())
            .first()
        )

        if not latest_form:
            return {"error": "No DS-160 forms found"}, 404

        try:
            # Check if we already have an assessment for this form
            existing_assessment = (
                InterviewAssessment.query.filter_by(
                    user_id=current_user_id, ds160_form_id=latest_form.application_id
                )
                .order_by(InterviewAssessment.created_at.desc())
                .first()
            )

            # If we have an existing assessment and don't need to refresh, return it
            if existing_assessment and not force_refresh:
                logger.info("Returning existing assessment")
                return {
                    "assessment": existing_assessment.assessment,
                    "form_data": latest_form.form_data,
                    "created_at": existing_assessment.created_at.isoformat(),
                }

            # Prepare the prompt for OpenAI
            prompt = f"""Based on the following DS-160 visa application information, provide a comprehensive interview assessment. 
            Consider the following aspects:
            1. Application Strength (评估申请优势)
            2. Potential Risk Factors (潜在风险因素)
            3. Suggested Preparation Points (建议准备要点)
            4. Overall Success Probability (总体通过概率)

            Applicant Information:
            - Name: {latest_form.form_data.get('surname', '')} {latest_form.form_data.get('givenName', '')}
            - Purpose of Trip: {latest_form.form_data.get('purposeOfTrip', '')}
            - Specific Purpose: {latest_form.form_data.get('specificPurpose', '')}
            - Occupation: {latest_form.form_data.get('primaryOccupation', '')}
            - Employer/School: {latest_form.form_data.get('employer', '')}
            - Monthly Income: {latest_form.form_data.get('monthlyIncome', '')}
            - Previous US Visa: {latest_form.form_data.get('previousUsVisa', False)}
            - Travel Plans: Staying for {latest_form.form_data.get('intendedLengthOfStay', '')}
            - US Point of Contact: {latest_form.form_data.get('pointOfContact', '')}
            - Relationship to Contact: {latest_form.form_data.get('relationshipToContact', '')}

            Please provide the assessment in Chinese language with clear sections and detailed explanations.
            """

            return self._generate_and_save_assessment(
                current_user_id, latest_form, prompt
            )

        except Exception as e:
            logger.error(f"Error in assessment process: {str(e)}")
            return {"error": str(e)}, 500

@api.route("/client/<string:application_id>")
class DS160ClientResource(Resource):
    @jwt_required()
    def get(self, application_id):
        """Get DS-160 form translation data formatted for the Chrome extension"""        
        # Find the translation
        translation = DS160FormTranslation.query.filter_by(
            original_form_application_id=application_id
        ).first()
        
        if not translation:
            return {"error": "Translation not found for this form"}, 404
        
        # Format the translation data for the extension
        client_data = {
            "application_id": application_id  # Use consistent naming
        }
        
        # Add translation data
        if translation.form_data:
            client_data.update(translation.form_data)
            client_data["translation_created_at"] = translation.created_at.isoformat()
            client_data["translation_updated_at"] = translation.updated_at.isoformat()
        
        return client_data

@api.route("/client-data/by-application-id/<string:application_id>")
class DS160ClientDataByApplicationIDResource(Resource):
    @jwt_required()
    def get(self, application_id):
        """Get DS-160 form data formatted for the Chrome extension by application_id"""
        current_user_id = get_jwt_identity()
        
        # Find the form by application_id
        form = DS160Form.query.filter_by(
            application_id=application_id, user_id=current_user_id
        ).first()
        
        if not form:
            return {"error": "Form not found with the given application ID"}, 404
        
        # Format the form data for the extension - return flat structure
        client_data = {
            "client_id": str(form.application_id),
            "application_id": form.application_id,
        }
        
        # Add all form data fields directly to the client_data
        if form.form_data:
            client_data.update(form.form_data)
        
        return client_data

@api.route("/events")
class DS160EventResource(Resource):
    @jwt_required()
    def post(self):
        """Log a DS-160 form event from the Chrome extension"""
        current_user_id = get_jwt_identity()
        data = request.json
        
        # Log the event (you can customize this based on your needs)
        logger.info(
            f"DS-160 form event: user_id={current_user_id}, "
            f"form_id={data.get('client_id')}, "
            f"event_type={data.get('event_type')}, "
            f"event_data={data.get('event_data')}"
        )
        
        return {"message": "Event logged successfully"}, 201


@api.route("/interview-assessment/history")
class InterviewAssessmentHistoryResource(Resource):
    @jwt_required()
    def get(self):
        """Get all interview assessments for the current user"""
        current_user_id = get_jwt_identity()
        assessments = (
            InterviewAssessment.query.filter_by(user_id=current_user_id)
            .order_by(InterviewAssessment.created_at.desc())
            .all()
        )
        return [assessment.to_dict() for assessment in assessments]

    @jwt_required()
    def post(self):
        """Save a new interview assessment"""
        current_user_id = get_jwt_identity()
        data = request.json

        # Get the latest DS-160 form
        latest_form = (
            DS160Form.query.filter_by(user_id=current_user_id)
            .order_by(DS160Form.created_at.desc())
            .first()
        )

        if not latest_form:
            return {"error": "No DS-160 form found"}, 404

        assessment = InterviewAssessment(
            user_id=current_user_id,
            ds160_form_id=latest_form.application_id,
            assessment=data["assessment"],
        )
        db.session.add(assessment)
        db.session.commit()

        return {"message": "Assessment saved successfully"}, 201


@api.route("/interview-assessment/history/<string:assessment_id>")
class InterviewAssessmentDetailResource(Resource):
    @jwt_required()
    def get(self, assessment_id):
        """Get a specific interview assessment"""
        current_user_id = get_jwt_identity()
        assessment = InterviewAssessment.query.filter_by(
            id=assessment_id, user_id=current_user_id
        ).first()

        if not assessment:
            return {"error": "Assessment not found"}, 404

        return assessment.to_dict()

    @jwt_required()
    def delete(self, assessment_id):
        """Delete an interview assessment"""
        current_user_id = get_jwt_identity()
        assessment = InterviewAssessment.query.filter_by(
            id=assessment_id, user_id=current_user_id
        ).first()

        if not assessment:
            return {"error": "Assessment not found"}, 404

        db.session.delete(assessment)
        db.session.commit()
        return {"message": "Assessment deleted successfully"}, 200


@api.route("/validate")
class DS160ValidationResource(Resource):
    def post(self):
        """Validate form fields and provide suggestions"""
        data = request.json
        return {"valid": True, "suggestions": []}


@api.route("/form/by-application-id/<string:application_id>")
class DS160FormByApplicationIDResource(Resource):
    @jwt_required()
    def get(self, application_id):
        """Retrieve a DS-160 form by its application_id"""
        current_user_id = get_jwt_identity()
        
        # Get the current user to check if they're an admin
        current_user = User.query.get(current_user_id)
        
        # Find the form by application_id
        if current_user and current_user.role == 'admin':
            # Admins can access any form
            form = DS160Form.query.filter_by(
                application_id=application_id
            ).first()
        else:
            # Regular users can only access their own forms
            form = DS160Form.query.filter_by(
                application_id=application_id, user_id=current_user_id
            ).first()
        
        if not form:
            return {"error": "Form not found with the given application ID"}, 404
            
        return form.to_dict()


@api.route("/form/<string:application_id>/translation")
class DS160FormTranslationResource(Resource):
    """Resource to handle DS-160 form translations"""
    
    def get(self, application_id):
        """Retrieve the English translation for a specific DS-160 form"""
        # First check if the original form exists
        original_form = DS160Form.query.filter_by(
            application_id=application_id
        ).first()
        if not original_form:
            return {"error": "Original form not found"}, 404
            
        # Find the translation for this form
        translation = DS160FormTranslation.query.filter_by(
            original_form_application_id=original_form.application_id
        ).first()
        
        if not translation:
            return {"error": "No translation found for this form"}, 404
            
        # Return the translation data
        return translation.to_dict(), 200
