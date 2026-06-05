from flask import Blueprint, jsonify
from app.services.governance import GovernanceService, requires_role

bp = Blueprint('governance', __name__, url_prefix='/api/governance')
service = GovernanceService()

@bp.route('/demo-user', methods=['GET'])
def get_demo_user():
    return jsonify(service.get_demo_user()), 200

@bp.route('/dashboard', methods=['GET'])
@requires_role('Administrator', 'Supervisor')
def get_dashboard():
    data = service.get_dashboard_metrics()
    data['audit_logs'] = service.get_audit_logs()
    data['role_matrix'] = service.get_role_matrix()
    return jsonify(data), 200
