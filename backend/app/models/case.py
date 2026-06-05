import uuid
from datetime import datetime
from app.extensions import db

class Case(db.Model):
    __tablename__ = 'cases'
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    fir_number = db.Column(db.String(50), unique=True, nullable=False)
    title = db.Column(db.String(200))
    description = db.Column(db.Text)
    status = db.Column(db.String(20), default='Open')
    lat = db.Column(db.Float, nullable=True)
    lng = db.Column(db.Float, nullable=True)
    date_logged = db.Column(db.DateTime, default=datetime.utcnow)
    
    crime_type = db.Column(db.String(100))
    district = db.Column(db.String(100))
    police_station = db.Column(db.String(100))
    priority = db.Column(db.String(20), default='Medium')
    
    def to_dict(self):
        return {
            "id": self.id, "fir_number": self.fir_number, "title": self.title,
            "description": self.description, "status": self.status,
            "lat": self.lat, "lng": self.lng, "date_logged": self.date_logged.isoformat() if self.date_logged else None,
            "crime_type": self.crime_type, "district": self.district,
            "police_station": self.police_station, "priority": self.priority
        }
