import uuid
import json
from datetime import datetime
from app.extensions import db

class AuditLog(db.Model):
    __tablename__ = 'audit_logs'
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(50), nullable=False)
    action = db.Column(db.String(100), nullable=False)
    module = db.Column(db.String(100), nullable=False)
    entity_type = db.Column(db.String(50))
    entity_id = db.Column(db.String(100))
    metadata_json = db.Column(db.Text)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id, "user_id": self.user_id, "role": self.role,
            "action": self.action, "module": self.module,
            "entity_type": self.entity_type, "entity_id": self.entity_id,
            "metadata": json.loads(self.metadata_json) if self.metadata_json else {},
            "timestamp": self.timestamp.isoformat() if self.timestamp else None
        }
