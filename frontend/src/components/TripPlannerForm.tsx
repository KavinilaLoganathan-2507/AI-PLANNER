'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Calendar,
  Users,
  Wallet,
  Sparkles,
  Heart,
  Mountain,
  Utensils,
  Baby,
  Gem,
  Compass,
  Camera,
  ChevronDown,
  Loader2,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { generateTrip, getAutocomplete } from '@/lib/api';
import type { AutocompleteResult, TripRequest } from '@/types';
import toast from 'react-hot-toast';

const TRAVEL_STYLES = [
  { value: 'adventure', label: 'Adventure', icon: Mountain },
  { value: 'cultural', label: 'Cultural', icon: Compass },
  { value: 'relaxation', label: 'Relaxation', icon: Heart },
  { value: 'foodie', label: 'Foodie', icon: Utensils },
  { value: 'family', label: 'Family', icon: Baby },
  { value: 'luxury', label: 'Luxury', icon: Gem },
  { value: 'romantic', label: 'Romantic', icon: Heart },
  { value: 'budget', label: 'Budget', icon: Wallet },
];

const INTERESTS = [
  'History', 'Art & Museums', 'Nature', 'Nightlife', 'Shopping',
  'Photography', 'Local Food', 'Architecture', 'Beaches', 'Temples',
  'Markets', 'Wildlife', 'Music', 'Sports', 'Hiking',
];

