import json
import random
from functools import wraps
from datetime import datetime, timedelta
from flask import request, jsonify
from app.models.governance import AuditLog
from app.extensions import db

# Explicit Demo Session (For Datathon)
DEMO_SESSION = {
    "user_id": "demo-admin-7734",
    "username": "Commissioner.Admin",
    "role": "Administrator",
    "status": "Active"
}

ROLE_MATRIX = {
    "Investigator": ["view_cases", "use_copilot", "generate_briefs", "view_network"],
    "Analyst": ["view_cases", "view_analytics", "view_network", "view_forecast", "view_sociology"],
    "Supervisor": ["view_cases", "use_copilot", "generate_briefs", "view_network", "view_analytics", "view_forecast", "view_risk", "view_sociology", "audit_review"],
    "Administrator": ["*"] # Full Access
}

class GovernanceService:
    def get_demo_user(self):
        return DEMO_SESSION

    def log_activity(self, user_id, role, action, module, entity_type=None, entity_id=None, meta=None):
        log = AuditLog(
            user_id=user_id, role=role, action=action, module=module,
            entity_type=entity_type, entity_id=entity_id,
            metadata_json=json.dumps(meta) if meta else None
        )
        db.session.add(log)
        db.session.commit()
        return log

    def get_audit_logs(self, limit=50):
        logs = AuditLog.query.order_by(AuditLog.timestamp.desc()).limit(limit).all()
        return [l.to_dict() for l in logs]

    def get_role_matrix(self):
        return ROLE_MATRIX

    def get_dashboard_metrics(self):
        logs = AuditLog.query.all()
        total_logs = len(logs)
        modules = {}
        for l in logs:
            modules[l.module] = modules.get(l.module, 0) + 1
            
        health_score = min(100, 75 + (total_logs / 10)) if total_logs > 0 else 100
        
        return {
            "health_score": round(health_score, 1),
            "total_audit_events": total_logs,
            "active_investigators": 12, # Mock
            "active_analysts": 8, # Mock
            "module_activity": modules,
            "demo_session": self.get_demo_user()
        }

# RBAC Decorator for production enforcement
def requires_role(*roles):
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            # In production, extract user role from JWT token in request headers
            # For Datathon demo, we explicitly bypass token friction and assign DEMO_SESSION
            current_role = DEMO_SESSION["role"]
            
            if current_role == "Administrator":
                 return fn(*args, **kwargs)
                 
            if current_role not in roles:
                 return jsonify({"error": "Unauthorized Access", "required_roles": roles}), 403
                 
            return fn(*args, **kwargs)
        return decorator
    return wrapper
