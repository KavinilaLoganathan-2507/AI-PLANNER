from fastapi import APIRouter, HTTPException, Depends, status
from datetime import datetime, timezone
from typing import List, Optional
from bson import ObjectId

from app.models import TripRequest, TripResponse, TripItinerary
from app.services.ai_service import generate_trip_itinerary
from app.services.auth_service import get_current_user
from app.database import get_db

router = APIRouter()


@router.post("/generate", response_model=TripResponse, status_code=status.HTTP_201_CREATED)
async def generate_trip(trip_request: TripRequest, user=Depends(get_current_user)):
    """
    Generate an AI-powered travel itinerary.
    Fetches real data from Google Places API, then uses Gemini 2.5 Flash
    via LangChain to create a personalized day-by-day plan.
    """
    try:
        # Generate itinerary using AI + real Places data
        itinerary = await generate_trip_itinerary(trip_request)

        # Save to database
        db = get_db()
        trip_doc = {
            "user_id": str(user["_id"]) if user else None,
            "request": trip_request.model_dump(),
            "itinerary": itinerary.model_dump(),
            "created_at": datetime.now(timezone.utc),
        }

        result = await db.trips.insert_one(trip_doc)

        return TripResponse(
            id=str(result.inserted_id),
            user_id=trip_doc["user_id"],
            request=trip_request,
            itinerary=itinerary,
            created_at=trip_doc["created_at"],
        )

    except Exception as e:
        print(f"Error generating trip: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate itinerary: {str(e)}",
        )


@router.get("/", response_model=List[TripResponse])
async def get_user_trips(user=Depends(get_current_user)):
    """Get all trips for the authenticated user."""
    if not user:
        raise HTTPException(status_code=401, detail="Authentication required")

    db = get_db()
    cursor = db.trips.find({"user_id": str(user["_id"])}).sort("created_at", -1).limit(50)
    trips = []

    async for doc in cursor:
        trips.append(
            TripResponse(
                id=str(doc["_id"]),
                user_id=doc.get("user_id"),
                request=TripRequest(**doc["request"]),
                itinerary=TripItinerary(**doc["itinerary"]),
                created_at=doc["created_at"],
            )
        )

    return trips


@router.get("/{trip_id}", response_model=TripResponse)
async def get_trip(trip_id: str, user=Depends(get_current_user)):
    """Get a specific trip by ID."""
    db = get_db()

    try:
        doc = await db.trips.find_one({"_id": ObjectId(trip_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid trip ID")

    if not doc:
        raise HTTPException(status_code=404, detail="Trip not found")

    return TripResponse(
        id=str(doc["_id"]),
        user_id=doc.get("user_id"),
        request=TripRequest(**doc["request"]),
        itinerary=TripItinerary(**doc["itinerary"]),
        created_at=doc["created_at"],
    )


@router.delete("/{trip_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_trip(trip_id: str, user=Depends(get_current_user)):
    """Delete a trip (owner only)."""
    if not user:
        raise HTTPException(status_code=401, detail="Authentication required")

    db = get_db()

    try:
        result = await db.trips.delete_one({
            "_id": ObjectId(trip_id),
            "user_id": str(user["_id"]),
        })
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid trip ID")

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Trip not found or not authorized")
