# MediPredict — AI Health Prediction System

A full-stack web application that predicts possible diseases from user-selected symptoms using a Random Forest machine-learning model. Built with **React + Vite + Tailwind CSS** on the frontend and **Flask + scikit-learn** on the backend.

> ⚠️ **Disclaimer:** This system is for educational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment.

---

## Features

- **ML-powered predictions** — Random Forest classifier trained on a curated symptom-disease dataset
- **Top 3 possibilities** with a confidence-score bar chart (Recharts)
- **Searchable symptom selector** with multi-select chips
- **Voice input** for symptoms (Web Speech API, Chrome/Edge)
- **Disease catalogue** with detail pages — descriptions, precautions, and severity badges
- **Dark mode** toggle (persisted in `localStorage`)
- **Local prediction history** stored client-side
- **Responsive medical-dashboard UI** (blue/green theme)

---

## Project Structure

```
AI Health Prediction System/
├── backend/
│   ├── app.py               # Flask REST API
│   ├── train_model.py       # ML training pipeline
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── api/             # Axios client
│   │   ├── components/      # Navbar, Footer, Spinner, Disclaimer, DiseaseIcon
│   │   ├── context/         # ThemeContext (dark mode)
│   │   ├── pages/           # Home, Symptoms, Result, DiseaseList, DiseaseDetails, About
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
├── dataset/
│   └── disease_symptoms.json  # Disease-symptom mapping with metadata
├── model/                   # Generated artifacts (rf_model.joblib, label_encoder.joblib, symptom_list.joblib)
└── README.md
```

---

## Setup Instructions

### Prerequisites

- **Python 3.9+** (3.10 or 3.11 recommended)
- **Node.js 18+** and npm

### 1. Backend setup

Open a terminal in the project root.

```bash
cd backend

# Create and activate a virtual environment
python -m venv venv

# Windows:
venv\Scripts\activate
# macOS / Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Train the model (run once — generates files in ../model/)
python train_model.py

# Start the Flask API
python app.py
```

The backend will be available at **http://localhost:5000**.

Quick health check:

```bash
curl http://localhost:5000/
```

### 2. Frontend setup

In a **new terminal**:

```bash
cd frontend
npm install
npm run dev
```

The app will be available at **http://localhost:5173**. The Vite dev server proxies `/api/*` to the Flask backend automatically — no extra configuration needed.

---

## Usage

1. Open **http://localhost:5173** in your browser
2. Click **Start Diagnosis** (or navigate to **Predict**)
3. Select the symptoms you're experiencing — use the search bar or voice input
4. Click **Get Prediction**
5. Review the top match, confidence score, top-3 chart, description, and precautions
6. Click **View full details** to see the full disease page

---

## API Reference

Base URL: `http://localhost:5000`

### `GET /`
Health check.

### `GET /symptoms`
Returns the supported symptom list.
```json
{ "symptoms": [{ "id": "fever", "label": "Fever" }, ...] }
```

### `GET /diseases`
Returns the full disease catalogue with metadata.

### `GET /diseases/<name>`
Returns details for a single disease.

### `POST /predict`
**Request:**
```json
{ "symptoms": ["fever", "cough", "headache"] }
```

**Response:**
```json
{
  "disease": "Influenza (Flu)",
  "confidence": 0.87,
  "description": "A contagious respiratory illness...",
  "precautions": ["Rest and stay hydrated...", "..."],
  "severity": "Moderate",
  "icon": "virus",
  "top_predictions": [
    { "disease": "Influenza (Flu)", "confidence": 0.87, "severity": "Moderate" },
    { "disease": "Common Cold", "confidence": 0.09, "severity": "Mild" },
    { "disease": "COVID-19", "confidence": 0.02, "severity": "Moderate to Severe" }
  ],
  "input_symptoms": ["fever", "cough", "headache"],
  "unknown_symptoms": [],
  "disclaimer": "This system is for educational purposes only..."
}
```

