'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  Calendar,
  Trash2,
  Eye,
  Loader2,
  Plane,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import AuthModal from '@/components/AuthModal';
import Footer from '@/components/Footer';
import { useAppStore } from '@/lib/store';
import { getUserTrips, deleteTrip } from '@/lib/api';
import type { TripResponse } from '@/types';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function MyTripsPage() {
  const { isAuthenticated, setShowAuthModal, setCurrentTrip, savedTrips, setSavedTrips } = useAppStore();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    const fetchTrips = async () => {
      try {
        const trips = await getUserTrips();
        setSavedTrips(trips);
      } catch (err) {
        toast.error('Failed to load trips');
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [isAuthenticated, setSavedTrips, setShowAuthModal]);

  const handleDelete = async (tripId: string) => {
    if (!confirm('Delete this trip?')) return;

    try {
      await deleteTrip(tripId);
      setSavedTrips(savedTrips.filter((t) => t.id !== tripId));
      toast.success('Trip deleted');
    } catch {
      toast.error('Failed to delete trip');
    }
  };

  const handleView = (trip: TripResponse) => {
    setCurrentTrip(trip);
    router.push('/');
  };

  return (
    <>
      <Navbar />
      <AuthModal />

      <main className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-display font-bold text-gray-900">My Trips</h1>
          <p className="text-gray-500 mt-1">Your saved travel itineraries</p>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
          </div>
        ) : savedTrips.length === 0 ? (
          <div className="text-center py-20">
            <Plane className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No trips yet</h3>
            <p className="text-gray-400 mb-6">Plan your first trip and it will appear here</p>
            <button onClick={() => router.push('/')} className="btn-primary">
              Plan a Trip
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
            {savedTrips.map((trip, i) => (
              <motion.div
                key={trip.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card p-6 card-hover"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-display font-bold text-gray-900">
                    {trip.itinerary.destination}
                  </h3>
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    {new Date(trip.created_at).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-sm text-gray-500 line-clamp-2 mb-4">{trip.itinerary.summary}</p>

                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {trip.itinerary.total_days} days
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {trip.request.destination}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleView(trip)}
                    className="btn-primary !py-2 !px-4 text-sm flex items-center gap-1 flex-1"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                  <button
                    onClick={() => handleDelete(trip.id)}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
