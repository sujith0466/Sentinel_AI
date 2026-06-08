# SentinelAI

> **Next-Generation Police Intelligence & Forecasting Ecosystem**
> 
> *Built for the Karnataka State Police Datathon 2026*

SentinelAI is a comprehensive, AI-driven police intelligence platform designed to transition law enforcement from reactive investigations to proactive, explainable forecasting. It seamlessly unifies geospatial hotspots, deep entity networks, sociological profiling, and multi-agent AI orchestration into a single, secure executive command center.

---

## 🎯 Problem Statement

Modern law enforcement agencies generate vast amounts of structured data (FIRs, Arrest Records) and unstructured data (Interrogation notes, forensics). However, existing systems treat this data as isolated silos, making it impossible to predict emerging crime hotspots, detect complex cartel structures, or generate holistic sociologically-driven insights. Investigators spend hours parsing data rather than acting on intelligence.

SentinelAI bridges this gap by applying deterministic, explainable AI heuristics over a unified intelligence mesh, actively surfacing actionable insights before a crime wave escalates.

---

## 🌟 Key Features

1. **Crime Intelligence Copilot**: A secure, natural-language AI assistant powered by Google Gemini that extracts intent and queries structured police databases in real-time.
2. **Network Intelligence**: Deep, force-directed graph visualizations (`react-force-graph-2d`) mapping hidden associations between cartels, criminal associates, victims, and evidence chains.
3. **Risk Intelligence Engine**: Deterministic, explainable heuristics that score and rank high-risk offenders, avoiding opaque "black-box" ML logic.
4. **Crime Hotspots**: Geospatial intelligence (`react-leaflet`) that detects and clusters emerging crime zones across districts, issuing executive alerts.
5. **Forecast Intelligence**: Forward-looking early warning system that predicts crime trends based on algorithmic momentum and district escalation histories.
6. **Sociological Layer**: Deep correlation mapping that links specific socio-economic indicators (Urbanization, Economic Stress) to regional crime volumes.
7. **Intelligence Brief Center**: Automated Python-based (`xhtml2pdf`) PDF generation synthesizing cross-module findings into professional Executive Briefs.
8. **Multi-Agent Room**: Deep investigative orchestration utilizing simulated specialized AI personas (Psychologist, Cyber, Financial) to crack complex cases.
9. **Security & Governance**: Full Role-Based Access Control (RBAC), timeline audit logging, and strict permission matrices protecting sensitive intelligence.

---

## 🏗️ Architecture Overview

SentinelAI is built as a decoupled, modern web application prioritizing speed, stability, and clean code boundaries.

### Technology Stack
* **Frontend**: React 18, Vite, TailwindCSS, Lucide React, React Router
* **Backend**: Python 3, Flask, SQLAlchemy, Flask-CORS
* **Database**: SQLite (Development) -> PostgreSQL Ready (Production)
* **AI Core**: Google Gemini (`google.generativeai`) - *Migrated to `gemini-2.5-flash` for maximum inference speed and quota optimization*
* **PDF Engine**: `xhtml2pdf`

---

## 🚀 Installation & Environment Setup

### Prerequisites
* Python 3.10+
* Node.js 18+
* A valid Google Gemini API Key.

### 1. Backend Setup
```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
```

#### Environment Variables
Create a `.env` file in the `backend/` directory (see `backend/.env.example`):
```env
GEMINI_API_KEY=your_key_here
SECRET_KEY=secure-secret-key
JWT_SECRET_KEY=secure-jwt-key
DATABASE_URL=sqlite:///sentinel.db
FLASK_ENV=development
```

#### Seed Database
Populate the system with complex, interconnected mock data and audit logs:
```bash
python seed.py
```

### 2. Frontend Setup
```bash
cd frontend
npm install
```

---

## 💻 Running the Application

1. **Start the Backend Server**:
```bash
cd backend
python wsgi.py
# Runs on http://127.0.0.1:5000
```

2. **Start the Frontend Client**:
```bash
cd frontend
npm run dev
# Runs on http://localhost:5173
```

---

## ☁️ Catalyst Deployment

SentinelAI is fully prepared for Zoho Catalyst deployment:
1. Run `catalyst login` to authenticate.
2. Ensure you have injected `GEMINI_API_KEY` inside the Catalyst Console (AppSail -> Environment Variables).
3. Run `catalyst deploy` from the root directory. Catalyst will automatically host `frontend/dist` and launch the `backend/` via AppSail using the custom `app-config.json` bindings.

---

## 📸 Screenshots & Demo Flow

### Recommended Demo Flow for Judges:
1. **Executive Dashboard**: Review the overall `Risk Score` and `Network Volume` metrics.
2. **Copilot**: Ask the Gemini Assistant, *"Show me high-risk cyber offenders."*
3. **Network Intelligence**: Visualize the cartel graphs to see exactly who these offenders are connected to.
4. **Hotspot & Forecast**: Navigate to Forecast Intelligence to view the emerging regional heatmap and watchlist.
5. **Sociology**: Observe how *Urbanization* and *Digital Adoption* indices correlate with the cyber fraud spike.
6. **Investigation Room**: Spawn the Multi-Agent panel to crack a specific Case ID and download the generated PDF Brief.

### UI Previews
*(Placeholders for GitHub Release)*
* `[Screenshot: Dashboard]`
* `[Screenshot: Network Graph Visualization]`
* `[Screenshot: Intelligence Brief PDF Generation]`
* `[Screenshot: Forecast Early Warning System]`

---

## 🔒 Security & Evaluation Note
For the purposes of the Datathon evaluation, the application ships with an **Active Demo Session**. 
Strict Role-Based Access Control (RBAC) and Audit Logging logic are fully implemented in the backend, but the frontend automatically inherits an `Administrator` persona to allow judges completely frictionless access to the platform without requiring JWT registration flows.

---

## 📈 Future Scope
* **Live CCTV Integration**: Ingesting live video feeds into the Copilot's multi-modal context window.
* **National Database Sync**: Upgrading the `DATABASE_URL` to ingest real-time state API feeds.
* **Mobile App Port**: Refactoring the React codebase into React Native for field officers.

---

## 🤝 Team
Developed with ❤️ for the Karnataka State Police Datathon.
