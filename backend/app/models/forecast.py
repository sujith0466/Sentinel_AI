import uuid
from datetime import datetime
from app.extensions import db

class ForecastSnapshot(db.Model):
    __tablename__ = 'forecast_snapshots'
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    entity_type = db.Column(db.String(50), nullable=False) # 'district', 'crime_type'
    entity_id = db.Column(db.String(100), nullable=False)
    prediction = db.Column(db.String(255), nullable=False)
    category = db.Column(db.String(50), nullable=False) # Stable, Watchlist, Elevated, Critical
    confidence = db.Column(db.Float, nullable=False)
    reason = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id, "entity_type": self.entity_type, "entity_id": self.entity_id,
            "prediction": self.prediction, "category": self.category,
            "confidence": self.confidence, "reason": self.reason,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
