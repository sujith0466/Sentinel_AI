from flask import Blueprint, jsonify

bp = Blueprint('alerts', __name__, url_prefix='/api/alerts')

@bp.route('/', methods=['GET'])
def index():
    return jsonify({"module": "alerts"})
