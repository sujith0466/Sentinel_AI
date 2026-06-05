export const API_BASE = '/api';

export const fetchCases = async () => {
    const res = await fetch(`${API_BASE}/cases/`);
    return res.json();
};

export const fetchCase = async (id) => {
    const res = await fetch(`${API_BASE}/cases/${id}`);
    return res.json();
};

export const fetchCriminals = async () => {
    const res = await fetch(`${API_BASE}/criminals/`);
    return res.json();
};

export const fetchVictims = async () => {
    const res = await fetch(`${API_BASE}/victims/`);
    return res.json();
};

export const fetchEvidence = async () => {
    const res = await fetch(`${API_BASE}/evidence/`);
    return res.json();
};

export const askCopilot = async (query, history = []) => {
    const res = await fetch(`${API_BASE}/intelligence/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, history })
    });
    return res.json();
};

export const fetchNetworkGraph = async () => {
    const res = await fetch(`${API_BASE}/network/graph`);
    return res.json();
};

export const analyzeInvestigation = async (entity_type, entity_id) => {
    const res = await fetch(`${API_BASE}/investigation/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entity_type, entity_id })
    });
    return res.json();
};

export const fetchBriefs = async () => {
    const res = await fetch(`${API_BASE}/briefs/`);
    return res.json();
};
export const generateBrief = async (entity_type, entity_id) => {
    const res = await fetch(`${API_BASE}/briefs/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entity_type, entity_id })
    });
    return res.json();
};
export const getBriefDownloadUrl = (id) => `${API_BASE}/briefs/${id}/download`;

export const fetchRiskDashboard = async () => {
    const res = await fetch(`${API_BASE}/risk/dashboard`);
    return res.json();
};
export const fetchRiskTop = async () => {
    const res = await fetch(`${API_BASE}/risk/top`);
    return res.json();
};
export const fetchRiskEntity = async (id) => {
    const res = await fetch(`${API_BASE}/risk/entity/${id}`);
    return res.json();
};

export const fetchHotspots = async () => {
    const res = await fetch(`${API_BASE}/hotspots/`);
    return res.json();
};
export const fetchHotspotClusters = async () => {
    const res = await fetch(`${API_BASE}/hotspots/clusters`);
    return res.json();
};
export const fetchHotspotAlerts = async () => {
    const res = await fetch(`${API_BASE}/hotspots/alerts`);
    return res.json();
};
export const fetchHotspotRanking = async () => {
    const res = await fetch(`${API_BASE}/hotspots/ranking`);
    return res.json();
};

export const fetchForecastDashboard = async () => {
    const res = await fetch(`${API_BASE}/forecast/dashboard`);
    return res.json();
};

export const fetchSociologyDashboard = async () => {
    const res = await fetch(`${API_BASE}/sociology/dashboard`);
    return res.json();
};

export const fetchGovernanceDashboard = async () => {
    const res = await fetch(`${API_BASE}/governance/dashboard`);
    return res.json();
};
