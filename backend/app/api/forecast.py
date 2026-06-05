from flask import Blueprint, jsonify
from app.services.forecast import ForecastingService

bp = Blueprint('forecast', __name__, url_prefix='/api/forecast')
service = ForecastingService()

@bp.route('/dashboard', methods=['GET'])
def get_dashboard():
    data = service.generate_forecasts()
    return jsonify(data), 200

@bp.route('/trends', methods=['GET'])
def get_trends():
    data = service.generate_forecasts()
    return jsonify(data['trends']), 200

@bp.route('/hotspots', methods=['GET'])
def get_hotspots():
    data = service.generate_forecasts()
    return jsonify(data['hotspots']), 200

@bp.route('/alerts', methods=['GET'])
def get_alerts():
    data = service.generate_forecasts()
    return jsonify(data['alerts']), 200
