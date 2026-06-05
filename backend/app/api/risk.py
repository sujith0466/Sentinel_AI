from flask import Blueprint, jsonify
from app.services.risk import RiskEngineService
from app.models import Criminal

bp = Blueprint('risk', __name__, url_prefix='/api/risk')

@bp.route('/dashboard', methods=['GET'])
def dashboard():
    service = RiskEngineService()
    dist = service.get_dashboard_metrics()
    return jsonify({"distribution": dist}), 200

@bp.route('/top', methods=['GET'])
def get_top():
    service = RiskEngineService()
    # Recalculate top 20 lazily
    criminals = Criminal.query.limit(20).all()
    results = []
    for c in criminals:
        res = service.calculate_entity_risk(c.id)
        if res: results.append(res)
        
    results.sort(key=lambda x: x['score'], reverse=True)
    return jsonify(results[:10]), 200

@bp.route('/entity/<id>', methods=['GET'])
def get_entity_risk(id):
    service = RiskEngineService()
    res = service.calculate_entity_risk(id)
    if not res:
        return jsonify({"error": "Entity not found"}), 404
    return jsonify(res), 200
