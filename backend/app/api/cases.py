from flask import Blueprint, jsonify, request
from app.models.case import Case
from app.extensions import db

bp = Blueprint('cases', __name__, url_prefix='/api/cases')

@bp.route('/', methods=['GET'])
def get_cases():
    cases = Case.query.all()
    return jsonify([c.to_dict() for c in cases]), 200

@bp.route('/<id>', methods=['GET'])
def get_case(id):
    case = Case.query.get_or_404(id)
    return jsonify(case.to_dict()), 200

@bp.route('/', methods=['POST'])
def create_case():
    data = request.json
    case = Case(**data)
    db.session.add(case)
    db.session.commit()
    return jsonify(case.to_dict()), 201
