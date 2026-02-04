import { Luggage, ArrowLeft, Plane, Calendar, User, CreditCard, Check } from 'lucide-react';
import { useState } from 'react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface FlightBookingProps {
  flight: any;
  searchParams: {
    fromCity: string;
    toCity: string;
    flightDate: string;
  };
  onBack: () => void;
  onNavigate: (page: string, bookingData?: any) => void;
  accessToken: string | null;
  user: any;
}

export function FlightBooking({ flight, searchParams, onBack, onNavigate, accessToken, user }: FlightBookingProps) {
  const [selectedWeight, setSelectedWeight] = useState<number | null>(null);
  const [fullName, setFullName] = useState(user?.user_metadata?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [recipientName, setRecipientName] = useState('');
  const [luggageType, setLuggageType] = useState('Suitcase');
  const [luggageDimensions, setLuggageDimensions] = useState({ length: '', width: '', height: '' });
  const [processing, setProcessing] = useState(false);

  // Pricing based on weight
  const getPrice = (weight: number | null): number => {
    if (weight === null || weight === 0) return 0;
    if (weight === 8) return 25;
    if (weight === 15) return 40;
    if (weight === 23) return 55;
    return 0;
  };

  const price = getPrice(selectedWeight);

  // Format time from ISO string
  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handlePayment = async () => {
    // Allow demo bookings without sign in
    // if (!accessToken) {
    //   alert('Please sign in to complete booking');
    //   onNavigate('auth');
    //   return;
    // }

    if (!fullName.trim()) {
      alert('Please enter your full name');
      return;
    }

    if (!email.trim()) {
      alert('Please enter your email');
      return;
    }

    // Navigate to payment page with booking details
    onNavigate('payment', {
      passengerName: fullName,
      email: email,
      flight: flight,
      searchParams: searchParams,
      selectedWeight: selectedWeight,
      price: price,
    });
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
            <button 
              onClick={onBack}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Back to Results</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Flight Info Card */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          {flight.type === 'demo' && (
            <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm font-semibold text-yellow-800">🎭 DEMO FLIGHT</p>
              <p className="text-xs text-yellow-700 mt-1">This is a demonstration flight for testing purposes</p>
            </div>
          )}
          
          <div className="flex items-start gap-4 mb-6">
            <div className="text-5xl">✈️</div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {flight.airlineName || flight.airline} - {flight.flightNumber}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Plane className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Route:</span>
                  <span className="font-semibold">{flight.origin} → {flight.destination}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Date:</span>
                  <span className="font-semibold">{formatDate(flight.departure)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Departure:</span>
                  <span className="font-semibold">{formatTime(flight.departure)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Arrival:</span>
                  <span className="font-semibold">{formatTime(flight.arrival)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Luggage Selection */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Select Luggage Weight</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[0, 8, 15, 23].map((weight) => (
              <button
                key={weight}
                onClick={() => setSelectedWeight(weight)}
                className={`p-4 rounded-lg border-2 transition ${
                  selectedWeight === weight
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="text-center">
                  <Luggage className={`h-8 w-8 mx-auto mb-2 ${
                    selectedWeight === weight ? 'text-blue-600' : 'text-gray-400'
                  }`} />
                  <div className="font-bold text-gray-900">{weight} kg</div>
                  <div className="text-sm text-gray-600 mt-1">
                    {weight === 0 ? 'No Luggage' : `Cabin/Carry-on`}
                  </div>
                  <div className={`text-lg font-bold mt-2 ${
                    selectedWeight === weight ? 'text-blue-600' : 'text-gray-700'
                  }`}>
                    {getPrice(weight) === 0 ? 'FREE' : `$${getPrice(weight)}`}
                  </div>
                  {selectedWeight === weight && (
                    <div className="mt-2">
                      <Check className="h-5 w-5 mx-auto text-blue-600" />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>

          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Weight Guide:</strong> 8kg = Small carry-on | 15kg = Standard cabin bag | 23kg = Checked luggage
            </p>
          </div>
        </div>

        {/* Passenger Details */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Passenger Details</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <User className="inline h-4 w-4 mr-1" />
                Full Name (as on passport)
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Smith"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Payment Summary</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between text-gray-600">
              <span>Luggage ({selectedWeight}kg)</span>
              <span className="font-semibold">${price}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Insurance (included)</span>
              <span className="font-semibold text-green-600">FREE</span>
            </div>
            <div className="border-t border-gray-200 pt-3 flex justify-between">
              <span className="text-lg font-bold text-gray-900">Total</span>
              <span className="text-2xl font-bold text-blue-600">${price}</span>
            </div>
          </div>
        </div>

        {/* Payment Button */}
        <button
          onClick={handlePayment}
          disabled={processing || !fullName.trim() || !email.trim() || selectedWeight === null}
          className={`w-full py-4 rounded-lg font-bold text-lg transition shadow-lg flex items-center justify-center gap-2 ${
            processing || !fullName.trim() || !email.trim() || selectedWeight === null
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800'
          }`}
        >
          <CreditCard className="h-6 w-6" />
          {processing ? 'Processing...' : selectedWeight === null ? 'Select Weight to Continue' : `Continue to Payment`}
        </button>
        
        <p className="text-center text-sm text-gray-500 mt-4">
          🔒 Secure checkout • Review payment details on next page
        </p>
      </div>
    </div>
  );
}