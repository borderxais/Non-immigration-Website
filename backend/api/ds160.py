from flask_restx import Namespace, Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import request
from models import ds160
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


@api.route("/form")
class DS160FormResource(Resource):
    @jwt_required()
    def post(self):
        """Create a new DS-160 form"""
        data = request.json
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        form = ds160.DS160Form(user_id=user.id, form_data=data, status="submitted")
        db.session.add(form)
        db.session.commit()
        return {"message": "Form created successfully"}, 201


@api.route("/form/<string:form_id>")
class DS160FormDetailResource(Resource):
    def get(self, form_id):
        """Retrieve a DS-160 form"""
        form = ds160.DS160Form.query.get(form_id)
        if not form:
            return {"error": "Form not found"}, 404
        return form.to_dict()

    def put(self, form_id):
        """Update a DS-160 form"""
        data = request.json
        return {"message": f"Form {form_id} updated successfully"}, 200


@api.route("/user/forms")
class UserDS160FormsResource(Resource):
    @jwt_required()
    def get(self):
        """Get all DS-160 forms for the current user"""
        current_user_id = get_jwt_identity()
        forms = (
            ds160.DS160Form.query.filter_by(user_id=current_user_id)
            .order_by(ds160.DS160Form.created_at.desc())
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
        self, current_user_id: int, latest_form: ds160.DS160Form, prompt: str
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
                ds160_form_id=latest_form.id,
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
            ds160.DS160Form.query.filter_by(user_id=current_user_id)
            .order_by(ds160.DS160Form.created_at.desc())
            .first()
        )

        if not latest_form:
            return {"error": "No DS-160 forms found"}, 404

        try:
            # Check if we already have an assessment for this form
            existing_assessment = (
                InterviewAssessment.query.filter_by(
                    user_id=current_user_id, ds160_form_id=latest_form.id
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
            ds160.DS160Form.query.filter_by(user_id=current_user_id)
            .order_by(ds160.DS160Form.created_at.desc())
            .first()
        )

        if not latest_form:
            return {"error": "No DS-160 form found"}, 404

        assessment = InterviewAssessment(
            user_id=current_user_id,
            ds160_form_id=latest_form.id,
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
