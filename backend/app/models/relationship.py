import uuid
from app.extensions import db

class Relationship(db.Model):
    __tablename__ = 'relationships'
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    entity_a_id = db.Column(db.String(36), nullable=False)
    entity_a_type = db.Column(db.String(20), nullable=False) 
    entity_b_id = db.Column(db.String(36), nullable=False)
    entity_b_type = db.Column(db.String(20), nullable=False) 
    relation = db.Column(db.String(50), nullable=False)
    
    def to_dict(self):
        return {
            "id": self.id, "entity_a_id": self.entity_a_id, "entity_a_type": self.entity_a_type,
            "entity_b_id": self.entity_b_id, "entity_b_type": self.entity_b_type, "relation": self.relation
        }
