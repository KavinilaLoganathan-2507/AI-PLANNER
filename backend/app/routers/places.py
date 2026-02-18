from fastapi import APIRouter, Query
from typing import List, Dict, Any

from app.models import PlaceInfo
from app.services.places_service import (
    search_places,
    get_place_details,
    autocomplete_places,
    get_top_restaurants,
    get_top_attractions,
)
from app.services.maps_service import get_directions, geocode

router = APIRouter()


@router.get("/autocomplete")
async def place_autocomplete(
    input: str = Query(..., min_length=2),
    types: str = Query(default="(cities)"),
) -> List[Dict[str, str]]:
    """Get place autocomplete suggestions."""
    return await autocomplete_places(input, types)


@router.get("/search", response_model=List[PlaceInfo])
async def search(
    query: str = Query(..., min_length=2),
    type: str = Query(default=None),
    min_rating: float = Query(default=4.0, ge=0, le=5),
    max_results: int = Query(default=10, ge=1, le=20),
) -> List[PlaceInfo]:
    """Search for places using Google Places API."""
    return await search_places(
        query=query,
        place_type=type,
        min_rating=min_rating,
        max_results=max_results,
    )


@router.get("/restaurants")
async def top_restaurants(
    destination: str = Query(..., min_length=2),
    max_results: int = Query(default=8, ge=1, le=20),
) -> List[PlaceInfo]:
    """Get top-rated restaurants at a destination."""
    return await get_top_restaurants(destination, max_results)


@router.get("/attractions")
async def top_attractions(
    destination: str = Query(..., min_length=2),
    max_results: int = Query(default=10, ge=1, le=20),
) -> List[PlaceInfo]:
    """Get top-rated tourist attractions at a destination."""
    return await get_top_attractions(destination, max_results)


@router.get("/details/{place_id}")
async def place_details(place_id: str) -> Dict[str, Any]:
    """Get detailed info about a specific place."""
    details = await get_place_details(place_id)
    if not details:
        return {"error": "Place not found"}
    return details


@router.get("/directions")
async def directions(
    origin: str = Query(...),
    destination: str = Query(...),
    mode: str = Query(default="driving"),
) -> Dict[str, Any]:
    """Get directions between two places."""
    result = await get_directions(origin, destination, mode)
    if not result:
        return {"error": "Could not find directions"}
    return result


@router.get("/geocode")
async def geocode_address(address: str = Query(...)) -> Dict[str, Any]:
    """Geocode an address to lat/lng."""
    result = await geocode(address)
    if not result:
        return {"error": "Could not geocode address"}
    return result
