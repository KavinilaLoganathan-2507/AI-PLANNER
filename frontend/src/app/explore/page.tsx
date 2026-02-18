'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  MapPin,
  Star,
  UtensilsCrossed,
  Camera,
  Loader2,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import AuthModal from '@/components/AuthModal';
import Footer from '@/components/Footer';
import { searchPlaces, getTopRestaurants, getTopAttractions } from '@/lib/api';
import type { PlaceInfo } from '@/types';

export default function ExplorePage() {
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [restaurants, setRestaurants] = useState<PlaceInfo[]>([]);
  const [attractions, setAttractions] = useState<PlaceInfo[]>([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setSearching(true);
    setSearched(true);

    try {
      const [rests, attrs] = await Promise.all([
        getTopRestaurants(query),
        getTopAttractions(query),
      ]);
      setRestaurants(rests);
      setAttractions(attrs);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setSearching(false);
    }
  };

  return (
    <>
      <Navbar />
      <AuthModal />

      <main className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-display font-bold text-gray-900 mb-3">
            Explore <span className="gradient-text">Destinations</span>
          </h1>
          <p className="text-gray-500 max-w-lg mx-auto">
            Discover top-rated restaurants and attractions at any destination worldwide.
          </p>
        </motion.div>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-12">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-primary-500" />
              <input
                type="text"
                placeholder="Enter a city or destination..."
                className="input-field pl-11 text-lg"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={searching}
              className="btn-primary flex items-center gap-2"
            >
              {searching ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
              Explore
            </button>
          </div>
        </div>

        {/* Results */}
        {searched && !searching && (
          <div className="space-y-12 pb-20">
            {/* Attractions */}
            <section>
              <h2 className="text-2xl font-display font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Camera className="w-6 h-6 text-primary-500" />
                Top Attractions in {query}
              </h2>
              {attractions.length === 0 ? (
                <p className="text-gray-400">No attractions found. Try a different destination.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {attractions.map((place, i) => (
                    <motion.div
                      key={i}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="glass-card overflow-hidden card-hover"
                    >
                      {place.photo_url ? (
                        <img
                          src={place.photo_url}
                          alt={place.name}
                          className="w-full h-40 object-cover"
                        />
                      ) : (
                        <div className="w-full h-40 bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center">
                          <Camera className="w-10 h-10 text-primary-300" />
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-1">{place.name}</h3>
                        <div className="flex items-center gap-2 mb-2">
                          {place.rating && (
                            <span className="flex items-center gap-1 text-amber-500 text-sm">
                              <Star className="w-4 h-4 fill-current" />
                              {place.rating}
                            </span>
                          )}
                          {place.total_ratings && (
                            <span className="text-xs text-gray-400">
                              ({place.total_ratings.toLocaleString()} reviews)
                            </span>
                          )}
                        </div>
                        {place.address && (
                          <p className="text-xs text-gray-500 line-clamp-2">{place.address}</p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </section>

            {/* Restaurants */}
            <section>
              <h2 className="text-2xl font-display font-bold text-gray-900 mb-6 flex items-center gap-2">
                <UtensilsCrossed className="w-6 h-6 text-orange-500" />
                Top Restaurants in {query}
              </h2>
              {restaurants.length === 0 ? (
                <p className="text-gray-400">No restaurants found. Try a different destination.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {restaurants.map((place, i) => (
                    <motion.div
                      key={i}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="glass-card overflow-hidden card-hover"
                    >
                      {place.photo_url ? (
                        <img
                          src={place.photo_url}
                          alt={place.name}
                          className="w-full h-40 object-cover"
                        />
                      ) : (
                        <div className="w-full h-40 bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
                          <UtensilsCrossed className="w-10 h-10 text-orange-300" />
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-1">{place.name}</h3>
                        <div className="flex items-center gap-2 mb-2">
                          {place.rating && (
                            <span className="flex items-center gap-1 text-amber-500 text-sm">
                              <Star className="w-4 h-4 fill-current" />
                              {place.rating}
                            </span>
                          )}
                          {place.total_ratings && (
                            <span className="text-xs text-gray-400">
                              ({place.total_ratings.toLocaleString()} reviews)
                            </span>
                          )}
                          {place.price_level !== undefined && place.price_level !== null && (
                            <span className="text-xs text-green-600">
                              {'$'.repeat(place.price_level || 1)}
                            </span>
                          )}
                        </div>
                        {place.address && (
                          <p className="text-xs text-gray-500 line-clamp-2">{place.address}</p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {/* Loading */}
        {searching && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="spinner mb-4" />
            <p className="text-gray-500">Searching Google Places...</p>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
