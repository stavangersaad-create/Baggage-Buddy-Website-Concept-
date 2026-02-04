import { Luggage, Menu, X, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { LuggageTracker } from './LuggageTracker';
import { Footer } from './Footer';

export function BaggageTagsPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-gray-900 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <button 
              onClick={() => onNavigate('home')} 
              className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition"
            >
              <Luggage className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-white">Baggage Buddy</span>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <button 
                onClick={() => onNavigate('home')} 
                className="text-white hover:text-blue-400 transition flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </button>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                Sign In
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-gray-800">
            <div className="px-4 pt-2 pb-4 space-y-3">
              <button 
                onClick={() => {
                  onNavigate('home');
                  setMobileMenuOpen(false);
                }} 
                className="block text-white hover:text-blue-400 transition py-2 flex items-center gap-2 w-full text-left"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </button>
              <button className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                Sign In
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Baggage Tags & Tracking
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Generate digital luggage tags and track your belongings in real-time with our secure tracking system.
          </p>
        </div>
      </div>

      {/* Luggage Tracker Section */}
      <LuggageTracker />

      {/* Footer */}
      <Footer />
    </div>
  );
}
