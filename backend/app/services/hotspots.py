import json
import random
import uuid
from datetime import datetime
from collections import defaultdict
from app.models import Case, Evidence, Relationship, Criminal, HotspotSnapshot
from app.extensions import db

# Base coordinates for simulated Bangalore Districts
DISTRICT_COORDS = {
    "East": (12.9784, 77.6408), # Indiranagar
    "South": (12.9279, 77.6271), # Koramangala
    "Central": (12.9738, 77.5905), # Cubbon Park
    "North": (13.0285, 77.5895), # Hebbal
    "West": (12.9845, 77.5505), # Rajajinagar
    "Various": (12.9716, 77.5946), # General Center
}

class HotspotAnalysisService:
    def get_level(self, score):
        if score >= 80: return "Critical"
        if score >= 60: return "High"
        if score >= 35: return "Medium"
        return "Low"

    def analyze_hotspots(self):
        cases = Case.query.all()
        district_data = defaultdict(lambda: {"count": 0, "cases": [], "severity_score": 0, "crime_types": set(), "high_risk_criminals": 0})
        
        # Gather Base Case Data
        for case in cases:
             dist = case.district or "Various"
             d_data = district_data[dist]
             d_data["count"] += 1
             d_data["cases"].append(case)
             d_data["crime_types"].add(case.crime_type)
             
             # Calculate case severity multiplier
             multiplier = 3 if case.priority == 'High' else (2 if case.priority == 'Medium' else 1)
             d_data["severity_score"] += multiplier
             
             # Map criminals to district risk
             suspects = Relationship.query.filter_by(entity_b_id=case.id, relation='PRIMARY_SUSPECT').all()
             for s in suspects:
                 criminal = Criminal.query.get(s.entity_a_id)
                 if criminal and criminal.risk_score >= 70:
                      d_data["high_risk_criminals"] += 1

        hotspots = []
        clusters = []
        alerts = []
        
        for dist, data in district_data.items():
            base_coord = DISTRICT_COORDS.get(dist, DISTRICT_COORDS["Various"])
            
            # Hotspot Score Calculation
            base_score = (data["count"] * 2) + (data["severity_score"]) + (data["high_risk_criminals"] * 5)
            # Normalize to ~100
            score = min(100, (base_score / 30) * 100 if base_score > 0 else 0)
            level = self.get_level(score)
            
            # Persist Snapshot for Forecasting
            snapshot = HotspotSnapshot(district=dist, score=score, level=level, case_count=data["count"], metrics_json=json.dumps({"crime_types": list(data["crime_types"])}))
            db.session.add(snapshot)
            
            # Geographically disperse the cases around the district center (small offset)
            map_points = []
            for c in data["cases"]:
                offset_lat = random.uniform(-0.015, 0.015)
                offset_lng = random.uniform(-0.015, 0.015)
                map_points.append({
                    "id": c.id, "title": c.title, "type": c.crime_type, "priority": c.priority,
                    "lat": base_coord[0] + offset_lat,
                    "lng": base_coord[1] + offset_lng
                })

            hotspots.append({
                "district": dist,
                "score": score,
                "level": level,
                "case_count": data["count"],
                "crime_types": list(data["crime_types"]),
                "high_risk_criminals": data["high_risk_criminals"],
                "center": {"lat": base_coord[0], "lng": base_coord[1]},
                "points": map_points
            })
            
            # Detect Clusters (if multiple of same crime type in one district)
            for c_type in data["crime_types"]:
                type_count = sum(1 for c in data["cases"] if c.crime_type == c_type)
                if type_count >= 3:
                     clusters.append({
                         "district": dist, "crime_type": c_type, "count": type_count,
                         "severity": "High" if type_count > 5 else "Medium",
                         "confidence": 0.85 + (min(type_count, 15) / 100.0) # Heuristic confidence
                     })
                     
            # Generate Alerts
            if level in ["Critical", "High"] and data["count"] > 5:
                 alerts.append({
                     "id": str(uuid.uuid4()), "district": dist, "level": level,
                     "message": f"{level} risk hotspot detected in {dist} involving {data['count']} cases and {data['high_risk_criminals']} high-risk subjects.",
                     "timestamp": datetime.utcnow().isoformat()
                 })

        db.session.commit()
        hotspots.sort(key=lambda x: x["score"], reverse=True)
        return {"hotspots": hotspots, "clusters": clusters, "alerts": alerts}
