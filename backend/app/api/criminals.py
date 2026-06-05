from flask import Blueprint, jsonify, request
from app.models.criminal import Criminal
from app.extensions import db

bp = Blueprint('criminals', __name__, url_prefix='/api/criminals')

@bp.route('/', methods=['GET'])
def get_criminals():
    criminals = Criminal.query.all()
    return jsonify([c.to_dict() for c in criminals]), 200

@bp.route('/<id>', methods=['GET'])
def get_criminal(id):
    criminal = Criminal.query.get_or_404(id)
    return jsonify(criminal.to_dict()), 200

@bp.route('/', methods=['POST'])
def create_criminal():
    data = request.json
    criminal = Criminal(**data)
    db.session.add(criminal)
    db.session.commit()
    return jsonify(criminal.to_dict()), 201
