import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import './globals.css';

export const metadata: Metadata = {
  title: 'TripStellar - AI-Powered Travel Planner',
  description:
    'Plan your perfect trip with AI. Get personalized itineraries, top-rated restaurants, and hidden gems powered by Google Places and Gemini AI.',
  keywords: 'travel planner, AI travel, itinerary generator, trip planning, Google Places',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen gradient-bg">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: '12px',
              background: '#1e293b',
              color: '#f8fafc',
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
