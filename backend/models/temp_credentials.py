from core.extensions import db
from datetime import datetime

class TempUserCredential(db.Model):
    __tablename__ = 'temp_user_credentials'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    username = db.Column(db.String(50), nullable=False)
    password = db.Column(db.String(50), nullable=False)  # Store in plain text for admin to provide to user
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_used = db.Column(db.Boolean, default=False)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'email': self.email,
            'username': self.username,
            'password': self.password,
            'created_at': self.created_at.isoformat(),
            'is_used': self.is_used
        }
