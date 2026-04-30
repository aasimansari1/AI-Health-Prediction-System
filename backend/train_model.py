"""
train_model.py
--------------
Generates a synthetic symptom-disease training set from `dataset/disease_symptoms.json`,
trains a Random Forest classifier, and saves the model + label encoder + symptom list
to the `model/` directory so the Flask backend can load them.

Run once before starting the server:
    python train_model.py
"""

import json
import os
import random
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder

ROOT = Path(__file__).resolve().parent.parent
DATASET_PATH = ROOT / "dataset" / "disease_symptoms.json"
MODEL_DIR = ROOT / "model"
MODEL_DIR.mkdir(exist_ok=True)

# Reproducible synthetic-data generation
RANDOM_SEED = 42
random.seed(RANDOM_SEED)
np.random.seed(RANDOM_SEED)

# How many synthetic patient records to generate per disease
SAMPLES_PER_DISEASE = 200

# Probability that a given "core" symptom of a disease appears in a sample (true-positive rate)
SYMPTOM_PRESENCE_PROB = 0.85
# Probability that a random non-core symptom is added as noise (false-positive rate)
NOISE_PROB = 0.04


def load_dataset():
    with open(DATASET_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def generate_synthetic_data(data):
    """
    Build a binary feature matrix where each row is a synthetic patient and each column
    is one of the symptoms from `all_symptoms`. The label is the disease name.

    Each disease's "core" symptoms are present with high probability; a small amount of
    noise from other symptoms is added so the model learns realistic, overlapping patterns
    rather than memorising one-hot mappings.
    """
    all_symptoms = data["all_symptoms"]
    diseases = data["diseases"]
    symptom_index = {sym: i for i, sym in enumerate(all_symptoms)}

    rows = []
    labels = []

    for disease_name, info in diseases.items():
        core_symptoms = info["symptoms"]
        for _ in range(SAMPLES_PER_DISEASE):
            vec = np.zeros(len(all_symptoms), dtype=np.int8)

            # Activate core symptoms probabilistically
            for sym in core_symptoms:
                if sym in symptom_index and random.random() < SYMPTOM_PRESENCE_PROB:
                    vec[symptom_index[sym]] = 1

            # Add noisy false-positive symptoms
            for sym, idx in symptom_index.items():
                if vec[idx] == 0 and random.random() < NOISE_PROB:
                    vec[idx] = 1

            # Guard: ensure at least one symptom is set, otherwise re-add a random core symptom
            if vec.sum() == 0 and core_symptoms:
                pick = random.choice(core_symptoms)
                if pick in symptom_index:
                    vec[symptom_index[pick]] = 1

            rows.append(vec)
            labels.append(disease_name)

    X = pd.DataFrame(rows, columns=all_symptoms)
    y = np.array(labels)
    return X, y, all_symptoms


def train_and_save(X, y, all_symptoms):
    encoder = LabelEncoder()
    y_encoded = encoder.fit_transform(y)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y_encoded, test_size=0.2, random_state=RANDOM_SEED, stratify=y_encoded
    )

    model = RandomForestClassifier(
        n_estimators=300,
        max_depth=None,
        min_samples_leaf=2,
        n_jobs=-1,
        random_state=RANDOM_SEED,
    )
    model.fit(X_train, y_train)

    preds = model.predict(X_test)
    acc = accuracy_score(y_test, preds)
    print(f"\nTraining complete. Test accuracy: {acc:.4f}\n")
    print(classification_report(y_test, preds, target_names=encoder.classes_, zero_division=0))

    joblib.dump(model, MODEL_DIR / "rf_model.joblib")
    joblib.dump(encoder, MODEL_DIR / "label_encoder.joblib")
    joblib.dump(all_symptoms, MODEL_DIR / "symptom_list.joblib")
    print(f"Saved model artifacts to: {MODEL_DIR}")


def main():
    print("Loading dataset...")
    data = load_dataset()
    print(f"Found {len(data['diseases'])} diseases and {len(data['all_symptoms'])} symptoms.")

    print("Generating synthetic training data...")
    X, y, all_symptoms = generate_synthetic_data(data)
    print(f"Generated {len(X)} samples.")

    print("Training Random Forest classifier...")
    train_and_save(X, y, all_symptoms)


if __name__ == "__main__":
    main()
