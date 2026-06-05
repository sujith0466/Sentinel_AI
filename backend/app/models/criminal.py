import uuid
from app.extensions import db

class Criminal(db.Model):
    __tablename__ = 'criminals'
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(100), nullable=False)
    alias = db.Column(db.String(100))
    dob = db.Column(db.Date)
    last_known_location = db.Column(db.String(255))
    risk_score = db.Column(db.Integer, default=0)
    modus_operandi = db.Column(db.Text)
    risk_history_json = db.Column(db.Text) # To store risk trend points

    def to_dict(self):
        return {
            "id": self.id, "name": self.name, "alias": self.alias,
            "dob": self.dob.isoformat() if self.dob else None,
            "last_known_location": self.last_known_location,
            "risk_score": self.risk_score, "modus_operandi": self.modus_operandi,
            "risk_history": self.risk_history_json
        }
