from core.extensions import db
from datetime import datetime


class InterviewAssessment(db.Model):
    __tablename__ = "interview_assessments"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    ds160_form_id = db.Column(
        db.Integer, db.ForeignKey("ds160_forms.id"), nullable=False
    )
    assessment = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    user = db.relationship("User", backref="interview_assessments")
    ds160_form = db.relationship("DS160Form", backref="interview_assessments")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "ds160_form_id": self.ds160_form_id,
            "assessment": self.assessment,
            "created_at": self.created_at.isoformat(),
            "form_data": self.ds160_form.form_data if self.ds160_form else None,
        }
