import uuid
import json
from app.extensions import db

class Victim(db.Model):
    __tablename__ = 'victims'
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(100), nullable=False)
    contact_info = db.Column(db.String(100))
    demographics = db.Column(db.Text) 
    vulnerability_score = db.Column(db.Integer, default=0)
    
    def to_dict(self):
        return {
            "id": self.id, "name": self.name, "contact_info": self.contact_info,
            "demographics": json.loads(self.demographics) if self.demographics else {},
            "vulnerability_score": self.vulnerability_score
        }
