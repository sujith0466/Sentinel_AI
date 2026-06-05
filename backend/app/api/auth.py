from flask import Blueprint, jsonify

bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@bp.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok", "service": "SentinelAI Core Platform Foundation"}), 200
