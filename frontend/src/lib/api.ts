import axios from 'axios';
import type {
  TripRequest,
  TripResponse,
  PlaceInfo,
  AutocompleteResult,
  TokenResponse,
} from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach auth token to requests
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('tripstellar_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// ── Auth ──

export async function registerUser(
  name: string,
  email: string,
  password: string
): Promise<TokenResponse> {
  const { data } = await api.post('/api/auth/register', { name, email, password });
  return data;
}

export async function loginUser(email: string, password: string): Promise<TokenResponse> {
  const { data } = await api.post('/api/auth/login', { email, password });
  return data;
}

// ── Trips ──

export async function generateTrip(request: TripRequest): Promise<TripResponse> {
  const { data } = await api.post('/api/trips/generate', request);
  return data;
}

export async function getUserTrips(): Promise<TripResponse[]> {
  const { data } = await api.get('/api/trips/');
  return data;
}

export async function getTrip(tripId: string): Promise<TripResponse> {
  const { data } = await api.get(`/api/trips/${tripId}`);
  return data;
}

export async function deleteTrip(tripId: string): Promise<void> {
  await api.delete(`/api/trips/${tripId}`);
}

// ── Places ──

export async function searchPlaces(
  query: string,
  type?: string,
  minRating: number = 4.0
): Promise<PlaceInfo[]> {
  const { data } = await api.get('/api/places/search', {
    params: { query, type, min_rating: minRating },
  });
  return data;
}

export async function getAutocomplete(input: string): Promise<AutocompleteResult[]> {
  const { data } = await api.get('/api/places/autocomplete', {
    params: { input },
  });
  return data;
}

export async function getTopRestaurants(destination: string): Promise<PlaceInfo[]> {
  const { data } = await api.get('/api/places/restaurants', {
    params: { destination },
  });
  return data;
}

export async function getTopAttractions(destination: string): Promise<PlaceInfo[]> {
  const { data } = await api.get('/api/places/attractions', {
    params: { destination },
  });
  return data;
}

export async function getPlaceDetails(placeId: string): Promise<any> {
  const { data } = await api.get(`/api/places/details/${placeId}`);
  return data;
}

export default api;
