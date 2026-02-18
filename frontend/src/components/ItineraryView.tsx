'use client';

import { motion } from 'framer-motion';
import {
  Clock,
  MapPin,
  Star,
  Lightbulb,
  DollarSign,
  UtensilsCrossed,
  Camera,
  ChevronRight,
  Globe,
  Languages,
  Phone,
  Luggage,
  ScrollText,
  ArrowLeft,
  Share2,
  Download,
  Calendar,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import type { TripItinerary, DayPlan, Activity, PlaceInfo } from '@/types';

// ── Day Selector Tabs ──
function DayTabs({ days, activeDay, setActiveDay }: {
  days: DayPlan[];
  activeDay: number;
  setActiveDay: (d: number) => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
      {days.map((day) => (
        <button
          key={day.day}
          onClick={() => setActiveDay(day.day)}
          className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap
            ${activeDay === day.day
              ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg'
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
        >
          Day {day.day}
        </button>
      ))}
    </div>
  );
}

// ── Activity Card ──
function ActivityCard({ activity, index }: { activity: Activity; index: number }) {
  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: index * 0.1 }}
      className="flex gap-4"
    >
      {/* Timeline */}
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-accent-400
          flex items-center justify-center text-white text-xs font-bold shadow-md">
          {activity.time?.split(' ')[0] || ''}
        </div>
        <div className="w-0.5 flex-1 bg-gradient-to-b from-primary-200 to-transparent mt-2" />
      </div>

      {/* Content */}
      <div className="flex-1 pb-6">
        <div className="glass-card p-5 card-hover">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h4 className="font-display font-bold text-gray-900">{activity.title}</h4>
            <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded-lg whitespace-nowrap">
              {activity.time}
            </span>
          </div>

          <p className="text-gray-600 text-sm mb-3">{activity.description}</p>

          <div className="flex flex-wrap gap-3 text-xs">
            {activity.duration && (
              <span className="flex items-center gap-1 text-gray-500">
                <Clock className="w-3.5 h-3.5" />
                {activity.duration}
              </span>
            )}
            {activity.estimated_cost && (
              <span className="flex items-center gap-1 text-green-600">
                <DollarSign className="w-3.5 h-3.5" />
                {activity.estimated_cost}
              </span>
            )}
            {activity.place?.rating && (
              <span className="flex items-center gap-1 text-amber-500">
                <Star className="w-3.5 h-3.5 fill-current" />
                {activity.place.rating}
              </span>
            )}
          </div>

          {activity.place?.address && (
            <div className="flex items-start gap-1.5 mt-2 text-xs text-gray-400">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
              {activity.place.address}
            </div>
          )}

          {activity.tips && (
            <div className="mt-3 flex items-start gap-2 bg-amber-50 text-amber-700 text-xs p-2.5 rounded-lg">
              <Lightbulb className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
              {activity.tips}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ── Meal Card ──
function MealCard({ meal, index }: { meal: Activity; index: number }) {
  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: index * 0.1 + 0.3 }}
      className="flex gap-4"
    >
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-400
          flex items-center justify-center text-white shadow-md">
          <UtensilsCrossed className="w-4 h-4" />
        </div>
        <div className="w-0.5 flex-1 bg-gradient-to-b from-orange-200 to-transparent mt-2" />
      </div>
      <div className="flex-1 pb-6">
        <div className="bg-orange-50/80 backdrop-blur border border-orange-100 rounded-2xl p-5 card-hover">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h4 className="font-display font-bold text-gray-900">{meal.title}</h4>
            <span className="text-xs font-medium text-orange-600 bg-orange-100 px-2 py-1 rounded-lg whitespace-nowrap">
              {meal.time}
            </span>
          </div>
          <p className="text-gray-600 text-sm">{meal.description}</p>
          {meal.place?.rating && (
            <div className="flex items-center gap-2 mt-2 text-xs">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
              <span className="text-gray-500">{meal.place.rating} rating</span>
              {meal.estimated_cost && (
                <span className="text-green-600">• {meal.estimated_cost}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ── Place Card ──
function PlaceCard({ place }: { place: PlaceInfo }) {
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-100 card-hover">
      {place.photo_url && (
        <div className="w-full h-32 bg-gray-100 rounded-lg mb-3 overflow-hidden">
          <img
            src={place.photo_url}
            alt={place.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <h4 className="font-semibold text-gray-900 text-sm">{place.name}</h4>
      <div className="flex items-center gap-2 mt-1">
        {place.rating && (
          <span className="flex items-center gap-1 text-xs text-amber-500">
            <Star className="w-3 h-3 fill-current" />
            {place.rating}
          </span>
        )}
        {place.total_ratings && (
          <span className="text-xs text-gray-400">({place.total_ratings} reviews)</span>
        )}
      </div>
      {place.address && (
        <p className="text-xs text-gray-400 mt-1 line-clamp-2">{place.address}</p>
      )}
    </div>
  );
}

// ── Main Itinerary View ──
export default function ItineraryView() {
  const { currentTrip, setCurrentTrip, activeDay, setActiveDay } = useAppStore();

  if (!currentTrip) return null;

  const itinerary = currentTrip.itinerary;
  const currentDayPlan = itinerary.days.find((d) => d.day === activeDay) || itinerary.days[0];

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-8"
      >
        <button
          onClick={() => setCurrentTrip(null)}
          className="flex items-center gap-2 text-gray-500 hover:text-primary-600 mb-4 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Plan a new trip
        </button>

        <div className="glass-card p-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-display font-bold gradient-text mb-3">
                {itinerary.destination}
              </h1>
              <p className="text-gray-600 max-w-2xl">{itinerary.summary}</p>

              <div className="flex flex-wrap gap-4 mt-4 text-sm">
                <span className="flex items-center gap-1.5 text-gray-600">
                  <Calendar className="w-4 h-4 text-primary-500" />
                  {itinerary.total_days} days
                </span>
                {itinerary.currency && (
                  <span className="flex items-center gap-1.5 text-gray-600">
                    <DollarSign className="w-4 h-4 text-green-500" />
                    {itinerary.currency}
                  </span>
                )}
                {itinerary.language && (
                  <span className="flex items-center gap-1.5 text-gray-600">
                    <Languages className="w-4 h-4 text-accent-500" />
                    {itinerary.language}
                  </span>
                )}
                {itinerary.estimated_total_budget && (
                  <span className="flex items-center gap-1.5 font-semibold text-green-700 bg-green-50 px-3 py-1 rounded-lg">
                    Est. Budget: {itinerary.estimated_total_budget}
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <button className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl transition">
                <Share2 className="w-4 h-4 text-gray-600" />
              </button>
              <button className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl transition">
                <Download className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Day Tabs */}
          <DayTabs days={itinerary.days} activeDay={activeDay} setActiveDay={setActiveDay} />

          {/* Day Header */}
          {currentDayPlan && (
            <motion.div
              key={currentDayPlan.day}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500
                  flex items-center justify-center text-white font-bold shadow-lg">
                  {currentDayPlan.day}
                </div>
                <div>
                  <h3 className="font-display font-bold text-gray-900 text-lg">
                    {currentDayPlan.theme}
                  </h3>
                  <p className="text-sm text-gray-500">{currentDayPlan.date}</p>
                </div>
              </div>

              {/* Activities */}
              <div className="space-y-0">
                {currentDayPlan.activities.map((activity, i) => (
                  <ActivityCard key={i} activity={activity} index={i} />
                ))}
              </div>

              {/* Meals */}
              {currentDayPlan.meals && currentDayPlan.meals.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-display font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <UtensilsCrossed className="w-5 h-5 text-orange-500" />
                    Dining
                  </h4>
                  {currentDayPlan.meals.map((meal, i) => (
                    <MealCard key={i} meal={meal} index={i} />
                  ))}
                </div>
              )}

              {/* Accommodation tip */}
              {currentDayPlan.accommodation_tip && (
                <div className="mt-4 bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-700">
                  <strong>Accommodation Tip:</strong> {currentDayPlan.accommodation_tip}
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Travel Tips */}
          {itinerary.travel_tips && itinerary.travel_tips.length > 0 && (
            <div className="glass-card p-6">
              <h3 className="font-display font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                Travel Tips
              </h3>
              <ul className="space-y-2">
                {itinerary.travel_tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <ChevronRight className="w-4 h-4 text-primary-400 flex-shrink-0 mt-0.5" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Packing List */}
          {itinerary.packing_list && itinerary.packing_list.length > 0 && (
            <div className="glass-card p-6">
              <h3 className="font-display font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Luggage className="w-5 h-5 text-primary-500" />
                Packing List
              </h3>
              <div className="flex flex-wrap gap-2">
                {itinerary.packing_list.map((item, i) => (
                  <span key={i} className="px-3 py-1 bg-gray-50 text-gray-600 text-xs rounded-full border border-gray-100">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Emergency Contacts */}
          {itinerary.emergency_contacts && Object.keys(itinerary.emergency_contacts).length > 0 && (
            <div className="glass-card p-6">
              <h3 className="font-display font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Phone className="w-5 h-5 text-red-500" />
                Emergency Contacts
              </h3>
              <div className="space-y-2">
                {Object.entries(itinerary.emergency_contacts).map(([key, val]) => (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="text-gray-600 capitalize">{key.replace('_', ' ')}</span>
                    <span className="font-mono font-medium text-gray-900">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Top Restaurants */}
          {itinerary.top_restaurants && itinerary.top_restaurants.length > 0 && (
            <div className="glass-card p-6">
              <h3 className="font-display font-bold text-gray-900 mb-3 flex items-center gap-2">
                <UtensilsCrossed className="w-5 h-5 text-orange-500" />
                Top Restaurants
              </h3>
              <div className="space-y-3">
                {itinerary.top_restaurants.slice(0, 5).map((place, i) => (
                  <PlaceCard key={i} place={place} />
                ))}
              </div>
            </div>
          )}

          {/* Top Attractions */}
          {itinerary.top_attractions && itinerary.top_attractions.length > 0 && (
            <div className="glass-card p-6">
              <h3 className="font-display font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Camera className="w-5 h-5 text-primary-500" />
                Must-Visit Attractions
              </h3>
              <div className="space-y-3">
                {itinerary.top_attractions.slice(0, 5).map((place, i) => (
                  <PlaceCard key={i} place={place} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
