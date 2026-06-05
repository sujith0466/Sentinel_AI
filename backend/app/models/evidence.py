import uuid
import json
from app.extensions import db

class Evidence(db.Model):
    __tablename__ = 'evidence'
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    case_id = db.Column(db.String(36), nullable=False)
    evidence_type = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text)
    file_url = db.Column(db.String(255))
    metadata_json = db.Column(db.Text)
    confidence_score = db.Column(db.Float, default=1.0)
    
    def to_dict(self):
        return {
            "id": self.id, "case_id": self.case_id, "evidence_type": self.evidence_type,
            "description": self.description, "file_url": self.file_url,
            "metadata": json.loads(self.metadata_json) if self.metadata_json else {},
            "confidence_score": self.confidence_score
        }
