import uuid
import json
from datetime import datetime
from app.extensions import db

class IntelligenceBrief(db.Model):
    __tablename__ = 'intelligence_briefs'
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    case_id = db.Column(db.String(36), nullable=False)
    generated_by = db.Column(db.String(36), nullable=False)
    title = db.Column(db.String(255))
    content_markdown = db.Column(db.Text)
    audit_trail_json = db.Column(db.Text) 
    severity = db.Column(db.String(20), default='Medium')
    confidence_score = db.Column(db.Float, default=1.0)
    file_url = db.Column(db.String(255))
    status = db.Column(db.String(20), default='completed')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            "id": self.id, "case_id": self.case_id, "generated_by": self.generated_by,
            "title": self.title, "content_markdown": self.content_markdown,
            "audit_trail": json.loads(self.audit_trail_json) if self.audit_trail_json else {},
            "severity": self.severity, "confidence_score": self.confidence_score,
            "status": self.status, "created_at": self.created_at.isoformat() if self.created_at else None
        }
