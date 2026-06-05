from flask import Blueprint, jsonify, request
from app.models.victim import Victim
from app.extensions import db

bp = Blueprint('victims', __name__, url_prefix='/api/victims')

@bp.route('/', methods=['GET'])
def get_victims():
    victims = Victim.query.all()
    return jsonify([v.to_dict() for v in victims]), 200

@bp.route('/<id>', methods=['GET'])
def get_victim(id):
    victim = Victim.query.get_or_404(id)
    return jsonify(victim.to_dict()), 200

@bp.route('/', methods=['POST'])
def create_victim():
    data = request.json
    victim = Victim(**data)
    db.session.add(victim)
    db.session.commit()
    return jsonify(victim.to_dict()), 201
