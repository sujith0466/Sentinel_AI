from flask import Blueprint, jsonify, request
from app.services.agents import SupervisorAgent

bp = Blueprint('investigation', __name__, url_prefix='/api/investigation')

@bp.route('/analyze', methods=['POST'])
def analyze():
    data = request.json
    entity_type = data.get('entity_type')
    entity_id = data.get('entity_id')
    
    if not entity_type or not entity_id:
        return jsonify({"error": "entity_type and entity_id required"}), 400
        
    supervisor = SupervisorAgent()
    try:
        result = supervisor.execute(entity_type, entity_id)
        if "error" in result:
             return jsonify(result), 404
        return jsonify(result), 200
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
