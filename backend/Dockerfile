FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

# Install Python deps first for better layer caching
COPY backend/requirements.txt /app/backend/requirements.txt
RUN pip install -r /app/backend/requirements.txt

# Copy the rest of the project (backend code, dataset, model dir)
COPY backend /app/backend
COPY dataset /app/dataset

# Train the model at build time so the artifact is baked into the image
RUN python /app/backend/train_model.py

WORKDIR /app/backend

EXPOSE 8000
ENV PORT=8000

CMD ["sh", "-c", "gunicorn --bind 0.0.0.0:$PORT --workers 2 --timeout 60 app:app"]
