import { Luggage, ArrowLeft, Plane, Shield, Star, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { FlightBooking } from './FlightBooking';

interface SearchResultsProps {
  searchParams: {
    fromCity: string;
    toCity: string;
    flightDate: string;
    numberOfBags: string;
    luggageSize: string;
  };
  onBack: () => void;
  onNavigate: (page: string, data?: any) => void;
  onBookingComplete: (bookingId: string, details: any) => void;
  accessToken: string | null;
  user: any;
}

interface Flight {
  id: string;
  type: 'live' | 'demo';
  airline: string;
  airlineName: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departure: string;
  arrival: string;
  price: number;
  availableCapacity: number;
  logo?: string;
}

export function SearchResults({ searchParams, onBack, onNavigate, onBookingComplete, accessToken, user }: SearchResultsProps) {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [showBooking, setShowBooking] = useState(false);

  // Extract airport codes from city names (simple extraction)
  const extractAirportCode = (city: string): string => {
    // Simple mapping for common cities
    const cityMap: any = {
      'oslo': 'OSL',
      'frankfurt': 'FRA',
      'london': 'LHR',
      'new york': 'JFK',
      'los angeles': 'LAX',
      'tokyo': 'NRT',
      'paris': 'CDG',
      'dubai': 'DXB',
      'singapore': 'SIN',
      'hong kong': 'HKG',
    };

    const cityLower = city.toLowerCase();
    for (const [name, code] of Object.entries(cityMap)) {
      if (cityLower.includes(name)) {
        return code as string;
      }
    }
    
    // Default fallback: use first 3 letters
    return city.substring(0, 3).toUpperCase();
  };

  useEffect(() => {
    searchFlights();
  }, []);

  const searchFlights = async () => {
    setLoading(true);
    
    try {
      const origin = extractAirportCode(searchParams.fromCity);
      const destination = extractAirportCode(searchParams.toCity);
      
      console.log('Searching flights:', { origin, destination, date: searchParams.flightDate });

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-5cdb4afc/api/flights/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          origin,
          destination,
          departureDate: searchParams.flightDate,
        })
      });

      if (!response.ok) {
        throw new Error('Failed to search flights');
      }

      const data = await response.json();
      console.log('Flight search results:', data);
      
      setFlights(data.flights || []);
      setIsDemo(data.isDemo || false);
    } catch (error) {
      console.error('Flight search error:', error);
      
      // Create emergency demo flight as fallback
      const origin = extractAirportCode(searchParams.fromCity);
      const destination = extractAirportCode(searchParams.toCity);
      
      const depDate = new Date(searchParams.flightDate);
      depDate.setHours(10, 30, 0, 0);
      
      const arrDate = new Date(depDate);
      arrDate.setHours(arrDate.getHours() + 2.5);

      setFlights([{
        id: 'demo-fallback',
        type: 'demo',
        airline: 'AA',
        airlineName: 'American Airlines',
        flightNumber: 'AA123',
        origin,
        destination,
        departure: depDate.toISOString(),
        arrival: arrDate.toISOString(),
        price: 150,
        availableCapacity: 10,
        logo: '🇺🇸',
      }]);
      setIsDemo(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectFlight = (flight: Flight) => {
    setSelectedFlight(flight);
    setShowBooking(true);
  };

  const handleBackFromBooking = () => {
    setShowBooking(false);
    setSelectedFlight(null);
  };

  // If showing booking page
  if (showBooking && selectedFlight) {
    return (
      <FlightBooking
        flight={selectedFlight}
        searchParams={searchParams}
        onBack={handleBackFromBooking}
        onNavigate={onNavigate}
        accessToken={accessToken}
        user={user}
      />
    );
  }

  // Format time
  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button 
              onClick={() => onNavigate('home')} 
              className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition"
            >
              <Luggage className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Baggage Buddy</span>
            </button>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => onNavigate('tags')}
                className="text-gray-600 hover:text-blue-600 transition font-medium hidden sm:block"
              >
                Baggage Tags
              </button>
              <button 
                onClick={onBack}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="font-medium">Modify Search</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Search Summary */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Plane className="h-5 w-5 text-gray-400" />
                <div>
                  <span className="font-semibold text-gray-900">{searchParams.fromCity}</span>
                  <span className="mx-2 text-gray-400">→</span>
                  <span className="font-semibold text-gray-900">{searchParams.toCity}</span>
                </div>
              </div>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="text-gray-600">
                {searchParams.flightDate}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <span className="text-gray-600">Bags:</span>{' '}
                <span className="font-semibold text-gray-900">{searchParams.numberOfBags}</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-600">Size:</span>{' '}
                <span className="font-semibold text-gray-900 capitalize">{searchParams.luggageSize}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {flights.length} Airlines with Available Luggage Space
          </h1>
          <p className="text-gray-600 mt-1">
            Sorted by best value • All prices include insurance
          </p>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading available flights...</div>
          ) : flights.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-md">
              <Luggage className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg text-gray-600">No flights available for this route yet.</p>
              <p className="text-sm text-gray-500 mt-2">Try searching for a different route or check back later.</p>
            </div>
          ) : (
            flights.map((flight, index) => {
              const totalPrice = flight.price * parseInt(searchParams.numberOfBags);
              const standardFee = 25; // Standard airline baggage fee
              const standardTotal = standardFee * parseInt(searchParams.numberOfBags);
              const actualSavings = standardTotal - totalPrice;
              const savingsPercent = Math.round((actualSavings / standardTotal) * 100);

              return (
                <div
                  key={flight.id || index}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-200 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      {/* Airline Info */}
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          <div className="text-4xl">{flight.logo}</div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-bold text-gray-900">
                                {flight.airlineName}
                              </h3>
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm font-semibold text-gray-700">{flight.availableCapacity}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                              <span className="font-medium text-blue-600">{flight.flightNumber}</span>
                              <span>{formatTime(flight.departure)} → {formatTime(flight.arrival)}</span>
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                {flight.availableCapacity} spots left
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <Shield className="h-4 w-4 text-green-600" />
                              <span className="text-sm text-gray-600">
                                Insurance included up to $5,000 per bag
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Pricing */}
                      <div className="flex items-center gap-6 lg:border-l lg:pl-6 border-gray-200">
                        <div className="text-left">
                          <div className="text-sm text-gray-500 mb-1">Total Price</div>
                          <div className="flex items-baseline gap-2 mb-1">
                            <span className="text-3xl font-bold text-gray-900">${totalPrice}</span>
                            <span className="text-gray-500 line-through text-sm">${standardTotal}</span>
                          </div>
                          <div className="inline-block bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">
                            Save {savingsPercent}%
                          </div>
                        </div>

                        <button
                          onClick={() => handleSelectFlight(flight)}
                          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition shadow-md whitespace-nowrap"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-bold text-blue-900 mb-2">How does this work?</h3>
          <p className="text-blue-800 text-sm">
            Airlines often have unused luggage capacity on their flights. Instead of flying empty, they list this space on Baggage Buddy at discounted prices. You book the space you need at a fraction of standard excess baggage fees, and everyone wins!
          </p>
        </div>
      </div>
    </div>
  );
}