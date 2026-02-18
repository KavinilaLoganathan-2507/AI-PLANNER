'use client';

import { Plane, Github, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl">
                <Plane className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-display font-bold text-white">TripStellar</span>
            </div>
            <p className="text-sm">
              AI-powered travel planning using Google Gemini, Google Places API, and LangChain.
              Get personalized itineraries with real ratings and reviews.
            </p>
          </div>

          {/* Tech Stack */}
          <div>
            <h3 className="text-white font-semibold mb-3">Tech Stack</h3>
            <ul className="space-y-1 text-sm">
              <li>Frontend: Next.js + Tailwind CSS</li>
              <li>Backend: FastAPI + Python</li>
              <li>AI: Gemini 2.5 Flash (Vertex AI)</li>
              <li>Orchestrator: LangChain</li>
              <li>APIs: Google Places & Maps</li>
              <li>Database: MongoDB</li>
              <li>Hosting: GCP Cloud Run</li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-3">Links</h3>
            <ul className="space-y-1 text-sm">
              <li>
                <a href="#" className="hover:text-white transition">Plan a Trip</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">Explore Destinations</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">API Documentation</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition flex items-center gap-1">
                  <Github className="w-4 h-4" /> Source Code
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p className="flex items-center justify-center gap-1">
            Built with <Heart className="w-3 h-3 text-red-500 fill-current" /> using GCP &amp; AI
          </p>
          <p className="mt-1">&copy; {new Date().getFullYear()} TripStellar. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
