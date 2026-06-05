from flask import Blueprint, jsonify, request
from app.services.intelligence import AgentRouter

bp = Blueprint('intelligence', __name__, url_prefix='/api/intelligence')

@bp.route('/ask', methods=['POST'])
def ask_copilot():
    data = request.json
    query = data.get('query')
    history = data.get('history', [])
    
    if not query:
        return jsonify({"error": "Query is required"}), 400
        
    router = AgentRouter()
    try:
        response = router.process_query(query, history)
        return jsonify(response), 200
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
