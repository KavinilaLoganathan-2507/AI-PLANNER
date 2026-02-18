'use client';

import { motion } from 'framer-motion';
import { Plane, Sparkles, Globe, Map, Star, Shield, ArrowRight } from 'lucide-react';

const FEATURES = [
  {
    icon: Sparkles,
    title: 'AI-Powered Itineraries',
    desc: 'Gemini 2.5 Flash creates personalized day-by-day plans tailored to your preferences.',
    color: 'from-primary-400 to-primary-600',
  },
  {
    icon: Map,
    title: 'Real Google Places Data',
    desc: 'Top-rated restaurants, attractions, and hotels pulled from Google Places API.',
    color: 'from-accent-400 to-accent-600',
  },
  {
    icon: Globe,
    title: 'Any Destination',
    desc: 'Plan trips anywhere in the world with local insights, tips, and emergency contacts.',
    color: 'from-emerald-400 to-emerald-600',
  },
  {
    icon: Shield,
    title: 'Travel Smart',
    desc: 'Get packing lists, budget estimates, cultural notes, and safety tips.',
    color: 'from-amber-400 to-amber-600',
  },
];

const DESTINATIONS = [
  { name: 'Paris', emoji: '🇫🇷', img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=300&fit=crop' },
  { name: 'Tokyo', emoji: '🇯🇵', img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop' },
  { name: 'Bali', emoji: '🇮🇩', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&h=300&fit=crop' },
  { name: 'New York', emoji: '🇺🇸', img: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop' },
  { name: 'London', emoji: '🇬🇧', img: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=300&fit=crop' },
  { name: 'Dubai', emoji: '🇦🇪', img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=300&fit=crop' },
];

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200/30 rounded-full blur-3xl" />
        <div className="absolute top-40 right-10 w-96 h-96 bg-accent-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-1/3 w-64 h-64 bg-emerald-200/20 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        {/* Hero Text */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Powered by Google Gemini AI & Google Places
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-display font-extrabold text-gray-900 mb-6 leading-tight">
            Plan Your Dream Trip
            <br />
            <span className="gradient-text">with AI Magic</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto mb-8">
            Get personalized travel itineraries with top-rated restaurants, attractions,
            and hidden gems — all powered by real Google Places data and AI intelligence.
          </p>

          <div className="flex items-center justify-center gap-3 text-sm text-gray-400">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-amber-400 fill-current" />
              <span>Real ratings & reviews</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Map className="w-4 h-4 text-primary-400" />
              <span>Google Maps integrated</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Plane className="w-4 h-4 text-accent-400" />
              <span>Any destination worldwide</span>
            </div>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16 max-w-5xl mx-auto"
        >
          {FEATURES.map((feature, i) => (
            <div
              key={i}
              className="glass-card p-6 text-center card-hover"
            >
              <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${feature.color}
                flex items-center justify-center shadow-lg`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-display font-bold text-gray-900 text-sm mb-1">{feature.title}</h3>
              <p className="text-xs text-gray-500">{feature.desc}</p>
            </div>
          ))}
        </motion.div>

        {/* Popular Destinations */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl font-display font-bold text-gray-900 mb-6">
            Popular Destinations
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 max-w-4xl mx-auto">
            {DESTINATIONS.map((dest, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5, scale: 1.02 }}
                className="relative group cursor-pointer overflow-hidden rounded-2xl shadow-lg"
              >
                <img
                  src={dest.img}
                  alt={dest.name}
                  className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-2 left-3 text-white">
                  <span className="text-lg mr-1">{dest.emoji}</span>
                  <span className="font-semibold text-sm">{dest.name}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
