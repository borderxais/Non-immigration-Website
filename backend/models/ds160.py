from core.extensions import db
from datetime import datetime

class DS160Form(db.Model):
    __tablename__ = 'ds160_forms'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    status = db.Column(db.String(20), default='draft')
    form_data = db.Column(db.JSON)
    application_id = db.Column(db.String(50), nullable=True)  # Official DS-160 application ID
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'status': self.status,
            'form_data': self.form_data,
            'application_id': self.application_id,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }


class DS160FormTranslation(db.Model):
    """
    Stores English translations of DS-160 forms in a separate table.
    """
    __tablename__ = 'ds160_form_translations'

    id = db.Column(db.Integer, primary_key=True)
    original_form_id = db.Column(db.Integer, db.ForeignKey('ds160_forms.id'), nullable=False)
    form_data = db.Column(db.JSON)  # The translated form data
    application_id = db.Column(db.String(50), nullable=True)  # Same as the original form
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship to the original form
    original_form = db.relationship('DS160Form', backref=db.backref('translations', lazy=True))
    
    def to_dict(self):
        return {
            'id': self.id,
            'original_form_id': self.original_form_id,
            'form_data': self.form_data,
            'application_id': self.application_id,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
