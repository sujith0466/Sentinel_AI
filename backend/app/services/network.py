import networkx as nx
from app.models import Case, Criminal, Victim, Evidence, Relationship, Alert
from app.extensions import db

class NetworkAnalysisService:
    def __init__(self):
        self.graph = nx.Graph()

    def build_graph(self):
        self.graph.clear()
        
        # Add Nodes
        criminals = Criminal.query.all()
        for c in criminals:
            self.graph.add_node(c.id, label=c.name, type='criminal', group=1, risk_score=c.risk_score, details=c.modus_operandi)
            
        victims = Victim.query.all()
        for v in victims:
            self.graph.add_node(v.id, label=v.name, type='victim', group=2, vul_score=v.vulnerability_score)
            
        cases = Case.query.all()
        for c in cases:
            self.graph.add_node(c.id, label=c.title, type='case', group=3, fir=c.fir_number)
            
        evidence = Evidence.query.all()
        for e in evidence:
            self.graph.add_node(e.id, label=e.evidence_type, type='evidence', group=4, confidence=e.confidence_score)
            # Implicit relationship: Evidence -> Case
            self.graph.add_edge(e.id, e.case_id, relation='BELONGS_TO_CASE', confidence=e.confidence_score)
            
        alerts = Alert.query.all()
        for a in alerts:
            self.graph.add_node(a.id, label=a.type, type='alert', group=5, severity=a.severity)

        # Add Explicit Edges
        relationships = Relationship.query.all()
        for r in relationships:
            if self.graph.has_node(r.entity_a_id) and self.graph.has_node(r.entity_b_id):
                self.graph.add_edge(r.entity_a_id, r.entity_b_id, relation=r.relation, confidence=0.85)

        return self.graph

    def calculate_metrics(self):
        if self.graph.number_of_nodes() == 0:
            return {}
            
        deg_centrality = nx.degree_centrality(self.graph)
        bet_centrality = nx.betweenness_centrality(self.graph)
        
        metrics = {}
        for node in self.graph.nodes():
            influence = (deg_centrality.get(node, 0) * 0.4) + (bet_centrality.get(node, 0) * 0.6)
            metrics[node] = {
                "degree_centrality": deg_centrality.get(node, 0),
                "betweenness_centrality": bet_centrality.get(node, 0),
                "influence_score": influence
            }
            # Update node attribute
            self.graph.nodes[node]['influence_score'] = influence
            
        return metrics

    def detect_hidden_associations(self):
        associations = []
        if self.graph.number_of_nodes() == 0:
            return associations
            
        criminals = [n for n, attr in self.graph.nodes(data=True) if attr.get('type') == 'criminal']
        
        for i in range(len(criminals)):
            for j in range(i+1, len(criminals)):
                c1 = criminals[i]
                c2 = criminals[j]
                
                if not self.graph.has_edge(c1, c2):
                    # Check for shared neighbors
                    shared = list(nx.common_neighbors(self.graph, c1, c2))
                    if shared:
                        # Confidence score based on number of shared connections and their types
                        confidence = min(0.99, 0.5 + (len(shared) * 0.15))
                        
                        shared_details = []
                        for s in shared:
                            stype = self.graph.nodes[s].get('type')
                            slabel = self.graph.nodes[s].get('label')
                            shared_details.append(f"{stype}: {slabel}")
                            
                        associations.append({
                            "source_id": c1,
                            "source_label": self.graph.nodes[c1].get('label'),
                            "target_id": c2,
                            "target_label": self.graph.nodes[c2].get('label'),
                            "shared_entities": shared_details,
                            "confidence": confidence
                        })
                        
        # Sort by highest confidence
        associations = sorted(associations, key=lambda x: x['confidence'], reverse=True)
        return associations[:10]  # Return top 10 hidden associations

    def get_graph_data(self):
        self.build_graph()
        self.calculate_metrics()
        
        data = nx.node_link_data(self.graph)
        # NetworkX v3+ uses 'edges' by default, force-graph expects 'links'
        if 'edges' in data:
            data['links'] = data.pop('edges')
        
        associations = self.detect_hidden_associations()
        
        return {
            "graph": data,
            "hidden_associations": associations,
            "global_metrics": {
                "total_nodes": self.graph.number_of_nodes(),
                "total_edges": self.graph.number_of_edges(),
                "density": nx.density(self.graph) if self.graph.number_of_nodes() > 0 else 0
            }
        }
