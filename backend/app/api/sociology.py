from flask import Blueprint, jsonify
from app.services.sociology import SociologicalAnalysisService

bp = Blueprint('sociology', __name__, url_prefix='/api/sociology')
service = SociologicalAnalysisService()

@bp.route('/dashboard', methods=['GET'])
def get_dashboard():
    return jsonify(service.get_dashboard()), 200

@bp.route('/demographics', methods=['GET'])
def get_demographics():
    return jsonify(service.get_demographics()), 200

@bp.route('/correlations', methods=['GET'])
def get_correlations():
    return jsonify(service.get_correlations()), 200

@bp.route('/insights', methods=['GET'])
def get_insights():
    return jsonify(service.generate_insights()), 200

@bp.route('/risk-factors', methods=['GET'])
def get_risk_factors():
    return jsonify(service.get_risk_factors()), 200
