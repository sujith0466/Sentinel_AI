import os
import json
from wsgi import app
from app.extensions import db
from app.models import Case, Criminal, Victim, Evidence, Relationship, User

def create_network_alpha():
    c1 = Criminal(name="Ravi Kumar", alias="Ravi Don", risk_score=95, modus_operandi="Smuggling electronics")
    c2 = Criminal(name="Sunil Gupta", alias="Sunny", risk_score=80, modus_operandi="Money laundering")
    v1 = Victim(name="Tech Store Owner", contact_info="9876543210", demographics=json.dumps({"age": 45}), vulnerability_score=30)
    case1 = Case(fir_number="FIR-2026-001", title="Indiranagar Electronics Heist", description="Large scale theft of electronics.", crime_type="Theft", district="East", police_station="Indiranagar", priority="High")
    
    db.session.add_all([c1, c2, v1, case1])
    db.session.flush()

    ev1 = Evidence(case_id=case1.id, evidence_type="CCTV", description="Footage of Ravi's van", confidence_score=0.9)
    rel1 = Relationship(entity_a_id=c1.id, entity_a_type='criminal', entity_b_id=case1.id, entity_b_type='case', relation='PRIMARY_SUSPECT')
    rel2 = Relationship(entity_a_id=c1.id, entity_a_type='criminal', entity_b_id=v1.id, entity_b_type='victim', relation='TARGETED')
    rel3 = Relationship(entity_a_id=c1.id, entity_a_type='criminal', entity_b_id=c2.id, entity_b_type='criminal', relation='ASSOCIATES_WITH')
    
    db.session.add_all([ev1, rel1, rel2, rel3])

def create_network_beta():
    c3 = Criminal(name="Vikram Singh", risk_score=88, modus_operandi="Extortion and threats")
    v2 = Victim(name="Restaurant Owner", demographics=json.dumps({"age": 50}), vulnerability_score=60)
    case2 = Case(fir_number="FIR-2026-002", title="Koramangala Extortion", crime_type="Extortion", district="South", police_station="Koramangala", priority="High")
    
    db.session.add_all([c3, v2, case2])
    db.session.flush()

    ev2 = Evidence(case_id=case2.id, evidence_type="Phone Record", description="Threatening calls recorded", confidence_score=0.95)
    rel1 = Relationship(entity_a_id=c3.id, entity_a_type='criminal', entity_b_id=case2.id, entity_b_type='case', relation='PRIMARY_SUSPECT')
    rel2 = Relationship(entity_a_id=c3.id, entity_a_type='criminal', entity_b_id=v2.id, entity_b_type='victim', relation='EXTORTED')
    
    db.session.add_all([ev2, rel1, rel2])

def create_network_gamma():
    c4 = Criminal(name="Arjun Reddy", risk_score=75, modus_operandi="Phishing scams")
    v3 = Victim(name="Elderly Resident", demographics=json.dumps({"age": 70}), vulnerability_score=90)
    case3 = Case(fir_number="FIR-2026-003", title="Cyber Fraud Ring", crime_type="Cybercrime", district="Central", police_station="Cubbon Park", priority="Medium")
    
    db.session.add_all([c4, v3, case3])
    db.session.flush()

    ev3 = Evidence(case_id=case3.id, evidence_type="Bank Transaction", description="Illegal transfers", confidence_score=0.99)
    rel1 = Relationship(entity_a_id=c4.id, entity_a_type='criminal', entity_b_id=case3.id, entity_b_type='case', relation='PRIMARY_SUSPECT')
    rel2 = Relationship(entity_a_id=c4.id, entity_a_type='criminal', entity_b_id=v3.id, entity_b_type='victim', relation='DEFRAUDED')
    
    db.session.add_all([ev3, rel1, rel2])

def seed_bulk():
    cases = [Case(fir_number=f"FIR-BULK-{i}", title=f"Case {i}", crime_type="Various", district="Various", police_station="Various") for i in range(47)]
    criminals = [Criminal(name=f"Criminal {i}", risk_score=50, modus_operandi="Unknown") for i in range(26)]
    victims = [Victim(name=f"Victim {i}", demographics=json.dumps({"age": 30})) for i in range(37)]
    
    db.session.add_all(cases + criminals + victims)
    db.session.flush()

    evidence = [Evidence(case_id=cases[i].id, evidence_type="Document", description=f"Doc {i}") for i in range(47)]
    db.session.add_all(evidence)
    
    relationships = []
    for i in range(93):
        relationships.append(Relationship(entity_a_id=criminals[i%26].id, entity_a_type='criminal', entity_b_id=cases[i%47].id, entity_b_type='case', relation='INVOLVED_IN'))
    
    db.session.add_all(relationships)

from seed_governance import seed_audit_logs

with app.app_context():
    db.drop_all()
    db.create_all()
    create_network_alpha()
    create_network_beta()
    create_network_gamma()
    seed_bulk()
    seed_audit_logs()
    db.session.commit()
    print("Database seeded successfully with interconnected networks and governance logs.")
