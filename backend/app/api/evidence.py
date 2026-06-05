from flask import Blueprint, jsonify, request
from app.models.evidence import Evidence
from app.extensions import db

bp = Blueprint('evidence', __name__, url_prefix='/api/evidence')

@bp.route('/', methods=['GET'])
def get_evidence():
    evidence = Evidence.query.all()
    return jsonify([e.to_dict() for e in evidence]), 200

@bp.route('/', methods=['POST'])
def create_evidence():
    data = request.json
    evidence = Evidence(**data)
    db.session.add(evidence)
    db.session.commit()
    return jsonify(evidence.to_dict()), 201
