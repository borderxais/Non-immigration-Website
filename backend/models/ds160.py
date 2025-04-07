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