export default function TripPlannerForm() {
  const { setCurrentTrip, isGenerating, setIsGenerating } = useAppStore();
  const [step, setStep] = useState(1);
  const [suggestions, setSuggestions] = useState<AutocompleteResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const [form, setForm] = useState<TripRequest>({
    destination: '',
    start_date: '',
    end_date: '',
    travelers: 2,
    budget: 'moderate',
    travel_style: ['cultural'],
    interests: [],
    special_requirements: '',
  });

  // Destination autocomplete
  const handleDestinationChange = useCallback(async (value: string) => {
    setForm((prev) => ({ ...prev, destination: value }));

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (value.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        const results = await getAutocomplete(value);
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
      } catch {
        setSuggestions([]);
      }
    }, 300);
  }, []);

  const selectSuggestion = (suggestion: AutocompleteResult) => {
    setForm((prev) => ({ ...prev, destination: suggestion.description }));
    setShowSuggestions(false);
  };

  // Click outside to close suggestions
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const toggleStyle = (style: string) => {
    setForm((prev) => ({
      ...prev,
      travel_style: prev.travel_style?.includes(style)
        ? prev.travel_style.filter((s) => s !== style)
        : [...(prev.travel_style || []), style],
    }));
  };

  const toggleInterest = (interest: string) => {
    setForm((prev) => ({
      ...prev,
      interests: prev.interests?.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...(prev.interests || []), interest],
    }));
  };

  const handleGenerate = async () => {
    if (!form.destination || !form.start_date || !form.end_date) {
      toast.error('Please fill in destination and travel dates');
      return;
    }

    setIsGenerating(true);
    try {
      const trip = await generateTrip(form);
      setCurrentTrip(trip);
      toast.success('Your trip itinerary is ready!');
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || 'Failed to generate itinerary. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-8"
      >
        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <button
              key={s}
              onClick={() => setStep(s)}
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all
                ${step === s
                  ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg'
                  : step > s
                  ? 'bg-primary-100 text-primary-600'
                  : 'bg-gray-100 text-gray-400'
                }`}
            >
              {s}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Where & When */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 20, opacity: 0 }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-display font-bold text-gray-900">
                Where do you want to go?
              </h3>

              {/* Destination with autocomplete */}
              <div className="relative" ref={suggestionsRef}>
                <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-primary-500" />
                <input
                  type="text"
                  placeholder="Search destination... (e.g., Paris, Tokyo, Bali)"
                  className="input-field pl-11 text-lg"
                  value={form.destination}
                  onChange={(e) => handleDestinationChange(e.target.value)}
                  onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                />
                {showSuggestions && (
                  <div className="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden">
                    {suggestions.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => selectSuggestion(s)}
                        className="w-full px-4 py-3 text-left hover:bg-primary-50 transition flex items-center gap-3"
                      >
                        <MapPin className="w-4 h-4 text-primary-400 flex-shrink-0" />
                        <div>
                          <div className="font-medium text-gray-900">{s.main_text}</div>
                          <div className="text-sm text-gray-500">{s.secondary_text}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                  <Calendar className="absolute left-3 top-3.5 w-5 h-5 text-primary-500" />
                  <input
                    type="date"
                    className="input-field pl-11"
                    value={form.start_date}
                    onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                  />
                  <label className="text-xs text-gray-500 mt-1 ml-1">Start Date</label>
                </div>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3.5 w-5 h-5 text-accent-500" />
                  <input
                    type="date"
                    className="input-field pl-11"
                    value={form.end_date}
                    min={form.start_date}
                    onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                  />
                  <label className="text-xs text-gray-500 mt-1 ml-1">End Date</label>
                </div>
              </div>

              {/* Travelers */}
              <div className="flex items-center gap-4">
                <Users className="w-5 h-5 text-primary-500" />
                <span className="font-medium text-gray-700">Travelers:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setForm({ ...form, travelers: Math.max(1, form.travelers - 1) })}
                    className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold transition"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-semibold text-lg">{form.travelers}</span>
                  <button
                    onClick={() => setForm({ ...form, travelers: Math.min(20, form.travelers + 1) })}
                    className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold transition"
                  >
                    +
                  </button>
                </div>
              </div>

              <button onClick={() => setStep(2)} className="btn-primary w-full">
                Continue
              </button>
            </motion.div>
          )}

          {/* Step 2: Style & Budget */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-display font-bold text-gray-900">
                How do you like to travel?
              </h3>

              {/* Budget */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Budget Level</label>
                <div className="grid grid-cols-3 gap-3">
                  {['budget', 'moderate', 'luxury'].map((b) => (
                    <button
                      key={b}
                      onClick={() => setForm({ ...form, budget: b })}
                      className={`px-4 py-3 rounded-xl font-medium capitalize transition-all
                        ${form.budget === b
                          ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg'
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                        }`}
                    >
                      {b === 'budget' ? '💰 Budget' : b === 'moderate' ? '💵 Moderate' : '💎 Luxury'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Travel Styles */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Travel Style (pick multiple)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {TRAVEL_STYLES.map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      onClick={() => toggleStyle(value)}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                        ${form.travel_style?.includes(value)
                          ? 'bg-primary-100 text-primary-700 border-2 border-primary-400'
                          : 'bg-gray-50 text-gray-600 border-2 border-transparent hover:bg-gray-100'
                        }`}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="btn-secondary flex-1">
                  Back
                </button>
                <button onClick={() => setStep(3)} className="btn-primary flex-1">
                  Continue
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Interests & Generate */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-display font-bold text-gray-900">
                What interests you?
              </h3>

              <div className="flex flex-wrap gap-2">
                {INTERESTS.map((interest) => (
                  <button
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all
                      ${form.interests?.includes(interest)
                        ? 'bg-accent-100 text-accent-700 border-2 border-accent-400'
                        : 'bg-gray-50 text-gray-600 border-2 border-transparent hover:bg-gray-100'
                      }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>

              {/* Special Requirements */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Special Requirements (optional)
                </label>
                <textarea
                  className="input-field h-24 resize-none"
                  placeholder="E.g., wheelchair accessibility, vegetarian food, kid-friendly activities..."
                  value={form.special_requirements}
                  onChange={(e) => setForm({ ...form, special_requirements: e.target.value })}
                />
              </div>

              {/* Summary */}
              <div className="bg-primary-50/50 rounded-xl p-4 border border-primary-100">
                <h4 className="font-semibold text-primary-800 mb-2">Trip Summary</h4>
                <div className="text-sm text-primary-700 space-y-1">
                  <p><strong>Destination:</strong> {form.destination || '—'}</p>
                  <p><strong>Dates:</strong> {form.start_date} → {form.end_date || '—'}</p>
                  <p><strong>Travelers:</strong> {form.travelers}</p>
                  <p><strong>Budget:</strong> {form.budget}</p>
                  <p><strong>Style:</strong> {form.travel_style?.join(', ') || '—'}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="btn-secondary flex-1">
                  Back
                </button>
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate Itinerary
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Loading Overlay */}
      {isGenerating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        >
          <div className="glass-card p-10 text-center max-w-sm mx-4">
            <div className="relative mx-auto w-20 h-20 mb-6">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 animate-ping opacity-30" />
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-r from-primary-500 to-accent-500
                flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white animate-pulse" />
              </div>
            </div>
            <h3 className="text-xl font-display font-bold text-gray-900 mb-2">
              Planning Your Trip
            </h3>
            <p className="text-gray-500 text-sm">
              Our AI is researching the best spots, restaurants, and creating your personalized itinerary...
            </p>
            <div className="mt-4 flex justify-center gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 0.6, delay: i * 0.2, repeat: Infinity }}
                  className="w-2 h-2 bg-primary-500 rounded-full"
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
