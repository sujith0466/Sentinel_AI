# Repository Structure

SentinelAI follows a strict, decoupled Monorepo structure, cleanly separating the React frontend from the Flask backend.

## Final Folder Hierarchy

```text
SentinelAI/
│
├── backend/                  # Python Flask REST API
│   ├── app/
│   │   ├── api/              # Route Blueprints (cases.py, forecast.py, governance.py...)
│   │   ├── models/           # SQLAlchemy Schemas (criminal.py, case.py, audit.py...)
│   │   ├── services/         # Core Business Logic (intelligence.py, sociology.py...)
│   │   ├── __init__.py       # App Factory & Blueprint Registration
│   │   └── extensions.py     # Shared Plugins (db, cors)
│   │
│   ├── instance/             # Local SQLite Storage (Ignored)
│   ├── .env.example          # Safe Environment Template
│   ├── requirements.txt      # Python Dependencies
│   ├── seed.py               # Main DB Populator
│   ├── seed_data.py          # Core Mock Entities
│   ├── seed_governance.py    # Audit Log Injector
│   ├── config.py             # App ConfigurationLoader
│   └── wsgi.py               # WSGI Entry Point
│
├── frontend/                 # React UI Client
│   ├── public/               # Static Assets
│   ├── src/
│   │   ├── components/       # Reusable UI (Sidebar.jsx, Navbar.jsx)
│   │   ├── pages/            # Top-Level Views (Dashboard.jsx, Sociology.jsx, Risk.jsx...)
│   │   ├── services/         # API Fetch Wrappers (api.js)
│   │   ├── App.jsx           # Global Router
│   │   ├── index.css         # Tailwind & Base Styles
│   │   └── main.jsx          # React Entry
│   │
│   ├── package.json          # Node Dependencies
│   ├── tailwind.config.js    # Design System Tokens
│   └── vite.config.js        # Build Tools
│
├── .gitignore                # Global Git Ignore rules
├── DEPLOYMENT.md             # Production Launch Instructions
├── README.md                 # Primary Entry Documentation
└── REPOSITORY_STRUCTURE.md   # This file
```

## Architectural Highlights
* **Fat Services, Thin Routes**: The `app/api/` layer only handles HTTP I/O. All algorithmic heuristics and Gemini API calls are strictly encapsulated in `app/services/`.
* **Centralized Extensibility**: `app/extensions.py` prevents circular imports by hosting the single `db` instance.
* **Component Modularity**: The `frontend/src/pages/` folder maps 1:1 with the routing logic in `App.jsx` for clean code discoverability.
