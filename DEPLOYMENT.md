# SentinelAI Deployment Guide

This document outlines the standard operating procedures for taking SentinelAI from a local development environment into a secure production state.

## 💻 Local Development Deployment

To run SentinelAI locally for testing or Datathon presentations:

1. **Backend**:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # or .\venv\Scripts\activate on Windows
   pip install -r requirements.txt
   
   # Ensure .env is populated with GEMINI_API_KEY
   python seed.py
   python wsgi.py
   ```
   *The Flask API will run on `http://127.0.0.1:5000`.*

2. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   *The React UI will run on `http://localhost:5173`.*

---

## ☁️ Production Deployment (e.g. Zoho Catalyst / AWS / GCP)

### 1. Environment Variable Configuration
In production, do **not** use the `.env` file. Instead, securely inject the following variables directly into the host container environment:
* `GEMINI_API_KEY`: Required for Copilot and Agentic reasoning.
* `DATABASE_URL`: Must be updated from SQLite to a robust PostgreSQL cluster (e.g. `postgresql://user:pass@host/db`).
* `SECRET_KEY`: A cryptographically secure 64-character string for Flask sessions.
* `JWT_SECRET_KEY`: A secure key for token validation.
* `FLASK_ENV`: Set to `production`.
* `FLASK_DEBUG`: Set to `False`.

### 2. Database Migration
SQLite is strictly for local prototyping. Before launch:
1. Provision a PostgreSQL Database.
2. Update the `DATABASE_URL` environment variable.
3. Utilize Flask-Migrate or run `db.create_all()` within an app context connected to the Postgres URL to initialize schemas.

### 3. Frontend Production Build
To prepare the React application for a static file host or CDN:
```bash
cd frontend
npm run build
```
This generates a minified `dist/` folder. Serve this folder using Nginx, Apache, or upload it to a static hosting bucket (S3, Catalyst Web Client).

Ensure your web server is configured to route all 404 traffic back to `index.html` to support React Router's client-side navigation.

### 4. Catalyst Specific Notes
If deploying via Zoho Catalyst (often used in Indian hackathons):
* Utilize **Catalyst Cloud Scale** for hosting the Python Flask backend as an App Sail container.
* Utilize **Catalyst Web Client Hosting** for uploading the `frontend/dist` folder.
* Mount a persistent volume or connect to Catalyst's native relational datastore if opting out of external Postgres.

---

## 🔧 Troubleshooting

* **Blank Copilot Responses**: Double-check that your `GEMINI_API_KEY` is not expired or hitting rate limits. The system utilizes "Mock Mode" degradation if the key is entirely missing, but an invalid key may cause silent drops.
* **CORS Errors**: The Flask backend uses `Flask-CORS`. Ensure that the `API_BASE` in `frontend/src/services/api.js` perfectly matches the production URL of your hosted backend.
* **PDF Generation Failing**: The `xhtml2pdf` package requires specific C-libraries in certain Linux distros (like `libffi-dev`). Ensure your Docker container installs build-essentials.
