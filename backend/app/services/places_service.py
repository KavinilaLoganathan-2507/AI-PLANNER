"""
Google Places API Service
Fetches high-rated spots, restaurants, and attractions using the GCP Places API.
"""

import httpx
import asyncio
from typing import List, Optional, Dict, Any
from cachetools import TTLCache

from app.config import settings
from app.models import PlaceInfo

# Cache results for 1 hour to reduce API calls
_place_cache = TTLCache(maxsize=500, ttl=3600)

BASE_URL = "https://maps.googleapis.com/maps/api/place"


async def search_places(
    query: str,
    location: Optional[str] = None,
    radius: int = 10000,
    place_type: Optional[str] = None,
    min_rating: float = 4.0,
    max_results: int = 10,
) -> List[PlaceInfo]:
    """Search for places using Google Places Text Search API."""
    cache_key = f"{query}:{location}:{place_type}:{min_rating}"
    if cache_key in _place_cache:
        return _place_cache[cache_key]

    params = {
        "query": query,
        "key": settings.GOOGLE_MAPS_API_KEY,
    }
    if location:
        params["location"] = location
        params["radius"] = radius
    if place_type:
        params["type"] = place_type

    async with httpx.AsyncClient(timeout=15.0) as client:
        response = await client.get(f"{BASE_URL}/textsearch/json", params=params)
        data = response.json()

    if data.get("status") != "OK":
        print(f"Places API error: {data.get('status')} - {data.get('error_message', '')}")
        return []

    places = []
    for result in data.get("results", [])[:max_results]:
        rating = result.get("rating", 0)
        if rating < min_rating:
            continue

        photo_url = ""
        if result.get("photos"):
            photo_ref = result["photos"][0].get("photo_reference", "")
            if photo_ref:
                photo_url = (
                    f"{BASE_URL}/photo?maxwidth=800&photo_reference={photo_ref}"
                    f"&key={settings.GOOGLE_MAPS_API_KEY}"
                )

        place = PlaceInfo(
            name=result.get("name", ""),
            address=result.get("formatted_address", ""),
            rating=rating,
            total_ratings=result.get("user_ratings_total", 0),
            price_level=result.get("price_level"),
            types=result.get("types", []),
            photo_url=photo_url,
            place_id=result.get("place_id", ""),
            latitude=result.get("geometry", {}).get("location", {}).get("lat"),
            longitude=result.get("geometry", {}).get("location", {}).get("lng"),
        )
        places.append(place)

    # Sort by rating descending
    places.sort(key=lambda p: (p.rating or 0, p.total_ratings or 0), reverse=True)
    _place_cache[cache_key] = places
    return places


async def get_place_details(place_id: str) -> Optional[Dict[str, Any]]:
    """Get detailed information about a specific place."""
    cache_key = f"detail:{place_id}"
    if cache_key in _place_cache:
        return _place_cache[cache_key]

    params = {
        "place_id": place_id,
        "fields": "name,formatted_address,rating,user_ratings_total,price_level,"
                  "types,photos,geometry,opening_hours,website,formatted_phone_number,"
                  "reviews,url",
        "key": settings.GOOGLE_MAPS_API_KEY,
    }

    async with httpx.AsyncClient(timeout=15.0) as client:
        response = await client.get(f"{BASE_URL}/details/json", params=params)
        data = response.json()

    if data.get("status") != "OK":
        return None

    result = data.get("result", {})
    _place_cache[cache_key] = result
    return result


async def autocomplete_places(input_text: str, types: str = "(cities)") -> List[Dict[str, str]]:
    """Get autocomplete suggestions for place search."""
    params = {
        "input": input_text,
        "types": types,
        "key": settings.GOOGLE_MAPS_API_KEY,
    }

    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.get(f"{BASE_URL}/autocomplete/json", params=params)
        data = response.json()

    if data.get("status") != "OK":
        return []

    suggestions = []
    for prediction in data.get("predictions", []):
        suggestions.append({
            "description": prediction.get("description", ""),
            "place_id": prediction.get("place_id", ""),
            "main_text": prediction.get("structured_formatting", {}).get("main_text", ""),
            "secondary_text": prediction.get("structured_formatting", {}).get("secondary_text", ""),
        })

    return suggestions


async def get_top_restaurants(destination: str, max_results: int = 8) -> List[PlaceInfo]:
    """Get top-rated restaurants at a destination."""
    return await search_places(
        query=f"best restaurants in {destination}",
        place_type="restaurant",
        min_rating=4.0,
        max_results=max_results,
    )


async def get_top_attractions(destination: str, max_results: int = 10) -> List[PlaceInfo]:
    """Get top-rated tourist attractions at a destination."""
    return await search_places(
        query=f"top tourist attractions in {destination}",
        place_type="tourist_attraction",
        min_rating=4.0,
        max_results=max_results,
    )


async def get_hotels(destination: str, budget: str = "moderate", max_results: int = 5) -> List[PlaceInfo]:
    """Get hotels at a destination based on budget."""
    budget_query = {
        "budget": f"budget hotels in {destination}",
        "moderate": f"good hotels in {destination}",
        "luxury": f"luxury hotels in {destination}",
    }
    query = budget_query.get(budget, budget_query["moderate"])
    return await search_places(
        query=query,
        place_type="lodging",
        min_rating=3.5,
        max_results=max_results,
    )


async def get_destination_data(destination: str, budget: str = "moderate") -> Dict[str, Any]:
    """Fetch all destination data in parallel for AI processing."""
    restaurants, attractions, hotels = await asyncio.gather(
        get_top_restaurants(destination),
        get_top_attractions(destination),
        get_hotels(destination, budget),
    )

    return {
        "restaurants": [r.model_dump() for r in restaurants],
        "attractions": [a.model_dump() for a in attractions],
        "hotels": [h.model_dump() for h in hotels],
    }
