from flask_restx import Namespace, Resource
from flask import request, jsonify
from services.ai import AIService
import asyncio

api = Namespace("consultation", description="AI Consultation API")
ai_service = AIService()


@api.route("/ask")
class AskQuestionResource(Resource):
    def post(self):
        """Handle AI consultation questions"""
        data = request.json
        question = data.get("question")
        response = asyncio.run(ai_service.get_response(question))  # Fix async issue
        return jsonify(response)


@api.route("/evaluate")
class EvaluateResource(Resource):
    def post(self):
        """Evaluate visa application and estimate success rate"""
        data = request.json
        result = ai_service.evaluate_application(data)
        return jsonify(result)


@api.route("/interview/simulate")
class SimulateInterviewResource(Resource):
    def post(self):
        """Generate mock interview questions"""
        data = request.json
        visa_type = data.get("visa_type")
        questions = ai_service.generate_interview_questions(visa_type)
        return jsonify({"questions": questions, "tips": []})
