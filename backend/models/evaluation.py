from datetime import datetime
from core.extensions import db

class EvaluationResult(db.Model):
    __tablename__ = 'evaluation_results'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), nullable=False)
    name = db.Column(db.String(255), nullable=True)
    phone = db.Column(db.String(50), nullable=True)
    score = db.Column(db.Integer, nullable=False)
    risk_level = db.Column(db.String(50), nullable=False)
    form_data = db.Column(db.JSON, nullable=False)  # Store all form inputs
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'name': self.name,
            'phone': self.phone,
            'score': self.score,
            'risk_level': self.risk_level,
            'form_data': self.form_data,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
