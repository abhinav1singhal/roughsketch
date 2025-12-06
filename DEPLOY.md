# ☁️ Deploying to Google Cloud Run

This guide will help you deploy the "Mermaid to Rough.js" converter to Google Cloud Run.

## Prerequisites

1.  **Google Cloud SDK (`gcloud`)** installed and authenticated.
2.  A Google Cloud Project created and billing enabled.

## Steps

### 1. Set Project ID
Replace `YOUR_PROJECT_ID` with your actual Google Cloud Project ID.
```bash
gcloud config set project YOUR_PROJECT_ID
```

### 2. Enable Services
Enable the necessary APIs (Cloud Build and Cloud Run).
```bash
gcloud services enable cloudbuild.googleapis.com run.googleapis.com
```

### 3. Deploy
Run the following command to build the container remotely (using Cloud Build) and deploy it to Cloud Run in one step.

*   `SERVICE_NAME`: e.g., `roughsketch`
*   `REGION`: e.g., `us-central1`

```bash
gcloud run deploy roughsketch \
    --source . \
    --platform managed \
    --region us-central1 \
    --allow-unauthenticated
```

### 4. Verify
After the deployment finishes, the terminal will show a **Service URL** (e.g., `https://mermaid-rough-converter-xxxxx-uc.a.run.app`). Click it to see your live app!

## Manual Build (Optional)
If you prefer to build the image locally and push to Artifact Registry:
```bash
# Tag the image
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/mermaid-rough-converter .

# Deploy the image
gcloud run deploy mermaid-rough-converter \
    --image gcr.io/YOUR_PROJECT_ID/mermaid-rough-converter \
    --platform managed \
    --region us-central1 \
    --allow-unauthenticated
```
