from flask import Blueprint, request, jsonify
from services.ai import AIService

consultation_bp = Blueprint('consultation', __name__)
ai_service = AIService()

@consultation_bp.route('/ask', methods=['POST'])
async def ask_question():
    """Handle AI consultation questions"""
    data = request.json
    question = data.get('question')
    response = await ai_service.get_response(question)
    return jsonify(response)

@consultation_bp.route('/evaluate', methods=['POST'])
def evaluate():
    """Evaluate visa application and estimate success rate"""
    data = request.json
    result = ai_service.evaluate_application(data)
    return jsonify(result)

@consultation_bp.route('/interview/simulate', methods=['POST'])
def simulate_interview():
    """Generate mock interview questions"""
    data = request.json
    visa_type = data.get('visa_type')
    questions = ai_service.generate_interview_questions(visa_type)
    return jsonify({
        'questions': questions,
        'tips': []
    })
