// ── Type definitions for TripStellar ──

export interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface PlaceInfo {
  name: string;
  address?: string;
  rating?: number;
  total_ratings?: number;
  price_level?: number | null;
  types?: string[];
  photo_url?: string;
  place_id?: string;
  latitude?: number | null;
  longitude?: number | null;
  opening_hours?: string[];
  website?: string;
}

export interface Activity {
  time: string;
  title: string;
  description: string;
  duration?: string;
  place?: PlaceInfo | null;
  tips?: string;
  estimated_cost?: string;
}

export interface DayPlan {
  day: number;
  date: string;
  theme: string;
  activities: Activity[];
  meals?: Activity[];
  accommodation_tip?: string;
}

export interface TripItinerary {
  destination: string;
  summary: string;
  total_days: number;
  best_time_to_visit?: string;
  currency?: string;
  language?: string;
  travel_tips?: string[];
  packing_list?: string[];
  estimated_total_budget?: string;
  emergency_contacts?: Record<string, string>;
  days: DayPlan[];
  top_restaurants?: PlaceInfo[];
  top_attractions?: PlaceInfo[];
}

export interface TripRequest {
  destination: string;
  start_date: string;
  end_date: string;
  travelers: number;
  budget?: string;
  travel_style?: string[];
  interests?: string[];
  special_requirements?: string;
}

export interface TripResponse {
  id: string;
  user_id?: string;
  request: TripRequest;
  itinerary: TripItinerary;
  created_at: string;
}

export interface AutocompleteResult {
  description: string;
  place_id: string;
  main_text: string;
  secondary_text: string;
}
