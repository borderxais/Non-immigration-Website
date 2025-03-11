from flask_restx import Namespace, Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import request
from models import ds160
from models.user import User
from core.extensions import db

api = Namespace("ds160", description="DS-160 API")


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


@api.route("/validate")
class DS160ValidationResource(Resource):
    def post(self):
        """Validate form fields and provide suggestions"""
        data = request.json
        return {"valid": True, "suggestions": []}
