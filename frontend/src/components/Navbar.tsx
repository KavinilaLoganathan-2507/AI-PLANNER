'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Plane,
  User,
  LogOut,
  Menu,
  X,
  Map,
  Sparkles,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { useState } from 'react';

export default function Navbar() {
  const { user, isAuthenticated, logout, setShowAuthModal, loadAuth } = useAppStore();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    loadAuth();
  }, [loadAuth]);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-lg border-b border-white/20 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl shadow-lg
              group-hover:shadow-xl transition-all duration-300">
              <Plane className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-display font-bold gradient-text">
              TripStellar
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-gray-600 hover:text-primary-600 font-medium transition"
            >
              <Sparkles className="w-4 h-4" />
              Plan Trip
            </Link>
            <Link
              href="/explore"
              className="flex items-center gap-1.5 text-gray-600 hover:text-primary-600 font-medium transition"
            >
              <Map className="w-4 h-4" />
              Explore
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/my-trips"
                  className="text-gray-600 hover:text-primary-600 font-medium transition"
                >
                  My Trips
                </Link>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-primary-50 rounded-xl">
                  <User className="w-4 h-4 text-primary-600" />
                  <span className="text-sm font-medium text-primary-700">{user?.name}</span>
                </div>
                <button
                  onClick={logout}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button onClick={() => setShowAuthModal(true)} className="btn-primary !py-2 !px-4 text-sm">
                Sign In
              </button>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-xl"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="md:hidden pb-4 space-y-2"
          >
            <Link href="/" className="block px-4 py-2 text-gray-600 hover:bg-primary-50 rounded-xl">
              Plan Trip
            </Link>
            <Link href="/explore" className="block px-4 py-2 text-gray-600 hover:bg-primary-50 rounded-xl">
              Explore
            </Link>
            {isAuthenticated ? (
              <>
                <Link href="/my-trips" className="block px-4 py-2 text-gray-600 hover:bg-primary-50 rounded-xl">
                  My Trips
                </Link>
                <button onClick={logout} className="block w-full text-left px-4 py-2 text-red-500 hover:bg-red-50 rounded-xl">
                  Sign Out
                </button>
              </>
            ) : (
              <button onClick={() => { setShowAuthModal(true); setMenuOpen(false); }}
                className="btn-primary w-full text-sm">
                Sign In
              </button>
            )}
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