---

## How the Model Works

1. `dataset/disease_symptoms.json` contains a curated mapping of 23 diseases to their core symptoms, descriptions, precautions, and severity.
2. `train_model.py` generates 200 synthetic patient records per disease — each disease's core symptoms appear with ~85% probability, and small random noise is added so the model learns realistic, overlapping patterns.
3. A `RandomForestClassifier` (300 trees) is trained on the resulting binary feature matrix and saved with `joblib`.
4. At request time, the backend builds a binary feature vector from the user's symptoms and calls `predict_proba` to return the top-3 most likely diseases.

---

## Customization

### Add a new disease
Edit `dataset/disease_symptoms.json`, add an entry under `diseases`, then re-run:
```bash
python backend/train_model.py
```

### Add a new symptom
Add the symptom (snake_case) to `all_symptoms` in `dataset/disease_symptoms.json` and reference it in any disease's `symptoms` list, then retrain.

### Change the model
Swap `RandomForestClassifier` in `backend/train_model.py` for `DecisionTreeClassifier`, `MultinomialNB`, etc. — the rest of the pipeline is untouched.

### Production deployment
- Set `VITE_API_URL` in `frontend/.env` to your deployed backend origin and run `npm run build`.
- Serve the Flask app via Gunicorn (`gunicorn -w 4 app:app`) behind a reverse proxy.

---

## Deployment

The recommended free-tier path is **Render** (backend) + **Vercel** (frontend). Both auto-deploy from a GitHub repo.

### 0. Push the project to GitHub

```bash
cd "AI Health Prediction System"
git init
git add .
git commit -m "Initial commit: MediPredict"
git branch -M main
git remote add origin https://github.com/<your-username>/medipredict.git
git push -u origin main
```

### 1. Backend on Render

1. Sign in at **https://render.com** with GitHub.
2. Click **New → Blueprint**, select your repo, and Render will read [render.yaml](render.yaml) and provision the `medipredict-api` service.
3. The build runs `pip install -r requirements.txt && python train_model.py`, and the service starts with Gunicorn.
4. Wait for the service to go **Live** — copy the URL (e.g. `https://medipredict-api.onrender.com`).
5. Hit `https://<your-service>.onrender.com/` to confirm the health check returns JSON.

> Free-tier Render services sleep after 15 min of inactivity and take ~30 s to wake on the next request. That's fine for a portfolio demo.

### 2. Frontend on Vercel

1. Sign in at **https://vercel.com** with GitHub.
2. Click **Add New → Project**, import your repo, and set **Root Directory** to `frontend`.
3. Vercel auto-detects Vite. Under **Environment Variables**, add:
   - `VITE_API_URL` = `https://<your-render-service>.onrender.com`
4. Click **Deploy**. Once live, copy the Vercel URL (e.g. `https://medipredict.vercel.app`).

### 3. Lock down CORS

Back in the Render dashboard, open the `medipredict-api` service → **Environment** → set:
- `CORS_ORIGINS` = `https://medipredict.vercel.app`

Save and let the service redeploy. The backend will now only accept requests from your Vercel frontend.

### Alternative: Railway / Fly.io

The backend ships with a [Procfile](backend/Procfile) and pinned [runtime.txt](backend/runtime.txt), so any Heroku-style platform works. Set the root directory to `backend/` and the platform will run `python train_model.py` (release) and `gunicorn ... app:app` (web).

### Alternative: Self-host with Docker

```bash
# Build (run from project root, the Dockerfile expects this layout)
docker build -f backend/Dockerfile -t medipredict-api .

# Run
docker run -p 8000:8000 -e CORS_ORIGINS="*" medipredict-api
```

Then build the frontend with `VITE_API_URL=http://your-host:8000 npm run build` and serve `frontend/dist/` from any static host (Nginx, Caddy, S3, etc.).

---

## License

MIT — free for educational and portfolio use.
