#!/bin/bash
# ============================================================
# TripStellar - GCP Cloud Run Deployment Script
# ============================================================
# Prerequisites:
#   1. Google Cloud SDK (gcloud) installed and authenticated
#   2. Docker installed
#   3. Required GCP APIs enabled (Cloud Run, Artifact Registry, etc.)
# ============================================================

set -e

# ── Configuration ──
PROJECT_ID="${GCP_PROJECT_ID:?Set GCP_PROJECT_ID env variable}"
REGION="${GCP_REGION:-us-central1}"
BACKEND_SERVICE="tripstellar-backend"
FRONTEND_SERVICE="tripstellar-frontend"
REPO_NAME="tripstellar"
REGISTRY="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO_NAME}"

echo "🚀 Deploying TripStellar to GCP Cloud Run"
echo "   Project: ${PROJECT_ID}"
echo "   Region:  ${REGION}"
echo ""

# ── Step 1: Create Artifact Registry (if not exists) ──
echo "📦 Setting up Artifact Registry..."
gcloud artifacts repositories create ${REPO_NAME} \
  --repository-format=docker \
  --location=${REGION} \
  --project=${PROJECT_ID} 2>/dev/null || echo "   Repository already exists"

# Configure Docker for Artifact Registry
gcloud auth configure-docker ${REGION}-docker.pkg.dev --quiet

# ── Step 2: Build & Push Backend ──
echo ""
echo "🔧 Building backend..."
docker build -t ${REGISTRY}/backend:latest ./backend
docker push ${REGISTRY}/backend:latest

# ── Step 3: Deploy Backend to Cloud Run ──
echo ""
echo "☁️  Deploying backend to Cloud Run..."
gcloud run deploy ${BACKEND_SERVICE} \
  --image=${REGISTRY}/backend:latest \
  --platform=managed \
  --region=${REGION} \
  --project=${PROJECT_ID} \
  --allow-unauthenticated \
  --port=8080 \
  --memory=1Gi \
  --cpu=1 \
  --min-instances=0 \
  --max-instances=10 \
  --set-env-vars="GCP_PROJECT_ID=${PROJECT_ID},GCP_LOCATION=${REGION}" \
  --quiet

# Get backend URL
BACKEND_URL=$(gcloud run services describe ${BACKEND_SERVICE} \
  --platform=managed --region=${REGION} --project=${PROJECT_ID} \
  --format="value(status.url)")
echo "   Backend URL: ${BACKEND_URL}"

# ── Step 4: Build & Push Frontend ──
echo ""
echo "🔧 Building frontend..."
docker build \
  --build-arg NEXT_PUBLIC_API_URL=${BACKEND_URL} \
  --build-arg NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=${GOOGLE_MAPS_API_KEY:-} \
  -t ${REGISTRY}/frontend:latest \
  ./frontend
docker push ${REGISTRY}/frontend:latest

# ── Step 5: Deploy Frontend to Cloud Run ──
echo ""
echo "☁️  Deploying frontend to Cloud Run..."
gcloud run deploy ${FRONTEND_SERVICE} \
  --image=${REGISTRY}/frontend:latest \
  --platform=managed \
  --region=${REGION} \
  --project=${PROJECT_ID} \
  --allow-unauthenticated \
  --port=3000 \
  --memory=512Mi \
  --cpu=1 \
  --min-instances=0 \
  --max-instances=5 \
  --quiet

FRONTEND_URL=$(gcloud run services describe ${FRONTEND_SERVICE} \
  --platform=managed --region=${REGION} --project=${PROJECT_ID} \
  --format="value(status.url)")

echo ""
echo "============================================================"
echo "✅ Deployment Complete!"
echo ""
echo "   Frontend: ${FRONTEND_URL}"
echo "   Backend:  ${BACKEND_URL}"
echo "   API Docs: ${BACKEND_URL}/docs"
echo "============================================================"
