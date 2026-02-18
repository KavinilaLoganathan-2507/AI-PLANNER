"""
Google Maps Directions / Distance Matrix Service
Used for route planning and travel time estimates.
"""

import httpx
from typing import Dict, Any, Optional, List
from app.config import settings

DIRECTIONS_URL = "https://maps.googleapis.com/maps/api/directions/json"
DISTANCE_URL = "https://maps.googleapis.com/maps/api/distancematrix/json"
GEOCODE_URL = "https://maps.googleapis.com/maps/api/geocode/json"


async def get_directions(
    origin: str,
    destination: str,
    mode: str = "driving",
) -> Optional[Dict[str, Any]]:
    """Get directions between two places."""
    params = {
        "origin": origin,
        "destination": destination,
        "mode": mode,
        "key": settings.GOOGLE_MAPS_API_KEY,
    }

    async with httpx.AsyncClient(timeout=15.0) as client:
        response = await client.get(DIRECTIONS_URL, params=params)
        data = response.json()

    if data.get("status") != "OK":
        return None

    route = data["routes"][0] if data.get("routes") else None
    if not route:
        return None

    leg = route["legs"][0]
    return {
        "distance": leg.get("distance", {}).get("text", ""),
        "duration": leg.get("duration", {}).get("text", ""),
        "start_address": leg.get("start_address", ""),
        "end_address": leg.get("end_address", ""),
        "steps": [
            {
                "instruction": step.get("html_instructions", ""),
                "distance": step.get("distance", {}).get("text", ""),
                "duration": step.get("duration", {}).get("text", ""),
            }
            for step in leg.get("steps", [])[:10]
        ],
    }


async def get_distance_matrix(
    origins: List[str],
    destinations: List[str],
    mode: str = "driving",
) -> Optional[Dict[str, Any]]:
    """Get distance matrix between multiple origins and destinations."""
    params = {
        "origins": "|".join(origins),
        "destinations": "|".join(destinations),
        "mode": mode,
        "key": settings.GOOGLE_MAPS_API_KEY,
    }

    async with httpx.AsyncClient(timeout=15.0) as client:
        response = await client.get(DISTANCE_URL, params=params)
        data = response.json()

    if data.get("status") != "OK":
        return None

    return data


async def geocode(address: str) -> Optional[Dict[str, float]]:
    """Get latitude/longitude for an address."""
    params = {
        "address": address,
        "key": settings.GOOGLE_MAPS_API_KEY,
    }

    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.get(GEOCODE_URL, params=params)
        data = response.json()

    if data.get("status") != "OK" or not data.get("results"):
        return None

    location = data["results"][0]["geometry"]["location"]
    return {
        "lat": location["lat"],
        "lng": location["lng"],
        "formatted_address": data["results"][0].get("formatted_address", ""),
    }
