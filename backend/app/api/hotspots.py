from flask import Blueprint, jsonify
from app.services.hotspots import HotspotAnalysisService

bp = Blueprint('hotspots', __name__, url_prefix='/api/hotspots')
service = HotspotAnalysisService()

@bp.route('/', methods=['GET'])
def get_hotspots():
    data = service.analyze_hotspots()
    return jsonify(data['hotspots']), 200

@bp.route('/ranking', methods=['GET'])
def get_ranking():
    data = service.analyze_hotspots()
    ranks = [{"district": h["district"], "score": h["score"], "level": h["level"], "cases": h["case_count"]} for h in data['hotspots']]
    return jsonify(ranks), 200

@bp.route('/clusters', methods=['GET'])
def get_clusters():
    data = service.analyze_hotspots()
    return jsonify(data['clusters']), 200

@bp.route('/alerts', methods=['GET'])
def get_alerts():
    data = service.analyze_hotspots()
    return jsonify(data['alerts']), 200
