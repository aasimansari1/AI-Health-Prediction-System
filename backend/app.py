"""
app.py
------
Flask REST API that serves the trained disease-prediction Random Forest.

Endpoints:
    GET  /                  -> health check
    GET  /symptoms          -> list of supported symptoms (for the UI's checkbox list)
    GET  /diseases          -> all diseases with metadata (for the disease-details page)
    GET  /diseases/<name>   -> details for a single disease
    POST /predict           -> { symptoms: [...] } => top-3 predictions + best match details
"""

import json
import os
from pathlib import Path

import joblib
import numpy as np
from flask import Flask, jsonify, request
from flask_cors import CORS

ROOT = Path(__file__).resolve().parent.parent
MODEL_DIR = ROOT / "model"
DATASET_PATH = ROOT / "dataset" / "disease_symptoms.json"

app = Flask(__name__)

# In production set CORS_ORIGINS to your deployed frontend URL,
# e.g. "https://medipredict.vercel.app". Defaults to "*" for local dev.
_origins = os.environ.get("CORS_ORIGINS", "*")
CORS(app, resources={r"/*": {"origins": _origins}})

# Load model artifacts once at startup
try:
    model = joblib.load(MODEL_DIR / "rf_model.joblib")
    label_encoder = joblib.load(MODEL_DIR / "label_encoder.joblib")
    SYMPTOMS = joblib.load(MODEL_DIR / "symptom_list.joblib")
except FileNotFoundError as e:
    raise RuntimeError(
        "Model artifacts not found. Run `python train_model.py` first."
    ) from e

with open(DATASET_PATH, "r", encoding="utf-8") as f:
    DISEASE_DATA = json.load(f)["diseases"]

SYMPTOM_INDEX = {sym: i for i, sym in enumerate(SYMPTOMS)}


def vectorize(symptoms):
    """Turn a list of symptom strings into the binary feature vector the model expects."""
    vec = np.zeros(len(SYMPTOMS), dtype=np.int8)
    unknown = []
    for sym in symptoms:
        key = sym.strip().lower().replace(" ", "_")
        if key in SYMPTOM_INDEX:
            vec[SYMPTOM_INDEX[key]] = 1
        else:
            unknown.append(sym)
    return vec.reshape(1, -1), unknown


def disease_info(name):
    """Look up metadata for a disease, returning safe defaults if not found."""
    info = DISEASE_DATA.get(name, {})
    return {
        "disease": name,
        "description": info.get("description", "No description available."),
        "precautions": info.get("precautions", []),
        "severity": info.get("severity", "Unknown"),
        "icon": info.get("icon", "stethoscope"),
        "symptoms": info.get("symptoms", []),
    }


@app.route("/", methods=["GET"])
def health():
    return jsonify(
        {
            "status": "ok",
            "service": "AI Health Prediction System",
            "diseases_supported": len(DISEASE_DATA),
            "symptoms_supported": len(SYMPTOMS),
        }
    )


@app.route("/symptoms", methods=["GET"])
def symptoms():
    """Return the list of symptoms in both raw (model) form and human-readable label form."""
    return jsonify(
        {
            "symptoms": [
                {"id": s, "label": s.replace("_", " ").title()} for s in SYMPTOMS
            ]
        }
    )


@app.route("/diseases", methods=["GET"])
def diseases():
    return jsonify({"diseases": [disease_info(name) for name in DISEASE_DATA]})


@app.route("/diseases/<path:name>", methods=["GET"])
def disease_detail(name):
    if name not in DISEASE_DATA:
        return jsonify({"error": f"Disease '{name}' not found."}), 404
    return jsonify(disease_info(name))


@app.route("/predict", methods=["POST"])
def predict():
    payload = request.get_json(silent=True) or {}
    user_symptoms = payload.get("symptoms", [])

    if not isinstance(user_symptoms, list) or len(user_symptoms) == 0:
        return (
            jsonify({"error": "Request body must include a non-empty 'symptoms' list."}),
            400,
        )

    X, unknown = vectorize(user_symptoms)

    # predict_proba gives a probability for each known disease class
    probs = model.predict_proba(X)[0]
    classes = label_encoder.inverse_transform(np.arange(len(probs)))

    # Sort descending and take top-3
    order = np.argsort(probs)[::-1]
    top3 = []
    for idx in order[:3]:
        name = classes[idx]
        top3.append(
            {
                "disease": name,
                "confidence": float(probs[idx]),
                "severity": DISEASE_DATA.get(name, {}).get("severity", "Unknown"),
            }
        )

    best = disease_info(top3[0]["disease"])
    best["confidence"] = top3[0]["confidence"]

    return jsonify(
        {
            "disease": best["disease"],
            "confidence": best["confidence"],
            "description": best["description"],
            "precautions": best["precautions"],
            "severity": best["severity"],
            "icon": best["icon"],
            "top_predictions": top3,
            "input_symptoms": user_symptoms,
            "unknown_symptoms": unknown,
            "disclaimer": (
                "This system is for educational purposes only and not a substitute "
                "for professional medical advice."
            ),
        }
    )


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    debug = os.environ.get("FLASK_DEBUG", "1") == "1"
    app.run(host="0.0.0.0", port=port, debug=debug)
