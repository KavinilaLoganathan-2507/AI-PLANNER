# 🚀 TripStellar — AI-Powered Travel Planner

<div align="center">

**Plan your dream trip with AI magic.** Get personalized day-by-day itineraries with top-rated restaurants, attractions, and local tips — powered by Google Gemini AI and real Google Places data.

[Live Demo](https://tripstellar.web.app) · [API Docs](http://localhost:8080/docs) · [Report Bug](#) · [Request Feature](#)

</div>

---

## ✨ Features

- **AI Itinerary Generation** — Gemini 2.5 Flash creates personalized day-by-day travel plans
- **Real Google Places Data** — Top-rated restaurants, attractions, and hotels from Google Places API
- **Interactive Maps** — Google Maps integration showing all recommended spots
- **Smart Recommendations** — High-rating spots and restaurants based on actual reviews
- **Multi-Step Trip Planner** — Choose destination, dates, budget, travel style, and interests
- **User Authentication** — JWT-based auth with saved trip history
- **Explore Page** — Discover restaurants and attractions for any city worldwide
- **Responsive UI** — Beautiful glassmorphism design that works on all devices
- **Travel Tips & Packing Lists** — AI-generated practical travel advice
- **Budget Estimates** — Cost breakdowns for activities and meals

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14, React 18, TypeScript, Tailwind CSS, Framer Motion |
| **Backend** | FastAPI, Python 3.11, Pydantic |
| **AI Model** | Gemini 2.5 Flash (Google Vertex AI) |
| **Orchestrator** | LangChain |
| **APIs** | Google Places API, Google Maps API |
| **Database** | MongoDB (via Motor async driver) |
| **Auth** | JWT (python-jose + bcrypt) |
| **State Mgmt** | Zustand |
| **Hosting** | GCP Cloud Run |
| **CI/CD** | Google Cloud Build |

---

## 📁 Project Structure

```
TripStellar/
├── backend/                    # FastAPI Backend
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py            # FastAPI app entry point
│   │   ├── config.py          # Environment/settings config
│   │   ├── database.py        # MongoDB connection (Motor)
│   │   ├── models.py          # Pydantic models/schemas
│   │   ├── routers/
│   │   │   ├── auth.py        # Auth endpoints (register/login)
│   │   │   ├── trips.py       # Trip CRUD + AI generation
│   │   │   ├── places.py      # Google Places API endpoints
│   │   │   └── health.py      # Health check
│   │   └── services/
│   │       ├── ai_service.py  # LangChain + Gemini integration
│   │       ├── places_service.py  # Google Places API wrapper
│   │       ├── maps_service.py    # Google Maps/Directions API
│   │       └── auth_service.py    # JWT + password hashing
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
├── frontend/                   # Next.js Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx     # Root layout
│   │   │   ├── page.tsx       # Home — Hero + Trip Planner
│   │   │   ├── globals.css    # Tailwind + custom styles
│   │   │   ├── explore/
│   │   │   │   └── page.tsx   # Explore destinations
│   │   │   └── my-trips/
│   │   │       └── page.tsx   # Saved trips
│   │   ├── components/
│   │   │   ├── Navbar.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   ├── TripPlannerForm.tsx
│   │   │   ├── ItineraryView.tsx
│   │   │   ├── MapView.tsx
│   │   │   ├── AuthModal.tsx
│   │   │   └── Footer.tsx
│   │   ├── lib/
│   │   │   ├── api.ts         # Axios API client
│   │   │   └── store.ts       # Zustand global state
│   │   └── types/
│   │       └── index.ts       # TypeScript type definitions
│   ├── package.json
│   ├── Dockerfile
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── .env.example
├── docker-compose.yml          # Local dev (MongoDB + Backend + Frontend)
├── deploy.sh                   # GCP Cloud Run deployment script
├── cloudbuild.yaml             # Google Cloud Build CI/CD
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Python 3.11+**
- **Node.js 18+** (or 20)
- **MongoDB** (local or Atlas)
- **GCP Account** with:
  - Maps JavaScript API enabled
  - Places API enabled
  - Vertex AI API enabled
  - A service account with Vertex AI permissions

### 1. Clone the repository

```bash
git clone https://github.com/your-username/tripstellar.git
cd tripstellar
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your actual keys:
#   - GOOGLE_MAPS_API_KEY
#   - GCP_PROJECT_ID
#   - GOOGLE_APPLICATION_CREDENTIALS (path to service account JSON)
#   - MONGODB_URL
#   - JWT_SECRET_KEY

# Run the backend
uvicorn app.main:app --reload --port 8080
```

The API will be available at `http://localhost:8080` with Swagger docs at `http://localhost:8080/docs`.

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local:
#   - NEXT_PUBLIC_API_URL=http://localhost:8080
#   - NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-key

# Run the dev server
npm run dev
```

The frontend will be available at `http://localhost:3000`.

### 4. Quick Start with Docker Compose

```bash
# From project root
cp backend/.env.example backend/.env
# Edit backend/.env with your keys

docker-compose up --build
```

This starts MongoDB, the backend, and frontend together.

---

## 🔑 GCP Setup Guide

### Enable Required APIs

```bash
gcloud services enable \
  maps-backend.googleapis.com \
  places-backend.googleapis.com \
  aiplatform.googleapis.com \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  artifactregistry.googleapis.com
```

### Create an API Key (for Maps & Places)

1. Go to [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials)
2. Click **Create Credentials → API Key**
3. Restrict it to: Maps JavaScript API, Places API
4. Copy the key to your `.env` files

### Create a Service Account (for Vertex AI)

```bash
gcloud iam service-accounts create tripstellar-ai \
  --display-name="TripStellar AI Service Account"

gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:tripstellar-ai@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/aiplatform.user"

gcloud iam service-accounts keys create service-account.json \
  --iam-account=tripstellar-ai@YOUR_PROJECT_ID.iam.gserviceaccount.com
```

Set `GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account.json` in your backend `.env`.

---

## ☁️ Deploy to GCP Cloud Run

### Option A: Deploy Script

```bash
export GCP_PROJECT_ID=your-project-id
export GOOGLE_MAPS_API_KEY=your-maps-key
bash deploy.sh
```

### Option B: Cloud Build (CI/CD)

```bash
gcloud builds submit \
  --config=cloudbuild.yaml \
  --substitutions=_BACKEND_URL="https://your-backend.run.app",_MAPS_API_KEY="your-key"
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check |
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login and get JWT |
| `POST` | `/api/trips/generate` | Generate AI itinerary |
| `GET` | `/api/trips/` | Get user's saved trips |
| `GET` | `/api/trips/{id}` | Get specific trip |
| `DELETE` | `/api/trips/{id}` | Delete a trip |
| `GET` | `/api/places/autocomplete` | Place autocomplete |
| `GET` | `/api/places/search` | Search places |
| `GET` | `/api/places/restaurants` | Top restaurants |
| `GET` | `/api/places/attractions` | Top attractions |
| `GET` | `/api/places/details/{id}` | Place details |
| `GET` | `/api/places/directions` | Get directions |
| `GET` | `/api/places/geocode` | Geocode address |

---

## 🧠 How It Works

```
User Input → TripPlannerForm
                   ↓
            FastAPI Backend
                   ↓
    ┌──────────────┼──────────────┐
    ↓              ↓              ↓
Google Places   Google Maps    Google Places
(Restaurants)  (Directions)   (Attractions)
    ↓              ↓              ↓
    └──────────────┼──────────────┘
                   ↓
         LangChain Orchestrator
                   ↓
        Gemini 2.5 Flash (Vertex AI)
                   ↓
         Structured JSON Itinerary
                   ↓
          Save to MongoDB + Return
                   ↓
          ItineraryView (Frontend)
```

1. **User fills out the trip planner form** (destination, dates, budget, style, interests)
2. **Backend fetches real data** from Google Places API (restaurants, attractions, hotels)
3. **LangChain feeds the real data** + user preferences to Gemini 2.5 Flash
4. **Gemini generates a structured JSON itinerary** with day-by-day plans
5. **Response is enriched** with real Place photos, ratings, and coordinates
6. **Frontend renders** the itinerary with timeline view, maps, and sidebars

---

## 📄 License

MIT License — feel free to use this for your projects.

---

## 🙏 Acknowledgments

- [Google Cloud Platform](https://cloud.google.com/) — Maps, Places, Vertex AI
- [LangChain](https://langchain.com/) — LLM orchestration framework
- [Next.js](https://nextjs.org/) — React framework
- [FastAPI](https://fastapi.tiangolo.com/) — Python API framework
- [Tailwind CSS](https://tailwindcss.com/) — Utility-first CSS
- [Framer Motion](https://www.framer.com/motion/) — Animations
