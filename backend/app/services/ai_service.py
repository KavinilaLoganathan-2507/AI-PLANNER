"""
AI Trip Planner Service
Uses LangChain as orchestrator with Gemini 2.5 Flash from Vertex AI
to generate personalized travel itineraries.
"""

import json
from typing import Dict, Any, List
from datetime import datetime

from langchain_google_vertexai import ChatVertexAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser

from app.config import settings
from app.models import TripRequest, TripItinerary
from app.services.places_service import get_destination_data


def _get_llm():
    """Initialize Gemini 2.5 Flash via Vertex AI."""
    return ChatVertexAI(
        model="gemini-2.5-flash-preview-04-17",
        project=settings.GCP_PROJECT_ID,
        location=settings.GCP_LOCATION,
        temperature=0.7,
        max_output_tokens=8192,
        top_p=0.95,
    )


TRIP_PLANNER_PROMPT = ChatPromptTemplate.from_messages([
    ("system", """You are TripStellar AI, an expert travel planner. You create detailed,
personalized travel itineraries using real place data provided to you.

IMPORTANT RULES:
1. Use the REAL restaurant and attraction data provided — include their actual names, ratings, and addresses.
2. Create a day-by-day itinerary with specific times, activities, restaurant recommendations, and travel tips.
3. Be practical with timing — account for travel between locations.
4. Match the travel style and budget preferences of the traveler.
5. Include local tips, cultural notes, and money-saving advice.
6. Always respond with valid JSON matching the exact schema specified.
"""),
    ("human", """Plan a trip with the following details:

**Destination:** {destination}
**Dates:** {start_date} to {end_date} ({total_days} days)
**Travelers:** {travelers} person(s)
**Budget Level:** {budget}
**Travel Style:** {travel_style}
**Interests:** {interests}
**Special Requirements:** {special_requirements}

**REAL DATA FROM GOOGLE PLACES API:**

Top-Rated Restaurants:
{restaurants_data}

Top Tourist Attractions:
{attractions_data}

Hotels:
{hotels_data}

---

Generate a complete travel itinerary as JSON with this EXACT structure:
{{
    "destination": "string - destination name",
    "summary": "string - 2-3 sentence trip summary",
    "total_days": number,
    "best_time_to_visit": "string",
    "currency": "string - local currency",
    "language": "string - primary language",
    "travel_tips": ["string array of 5-8 travel tips"],
    "packing_list": ["string array of 8-12 packing items"],
    "estimated_total_budget": "string - total estimated cost",
    "emergency_contacts": {{"police": "number", "ambulance": "number", "tourist_helpline": "number"}},
    "days": [
        {{
            "day": 1,
            "date": "YYYY-MM-DD",
            "theme": "string - theme for the day",
            "activities": [
                {{
                    "time": "09:00 AM",
                    "title": "string",
                    "description": "string - detailed description",
                    "duration": "string - e.g. 2 hours",
                    "place": {{
                        "name": "string - actual place name from data",
                        "address": "string",
                        "rating": number,
                        "latitude": number,
                        "longitude": number
                    }},
                    "tips": "string - insider tip",
                    "estimated_cost": "string"
                }}
            ],
            "meals": [
                {{
                    "time": "12:30 PM",
                    "title": "Lunch at [Restaurant Name]",
                    "description": "string",
                    "place": {{
                        "name": "string - actual restaurant name from data",
                        "address": "string",
                        "rating": number,
                        "latitude": number,
                        "longitude": number
                    }},
                    "estimated_cost": "string"
                }}
            ],
            "accommodation_tip": "string"
        }}
    ],
    "top_restaurants": [
        {{
            "name": "string",
            "address": "string",
            "rating": number,
            "total_ratings": number,
            "latitude": number,
            "longitude": number
        }}
    ],
    "top_attractions": [
        {{
            "name": "string",
            "address": "string",
            "rating": number,
            "total_ratings": number,
            "latitude": number,
            "longitude": number
        }}
    ]
}}

Use the REAL place data provided above. Include 3-5 activities and 2-3 meals per day.
Respond with ONLY the JSON, no markdown formatting or code blocks.
""")
])


def _format_places_for_prompt(places: List[Dict[str, Any]]) -> str:
    """Format place data into a readable string for the LLM."""
    if not places:
        return "No data available"

    lines = []
    for i, place in enumerate(places, 1):
        line = f"{i}. {place.get('name', 'Unknown')}"
        if place.get('rating'):
            line += f" (Rating: {place['rating']}⭐"
            if place.get('total_ratings'):
                line += f", {place['total_ratings']} reviews"
            line += ")"
        if place.get('address'):
            line += f"\n   Address: {place['address']}"
        if place.get('price_level') is not None:
            price_str = "$" * (place['price_level'] or 1)
            line += f"\n   Price: {price_str}"
        if place.get('types'):
            line += f"\n   Type: {', '.join(place['types'][:3])}"
        if place.get('latitude') and place.get('longitude'):
            line += f"\n   Coords: {place['latitude']}, {place['longitude']}"
        lines.append(line)

    return "\n".join(lines)


async def generate_trip_itinerary(trip_request: TripRequest) -> TripItinerary:
    """Generate a complete trip itinerary using LangChain + Gemini."""

    # 1. Fetch real destination data from Google Places API
    destination_data = await get_destination_data(
        trip_request.destination,
        trip_request.budget or "moderate",
    )

    # 2. Calculate total days
    start = datetime.strptime(trip_request.start_date, "%Y-%m-%d")
    end = datetime.strptime(trip_request.end_date, "%Y-%m-%d")
    total_days = max((end - start).days + 1, 1)

    # 3. Format data for prompt
    restaurants_text = _format_places_for_prompt(destination_data["restaurants"])
    attractions_text = _format_places_for_prompt(destination_data["attractions"])
    hotels_text = _format_places_for_prompt(destination_data["hotels"])

    travel_styles = ", ".join([s.value for s in (trip_request.travel_style or [])])
    interests = ", ".join(trip_request.interests or [])

    # 4. Build and invoke LangChain chain
    llm = _get_llm()
    parser = JsonOutputParser()
    chain = TRIP_PLANNER_PROMPT | llm | parser

    result = await chain.ainvoke({
        "destination": trip_request.destination,
        "start_date": trip_request.start_date,
        "end_date": trip_request.end_date,
        "total_days": total_days,
        "travelers": trip_request.travelers,
        "budget": trip_request.budget or "moderate",
        "travel_style": travel_styles or "cultural",
        "interests": interests or "general sightseeing",
        "special_requirements": trip_request.special_requirements or "none",
        "restaurants_data": restaurants_text,
        "attractions_data": attractions_text,
        "hotels_data": hotels_text,
    })

    # 5. Enrich with real Google Places data
    if destination_data["restaurants"]:
        result["top_restaurants"] = destination_data["restaurants"][:8]
    if destination_data["attractions"]:
        result["top_attractions"] = destination_data["attractions"][:10]

    # 6. Parse into TripItinerary model
    itinerary = TripItinerary(**result)
    return itinerary
