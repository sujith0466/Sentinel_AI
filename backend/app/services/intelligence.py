import os
import json
import google.generativeai as genai
from app.models import Case, Criminal, Victim, Evidence, Relationship, Alert
from app.extensions import db
from sqlalchemy import or_, desc

class IntentExtractor:
    def __init__(self, api_key):
        genai.configure(api_key=api_key)
        # Using a stable, fast model for intent parsing
        self.model = genai.GenerativeModel('gemini-2.5-flash', generation_config={"response_mime_type": "application/json"})
        
    def extract(self, query):
        prompt = f"""
        You are the Intent Router for SentinelAI Police database.
        Classify the query into one of these intents: query_cases, query_criminals, query_victims, query_evidence, query_alerts, query_relationships, summarize_case.
        Also extract any filters (e.g. district, crime_type, risk_score_gt), sort (e.g. risk_score_desc), and limit.
        
        Return exactly this JSON schema:
        {{
            "intent": "string",
            "filters": {{"field_name": "value"}},
            "sort": "string or null",
            "limit": 10
        }}
        
        Query: "{query}"
        """
        response = self.model.generate_content(prompt)
        try:
            return json.loads(response.text)
        except Exception:
            return {"intent": "query_cases", "filters": {}, "sort": None, "limit": 10}

class DatabaseQueryMapper:
    def execute(self, intent_data):
        intent = intent_data.get('intent')
        filters = intent_data.get('filters', {})
        limit = intent_data.get('limit', 10)
        
        results = []
        sources = []
        
        if intent == "query_cases" or intent == "summarize_case":
            q = Case.query
            if 'crime_type' in filters:
                q = q.filter(Case.crime_type.ilike(f"%{filters['crime_type']}%"))
            if 'district' in filters:
                q = q.filter(Case.district.ilike(f"%{filters['district']}%"))
            records = q.limit(limit).all()
            results = [c.to_dict() for c in records]
            sources = [{"type": "Case", "id": c.fir_number, "title": c.title} for c in records]
            
        elif intent == "query_criminals":
            q = Criminal.query
            if 'status' in filters:
                q = q.filter(Criminal.status.ilike(f"%{filters['status']}%"))
            # High risk offenders requested
            if intent_data.get('sort') == 'risk_score_desc' or 'high' in str(filters).lower():
                q = q.order_by(desc(Criminal.risk_score))
            records = q.limit(limit).all()
            results = [c.to_dict() for c in records]
            sources = [{"type": "Criminal", "id": c.id[:8], "title": c.name} for c in records]
            
        elif intent == "query_victims":
            records = Victim.query.order_by(desc(Victim.vulnerability_score)).limit(limit).all()
            results = [v.to_dict() for v in records]
            sources = [{"type": "Victim", "id": v.id[:8], "title": v.name} for v in records]
            
        elif intent == "query_evidence":
            q = Evidence.query
            if 'type' in filters:
                 q = q.filter(Evidence.evidence_type.ilike(f"%{filters['type']}%"))
            records = q.limit(limit).all()
            results = [e.to_dict() for e in records]
            sources = [{"type": "Evidence", "id": e.id[:8], "title": e.evidence_type} for e in records]
        
        else:
            # Fallback
            records = Case.query.limit(3).all()
            results = [c.to_dict() for c in records]
            sources = [{"type": "Case", "id": c.fir_number, "title": c.title} for c in records]
            
        return results, sources

class ResponseSynthesizer:
    def __init__(self, api_key):
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-2.5-flash', generation_config={"response_mime_type": "application/json"})
        
    def synthesize(self, query, db_results, sources):
        prompt = f"""
        You are SentinelAI, an AI Copilot for investigators.
        Answer the user's query based ONLY on the provided JSON Database Records.
        Provide a professional, analytical, and structured response using Markdown.
        Do not hallucinate data. If the records are empty, say no data was found.
        
        Return exactly this JSON schema:
        {{
            "answer": "Your detailed markdown response here.",
            "confidence": 0.95
        }}
        
        User Query: "{query}"
        Database Records: {json.dumps(db_results, default=str)}
        """
        response = self.model.generate_content(prompt)
        try:
            res_json = json.loads(response.text)
            res_json["sources"] = sources
            if not isinstance(res_json.get("confidence"), (int, float)):
                res_json["confidence"] = 0.85
            return res_json
        except Exception as e:
            return {
                "answer": f"Error parsing AI response. Raw data found: {len(db_results)} records.",
                "sources": sources,
                "confidence": 0.5
            }

class AgentRouter:
    """
    Prepares for Multi-Agent room by orchestrating the Extract -> Query -> Synthesize pipeline.
    """
    def __init__(self):
        api_key = os.environ.get('GEMINI_API_KEY')
        # Allow fallback if no API key is provided for hackathon testing
        if not api_key or api_key == "your-gemini-api-key":
             self.mock_mode = True
        else:
             self.mock_mode = False
             self.extractor = IntentExtractor(api_key)
             self.synthesizer = ResponseSynthesizer(api_key)
        self.mapper = DatabaseQueryMapper()
        
    def process_query(self, query, history):
        if self.mock_mode:
            # Mock mode bypasses Gemini if API key is invalid, returning raw DB data
            intent_data = {"intent": "query_cases", "filters": {}, "limit": 5}
            if 'criminal' in query.lower() or 'offender' in query.lower():
                 intent_data["intent"] = "query_criminals"
            elif 'victim' in query.lower():
                 intent_data["intent"] = "query_victims"
                 
            db_results, sources = self.mapper.execute(intent_data)
            return {
                "answer": f"**[MOCK MODE: Gemini API Key not configured]**\nFound {len(db_results)} relevant records in the database for your query. Please configure GEMINI_API_KEY to see the AI synthesis.",
                "sources": sources,
                "confidence": 1.0
            }
            
        # 1. Extract Intent
        intent_data = self.extractor.extract(query)
        
        # 2. Map & Query DB
        db_results, sources = self.mapper.execute(intent_data)
        
        # 3. Synthesize Final Response
        final_response = self.synthesizer.synthesize(query, db_results, sources)
        return final_response
