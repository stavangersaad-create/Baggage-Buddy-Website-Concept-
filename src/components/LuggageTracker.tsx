import { Search, Weight, Tag, QrCode, MapPin as MapPinIcon } from 'lucide-react';
import { useState } from 'react';

export function LuggageTracker() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [luggageWeight, setLuggageWeight] = useState('');
  const [showTracking, setShowTracking] = useState(false);

  const handleTrack = () => {
    if (trackingNumber) {
      setShowTracking(true);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Track Your Luggage
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Real-time tracking with unique luggage tags. Know exactly where your bags are, anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Luggage Tag Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Tag className="h-6 w-6 text-blue-600" />
              <h3 className="text-2xl font-bold text-gray-900">Digital Luggage Tag</h3>
            </div>

            {/* Luggage Tag Visual */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 mb-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
              
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-white">
                    <div className="text-sm opacity-80">Baggage Buddy</div>
                    <div className="text-2xl font-bold">BB-{trackingNumber || 'XXXXX'}</div>
                  </div>
                  <QrCode className="h-16 w-16 text-white" />
                </div>

                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 mb-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-white/70 mb-1">Weight</div>
                      <div className="text-white font-semibold">{luggageWeight || '--'} kg</div>
                    </div>
                    <div>
                      <div className="text-xs text-white/70 mb-1">Status</div>
                      <div className="text-green-300 font-semibold">Secured</div>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-white/60">
                  Insurance Coverage: $5,000
                </div>
              </div>
            </div>

            {/* Weight Input */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Weight className="inline h-4 w-4 mr-1" />
                Luggage Weight
              </label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="Enter weight"
                  value={luggageWeight}
                  onChange={(e) => setLuggageWeight(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none pr-16"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                  kg
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Maximum weight limit: 32 kg per item
              </p>
            </div>

            <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition">
              Generate Luggage Tag
            </button>
          </div>

          {/* Track Luggage Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Search className="h-6 w-6 text-blue-600" />
              <h3 className="text-2xl font-bold text-gray-900">Track Your Bag</h3>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tracking Number
              </label>
              <input
                type="text"
                placeholder="Enter your tracking number (e.g., BB-12345)"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>

            <button 
              onClick={handleTrack}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition mb-6"
            >
              Track Luggage
            </button>

            {/* Tracking Results */}
            {showTracking && trackingNumber && (
              <div className="border-2 border-green-500 rounded-xl p-6 bg-green-50">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-semibold text-green-700">Active Tracking</span>
                </div>

                <div className="space-y-4">
                  {/* Timeline */}
                  <div className="relative pl-8 pb-4">
                    <div className="absolute left-2 top-2 bottom-0 w-0.5 bg-gray-300"></div>
                    <div className="absolute left-0 top-2 w-5 h-5 bg-green-500 rounded-full border-4 border-white shadow"></div>
                    <div className="text-sm">
                      <div className="font-semibold text-gray-900">Currently Stored</div>
                      <div className="text-gray-600">Main Storage Facility</div>
                      <div className="text-xs text-gray-500 mt-1">Today, 2:30 PM</div>
                    </div>
                  </div>

                  <div className="relative pl-8 pb-4">
                    <div className="absolute left-2 top-2 bottom-0 w-0.5 bg-gray-300"></div>
                    <div className="absolute left-0 top-2 w-5 h-5 bg-blue-500 rounded-full border-4 border-white shadow"></div>
                    <div className="text-sm">
                      <div className="font-semibold text-gray-900">Checked In</div>
                      <div className="text-gray-600">Reception Desk</div>
                      <div className="text-xs text-gray-500 mt-1">Today, 9:15 AM</div>
                    </div>
                  </div>

                  <div className="relative pl-8">
                    <div className="absolute left-0 top-2 w-5 h-5 bg-gray-300 rounded-full border-4 border-white shadow"></div>
                    <div className="text-sm">
                      <div className="font-semibold text-gray-900">Tag Generated</div>
                      <div className="text-gray-600">Online Booking</div>
                      <div className="text-xs text-gray-500 mt-1">Yesterday, 8:45 PM</div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-green-200">
                  <div className="flex items-start gap-2">
                    <MapPinIcon className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <div className="text-sm font-semibold text-gray-900">Current Location</div>
                      <div className="text-sm text-gray-600">123 Airport Boulevard, Terminal 2</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Features List */}
            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-3 text-gray-700">
                <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <QrCode className="h-4 w-4 text-blue-600" />
                </div>
                <span>Scan QR code for instant tracking</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Weight className="h-4 w-4 text-green-600" />
                </div>
                <span>Automatic weight verification</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <div className="h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <MapPinIcon className="h-4 w-4 text-purple-600" />
                </div>
                <span>Real-time location updates</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
