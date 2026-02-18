from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum


# ── Auth Models ──

class UserCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: str = Field(..., min_length=5, max_length=100)
    password: str = Field(..., min_length=6)


class UserLogin(BaseModel):
    email: str
    password: str


class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    created_at: datetime


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


# ── Trip Models ──

class TravelStyle(str, Enum):
    ADVENTURE = "adventure"
    CULTURAL = "cultural"
    RELAXATION = "relaxation"
    FOODIE = "foodie"
    FAMILY = "family"
    ROMANTIC = "romantic"
    BUDGET = "budget"
    LUXURY = "luxury"


class TripRequest(BaseModel):
    destination: str = Field(..., min_length=2, max_length=200)
    start_date: str = Field(..., description="Start date in YYYY-MM-DD format")
    end_date: str = Field(..., description="End date in YYYY-MM-DD format")
    travelers: int = Field(default=1, ge=1, le=20)
    budget: Optional[str] = Field(default="moderate", description="Budget level: budget, moderate, luxury")
    travel_style: Optional[List[TravelStyle]] = Field(default=[TravelStyle.CULTURAL])
    interests: Optional[List[str]] = Field(default=[])
    special_requirements: Optional[str] = Field(default="")


class PlaceInfo(BaseModel):
    name: str
    address: Optional[str] = ""
    rating: Optional[float] = 0.0
    total_ratings: Optional[int] = 0
    price_level: Optional[int] = None
    types: Optional[List[str]] = []
    photo_url: Optional[str] = ""
    place_id: Optional[str] = ""
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    opening_hours: Optional[List[str]] = []
    website: Optional[str] = ""


class Activity(BaseModel):
    time: str
    title: str
    description: str
    duration: Optional[str] = ""
    place: Optional[PlaceInfo] = None
    tips: Optional[str] = ""
    estimated_cost: Optional[str] = ""


class DayPlan(BaseModel):
    day: int
    date: str
    theme: str
    activities: List[Activity]
    meals: Optional[List[Activity]] = []
    accommodation_tip: Optional[str] = ""


class TripItinerary(BaseModel):
    destination: str
    summary: str
    total_days: int
    best_time_to_visit: Optional[str] = ""
    currency: Optional[str] = ""
    language: Optional[str] = ""
    travel_tips: Optional[List[str]] = []
    packing_list: Optional[List[str]] = []
    estimated_total_budget: Optional[str] = ""
    emergency_contacts: Optional[Dict[str, str]] = {}
    days: List[DayPlan]
    top_restaurants: Optional[List[PlaceInfo]] = []
    top_attractions: Optional[List[PlaceInfo]] = []


class TripResponse(BaseModel):
    id: str
    user_id: Optional[str] = None
    request: TripRequest
    itinerary: TripItinerary
    created_at: datetime


class PlaceSearchRequest(BaseModel):
    query: str
    location: Optional[str] = None
    radius: Optional[int] = 5000
    type: Optional[str] = None


class AutocompleteRequest(BaseModel):
    input: str
    types: Optional[str] = "(cities)"
