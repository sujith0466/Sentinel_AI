from app.services.governance import GovernanceService
import random
def seed_audit_logs():
    service = GovernanceService()
    actions = [
        ("Query Copilot", "Copilot", "Search"),
        ("Generate Brief", "BriefCenter", "PDF"),
        ("View Network", "NetworkIntel", "Graph"),
        ("Calculate Risk", "RiskEngine", "Score"),
        ("Forecast Hotspot", "ForecastIntel", "Map"),
        ("Investigation Run", "AgentSwarm", "Report")
    ]
    users = [("inv-01", "Investigator"), ("ana-05", "Analyst"), ("sup-02", "Supervisor"), ("demo-admin-7734", "Administrator")]
    for _ in range(45):
        action, mod, ent = random.choice(actions)
        uid, role = random.choice(users)
        service.log_activity(user_id=uid, role=role, action=action, module=mod, entity_type=ent)
