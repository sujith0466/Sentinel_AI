import os
import json
import time
import google.generativeai as genai
from app.models import Case, Criminal, Victim, Evidence, IntelligenceBrief, User
from app.extensions import db
from app.services.network import NetworkAnalysisService

class InvestigationAgent:
    def execute(self, entity_type, entity_id):
        # Time delay for realistic simulation
        time.sleep(1.0)
        data = {}
        if entity_type == 'criminal':
            c = Criminal.query.get(entity_id)
            if not c: return {"error": "Criminal not found"}
            data = c.to_dict()
        elif entity_type == 'case':
            c = Case.query.get(entity_id)
            if not c: return {"error": "Case not found"}
            data = c.to_dict()
            evidence = Evidence.query.filter_by(case_id=c.id).all()
            data['evidence'] = [e.to_dict() for e in evidence]
        elif entity_type == 'victim':
            v = Victim.query.get(entity_id)
            if not v: return {"error": "Victim not found"}
            data = v.to_dict()
            
        return data

class NetworkAgent:
    def execute(self, entity_type, entity_id):
        time.sleep(1.5)
        service = NetworkAnalysisService()
        service.build_graph()
        metrics = service.calculate_metrics()
        
        node_metrics = metrics.get(entity_id, {})
        associations = service.detect_hidden_associations()
        
        # Filter associations involving this entity
        relevant_assocs = [a for a in associations if a['source_id'] == entity_id or a['target_id'] == entity_id]
        
        return {
            "metrics": node_metrics,
            "relevant_associations": relevant_assocs
        }

class ProfilingAgent:
    def __init__(self, api_key):
        if api_key and api_key != "your-gemini-api-key":
             genai.configure(api_key=api_key)
             self.model = genai.GenerativeModel('gemini-2.5-flash', generation_config={"response_mime_type": "application/json"})
        else:
             self.model = None

    def execute(self, entity_type, inv_data, net_data):
        time.sleep(1.5)
        if not self.model:
            return {
                "profile": "Psychological & Operational Profile unavailable (API Key not configured).",
                "risk_level": "Unknown",
                "confidence": 1.0
            }
            
        prompt = f"""
        You are the Profiling Agent. Analyze the investigation and network data to build a psychological/operational profile.
        Return strictly this JSON:
        {{
           "profile": "Detailed profile summary...",
           "risk_level": "High/Medium/Low",
           "confidence": 0.95
        }}
        Data: {json.dumps(inv_data)}
        Network: {json.dumps(net_data)}
        """
        try:
            res = self.model.generate_content(prompt)
            return json.loads(res.text)
        except Exception:
            return {"profile": "Error generating profile", "risk_level": "Unknown", "confidence": 0.0}

class SummaryAgent:
    def __init__(self, api_key):
        if api_key and api_key != "your-gemini-api-key":
             genai.configure(api_key=api_key)
             self.model = genai.GenerativeModel('gemini-2.5-flash', generation_config={"response_mime_type": "application/json"})
        else:
             self.model = None

    def execute(self, entity_type, inv_data, net_data, prof_data):
        time.sleep(2.0)
        if not self.model:
            return {
                "report_markdown": f"# Unified Investigation Report\n\n**[MOCK MODE]**\n\nRaw Data:\n```json\n{json.dumps(inv_data, indent=2)}\n```",
                "recommended_leads": ["Configure Gemini API Key to see AI leads."],
                "confidence": 1.0
            }
            
        prompt = f"""
        You are the Summary Agent. Synthesize the findings of the Investigation, Network, and Profiling Agents into a highly professional Unified Investigation Report using Markdown. Include a section for Recommended Investigative Leads.
        Return strictly this JSON:
        {{
           "report_markdown": "# Final Report\n...",
           "recommended_leads": ["Lead 1", "Lead 2"],
           "confidence": 0.98
        }}
        Inv Data: {json.dumps(inv_data)}
        Net Data: {json.dumps(net_data)}
        Prof Data: {json.dumps(prof_data)}
        """
        try:
            res = self.model.generate_content(prompt)
            return json.loads(res.text)
        except Exception as e:
            return {
                "report_markdown": f"# Brief Generation Failed\n\n**Reason:** {e.__class__.__name__}\n\n**Details:** {str(e)}\n\n**Recommendation:**\nRetry generation after quota refresh.",
                "recommended_leads": [],
                "confidence": 0.0
            }

class SupervisorAgent:
    def __init__(self):
        api_key = os.environ.get('GEMINI_API_KEY')
        self.inv_agent = InvestigationAgent()
        self.net_agent = NetworkAgent()
        self.prof_agent = ProfilingAgent(api_key)
        self.sum_agent = SummaryAgent(api_key)
        
    def execute(self, entity_type, entity_id):
        timeline = []
        
        timeline.append({"agent": "InvestigationAgent", "status": "Running", "message": "Fetching database records...", "time": time.time()})
        inv_data = self.inv_agent.execute(entity_type, entity_id)
        if "error" in inv_data:
             timeline.append({"agent": "InvestigationAgent", "status": "Failed", "message": inv_data["error"], "time": time.time()})
             return {"error": inv_data["error"], "timeline": timeline}
        timeline.append({"agent": "InvestigationAgent", "status": "Completed", "message": f"Retrieved {len(str(inv_data))} bytes of raw data.", "time": time.time()})

        timeline.append({"agent": "NetworkAgent", "status": "Running", "message": "Analyzing topological graph metrics...", "time": time.time()})
        net_data = self.net_agent.execute(entity_type, entity_id)
        timeline.append({"agent": "NetworkAgent", "status": "Completed", "message": "Influence scores and associations computed.", "time": time.time()})

        timeline.append({"agent": "ProfilingAgent", "status": "Running", "message": "Synthesizing psychological & operational profile...", "time": time.time()})
        prof_data = self.prof_agent.execute(entity_type, inv_data, net_data)
        timeline.append({"agent": "ProfilingAgent", "status": "Completed", "message": f"Profile generated with {(prof_data.get('confidence', 0)*100):.0f}% confidence.", "time": time.time()})

        timeline.append({"agent": "SummaryAgent", "status": "Running", "message": "Compiling Unified Investigation Report...", "time": time.time()})
        sum_data = self.sum_agent.execute(entity_type, inv_data, net_data, prof_data)
        timeline.append({"agent": "SummaryAgent", "status": "Completed", "message": f"Report finalized with {(sum_data.get('confidence', 0)*100):.0f}% confidence.", "time": time.time()})

        return {
            "timeline": timeline,
            "report": sum_data.get("report_markdown"),
            "leads": sum_data.get("recommended_leads", []),
            "confidence": sum_data.get("confidence", 0),
            "raw_data": {
                "investigation": inv_data,
                "network": net_data,
                "profiling": prof_data
            }
        }
