import uuid
from datetime import datetime
from app.extensions import db

class HotspotSnapshot(db.Model):
    __tablename__ = 'hotspot_snapshots'
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    district = db.Column(db.String(100), nullable=False)
    score = db.Column(db.Float, nullable=False)
    level = db.Column(db.String(20), nullable=False)
    case_count = db.Column(db.Integer, default=0)
    metrics_json = db.Column(db.Text) # Storing arbitrary metrics for forecasting
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id, "district": self.district, "score": self.score,
            "level": self.level, "case_count": self.case_count,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
