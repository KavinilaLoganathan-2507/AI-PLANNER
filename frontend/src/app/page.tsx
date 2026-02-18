'use client';

import { useAppStore } from '@/lib/store';
import Navbar from '@/components/Navbar';
import AuthModal from '@/components/AuthModal';
import HeroSection from '@/components/HeroSection';
import TripPlannerForm from '@/components/TripPlannerForm';
import ItineraryView from '@/components/ItineraryView';
import Footer from '@/components/Footer';

export default function HomePage() {
  const { currentTrip } = useAppStore();

  return (
    <>
      <Navbar />
      <AuthModal />

      <main className="min-h-screen">
        {currentTrip ? (
          <div className="pt-24 px-4 sm:px-6 lg:px-8">
            <ItineraryView />
          </div>
        ) : (
          <>
            <HeroSection />
            <section className="px-4 sm:px-6 lg:px-8 pb-20 -mt-4">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-display font-bold text-gray-900">
                  Start Planning
                </h2>
                <p className="text-gray-500 mt-2">
                  Tell us about your dream trip and let AI do the rest
                </p>
              </div>
              <TripPlannerForm />
            </section>
          </>
        )}
      </main>

      <Footer />
    </>
  );
}
