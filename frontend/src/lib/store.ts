import { create } from 'zustand';
import type { User, TripResponse, TripItinerary } from '@/types';

interface AppState {
  // Auth
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  loadAuth: () => void;

  // Trip
  currentTrip: TripResponse | null;
  savedTrips: TripResponse[];
  isGenerating: boolean;
  setCurrentTrip: (trip: TripResponse | null) => void;
  setSavedTrips: (trips: TripResponse[]) => void;
  setIsGenerating: (val: boolean) => void;

  // UI
  activeDay: number;
  setActiveDay: (day: number) => void;
  showAuthModal: boolean;
  setShowAuthModal: (val: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Auth
  user: null,
  token: null,
  isAuthenticated: false,

  setAuth: (user, token) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('tripstellar_token', token);
      localStorage.setItem('tripstellar_user', JSON.stringify(user));
    }
    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('tripstellar_token');
      localStorage.removeItem('tripstellar_user');
    }
    set({ user: null, token: null, isAuthenticated: false, savedTrips: [] });
  },

  loadAuth: () => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('tripstellar_token');
    const userStr = localStorage.getItem('tripstellar_user');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        set({ user, token, isAuthenticated: true });
      } catch {
        set({ user: null, token: null, isAuthenticated: false });
      }
    }
  },

  // Trip
  currentTrip: null,
  savedTrips: [],
  isGenerating: false,
  setCurrentTrip: (trip) => set({ currentTrip: trip }),
  setSavedTrips: (trips) => set({ savedTrips: trips }),
  setIsGenerating: (val) => set({ isGenerating: val }),

  // UI
  activeDay: 1,
  setActiveDay: (day) => set({ activeDay: day }),
  showAuthModal: false,
  setShowAuthModal: (val) => set({ showAuthModal: val }),
}));
