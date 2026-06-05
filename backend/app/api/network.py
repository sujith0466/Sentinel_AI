from flask import Blueprint, jsonify
from app.services.network import NetworkAnalysisService

bp = Blueprint('network', __name__, url_prefix='/api/network')

@bp.route('/graph', methods=['GET'])
def get_graph():
    service = NetworkAnalysisService()
    data = service.get_graph_data()
    return jsonify(data), 200
