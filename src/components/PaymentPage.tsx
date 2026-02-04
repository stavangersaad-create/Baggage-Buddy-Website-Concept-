import { Luggage, ArrowLeft, CreditCard, Lock, Check, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { projectId } from '../utils/supabase/info';

interface PaymentPageProps {
  bookingDetails: {
    passengerName: string;
    email: string;
    recipientName?: string;
    luggageType?: string;
    luggageDimensions?: { length: string; width: string; height: string };
    flight: any;
    searchParams: any;
    selectedWeight: number;
    price: number;
  };
  onBack: () => void;
  onNavigate: (page: string, data?: any) => void;
  accessToken: string | null;
}

export function PaymentPage({ bookingDetails, onBack, onNavigate, accessToken }: PaymentPageProps) {
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState(bookingDetails.passengerName);
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [recipientName, setRecipientName] = useState(bookingDetails.recipientName || '');
  const [luggageType, setLuggageType] = useState(bookingDetails.luggageType || 'Suitcase');
  const [dimensions, setDimensions] = useState(bookingDetails.luggageDimensions || { length: '55', width: '35', height: '25' });
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const { flight, selectedWeight, price, passengerName, email, searchParams } = bookingDetails;

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const chunks = cleaned.match(/.{1,4}/g) || [];
    return chunks.join(' ');
  };

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, '');
    if (value.length <= 16 && /^\d*$/.test(value)) {
      setCardNumber(value);
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      setExpiryDate(value);
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 4 && /^\d*$/.test(value)) {
      setCvv(value);
    }
  };

  const handlePayment = async () => {
    console.log('=== PAYMENT BUTTON CLICKED ===');
    console.log('accessToken:', accessToken);
    console.log('price:', price);
    console.log('passengerName:', passengerName);
    
    // Validate form
    if (price > 0) {
      if (cardNumber.length !== 16) {
        setError('Please enter a valid 16-digit card number');
        return;
      }
      if (!cardName.trim()) {
        setError('Please enter cardholder name');
        return;
      }
      if (expiryDate.length !== 4) {
        setError('Please enter expiry date (MM/YY)');
        return;
      }
      if (cvv.length < 3) {
        setError('Please enter CVV');
        return;
      }
    }

    if (!accessToken) {
      console.error('NO ACCESS TOKEN - Allowing anonymous demo booking');
      // Allow anonymous booking for demo purposes
      // setError('Session expired. Please sign in again.');
      // setTimeout(() => {
      //   onNavigate('auth');
      // }, 2000);
      // return;
    }

    setError('');
    setProcessing(true);

    try {
      console.log('Starting payment process...');
      
      // Generate booking ID in format BB-XXXXX (5 digits)
      const randomDigits = Math.floor(10000 + Math.random() * 90000); // 5-digit random number
      const bookingId = `BB-${randomDigits}`;
      const tagCode = `TAG-${randomDigits}`;

      const bookingPayload = {
        bookingId,
        tagCode,
        fullName: passengerName,
        email,
        recipientName,
        luggageType,
        luggageDimensions: `${dimensions.length} x ${dimensions.width} x ${dimensions.height} cm`,
        airline: flight.airlineName || flight.airline,
        flightNumber: flight.flightNumber,
        routeOrigin: flight.origin,
        routeDestination: flight.destination,
        departure: flight.departure,
        arrival: flight.arrival,
        departureDate: new Date(flight.departure).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        departureTime: new Date(flight.departure).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
        weightKg: selectedWeight,
        totalPaid: price,
        flightType: flight.type,
        paymentMethod: price > 0 ? 'card' : 'free',
        cardLast4: price > 0 ? cardNumber.slice(-4) : null,
      };

      console.log('Creating booking with payload:', bookingPayload);

      // Save to localStorage keyed by bookingId
      localStorage.setItem(`booking_${bookingId}`, JSON.stringify(bookingPayload));
      console.log('Saved booking to localStorage:', bookingId);

      // Optional: Save to database if user is authenticated (not required for demo)
      // This is a background operation and won't block the booking flow
      if (accessToken) {
        try {
          console.log('Attempting to save to database (optional)...');
          const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-5cdb4afc/bookings`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookingPayload)
          });

          if (response.ok) {
            console.log('Booking saved to database successfully');
          } else {
            console.log('Database save failed (non-critical):', await response.text());
          }
        } catch (dbError) {
          // Database save is optional - don't block the booking flow
          console.log('Database save error (non-critical):', dbError);
        }
      } else {
        console.log('No auth token - booking saved to localStorage only');
      }

      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Navigate to confirmation page with bookingId in URL
      console.log('Navigating to confirmation page with bookingId:', bookingId);
      
      // Use URL-based navigation: /confirmation?bookingId=BB-XXXXX
      window.location.href = `/?page=confirmation&bookingId=${bookingId}`;
    } catch (error: any) {
      console.error('Payment error:', error);
      setError(error.message || 'Failed to process payment. Please try again.');
      setProcessing(false);
    }
  };

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
            <button 
              onClick={onBack}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Back</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Payment</h1>
          <p className="text-gray-600 mt-2">Complete your booking securely</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            {price === 0 ? (
              // Free Booking Card
              <div className="bg-white rounded-xl shadow-md p-8">
                <div className="text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="h-12 w-12 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Free Booking</h2>
                  <p className="text-gray-600 mb-6">
                    You've selected 0kg luggage, so there's no payment required!
                  </p>
                  <button
                    onClick={handlePayment}
                    disabled={processing}
                    className="w-full py-4 bg-green-600 text-white rounded-lg font-bold text-lg hover:bg-green-700 transition disabled:bg-gray-400"
                  >
                    {processing ? 'Confirming...' : 'Confirm Free Booking'}
                  </button>
                </div>
              </div>
            ) : (
              // Payment Card
              <div className="bg-white rounded-xl shadow-md p-8">
                <div className="flex items-center gap-2 mb-6">
                  <CreditCard className="h-6 w-6 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Payment Details</h2>
                </div>

                {error && (
                  <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                )}

                <div className="space-y-6">
                  {/* Recipient Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Recipient Name (Person receiving luggage)
                    </label>
                    <input
                      type="text"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder="Jane Smith"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  {/* Luggage Type */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Luggage Type
                    </label>
                    <select
                      value={luggageType}
                      onChange={(e) => setLuggageType(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    >
                      <option value="Suitcase">Suitcase</option>
                      <option value="Box">Box</option>
                      <option value="Bag">Bag</option>
                      <option value="Backpack">Backpack</option>
                    </select>
                  </div>

                  {/* Dimensions */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Dimensions (cm)
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      <input
                        type="number"
                        value={dimensions.length}
                        onChange={(e) => setDimensions({ ...dimensions, length: e.target.value })}
                        placeholder="L"
                        className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      />
                      <input
                        type="number"
                        value={dimensions.width}
                        onChange={(e) => setDimensions({ ...dimensions, width: e.target.value })}
                        placeholder="W"
                        className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      />
                      <input
                        type="number"
                        value={dimensions.height}
                        onChange={(e) => setDimensions({ ...dimensions, height: e.target.value })}
                        placeholder="H"
                        className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Standard cabin: 55 x 35 x 25 cm</p>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="font-bold text-gray-900 mb-4">Payment Information</h3>
                  </div>

                  {/* Card Number */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={formatCardNumber(cardNumber)}
                      onChange={handleCardNumberChange}
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none font-mono"
                    />
                  </div>

                  {/* Cardholder Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="JOHN SMITH"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none uppercase"
                    />
                  </div>

                  {/* Expiry and CVV */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={formatExpiryDate(expiryDate)}
                        onChange={handleExpiryChange}
                        placeholder="MM/YY"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        value={cvv}
                        onChange={handleCvvChange}
                        placeholder="123"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  {/* Security Notice */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                    <Lock className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-blue-900">Secure Payment</p>
                      <p className="text-xs text-blue-700 mt-1">
                        Your payment information is encrypted and secure. This is a mock payment for demo purposes.
                      </p>
                    </div>
                  </div>

                  {/* Pay Button */}
                  <button
                    onClick={handlePayment}
                    disabled={processing}
                    className="w-full py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-bold text-lg hover:from-green-700 hover:to-green-800 transition disabled:from-gray-400 disabled:to-gray-400 shadow-lg"
                  >
                    {processing ? 'Processing Payment...' : `Pay $${price} Now`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>

              {/* Flight Details */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                  <div className="text-3xl">✈️</div>
                  <div>
                    <div className="font-bold text-gray-900">{flight.airlineName || flight.airline}</div>
                    <div className="text-sm text-gray-600">{flight.flightNumber}</div>
                  </div>
                </div>
                
                {flight.type === 'demo' && (
                  <div className="mb-3 bg-yellow-50 border border-yellow-200 rounded px-3 py-2">
                    <p className="text-xs font-semibold text-yellow-800">🎭 DEMO FLIGHT</p>
                  </div>
                )}

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Route:</span>
                    <span className="font-semibold text-gray-900">{flight.origin} → {flight.destination}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-semibold text-gray-900">{formatDate(flight.departure)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Departure:</span>
                    <span className="font-semibold text-gray-900">{formatTime(flight.departure)}</span>
                  </div>
                </div>
              </div>

              {/* Passenger */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="text-sm">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Passenger:</span>
                    <span className="font-semibold text-gray-900">{passengerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-semibold text-gray-900 text-xs">{email}</span>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Luggage ({selectedWeight}kg)</span>
                  <span className="font-semibold">${price}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Insurance</span>
                  <span className="font-semibold text-green-600">FREE</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Service Fee</span>
                  <span className="font-semibold text-green-600">FREE</span>
                </div>
              </div>

              {/* Total */}
              <div className="border-t-2 border-gray-200 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-3xl font-bold text-blue-600">
                    {price === 0 ? 'FREE' : `$${price}`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}