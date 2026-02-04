import { Luggage, Download, Plane, Calendar, User, QrCode, Tag, CheckCircle } from 'lucide-react';
import { useRef } from 'react';

interface LuggagePassProps {
  bookingData: {
    bookingId: string;
    tagCode: string;
    passengerName: string;
    airline: string;
    flightNumber: string;
    origin: string;
    destination: string;
    departure: string;
    arrival: string;
    luggageWeight: number;
    price: number;
    flightType: 'live' | 'demo';
  };
  onNavigate: (page: string) => void;
}

export function LuggagePass({ bookingData, onNavigate }: LuggagePassProps) {
  const passRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatFullDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  };

  const downloadPass = async () => {
    // Use browser's print dialog to save as PDF
    window.print();
  };

  const downloadTag = async () => {
    // Use browser's print dialog to save as PDF
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button 
              onClick={() => onNavigate('home')} 
              className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition"
            >
              <Luggage className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Baggage Buddy</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Success Message */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-gray-600 text-lg">
            Your luggage space has been reserved. Download your documents below.
          </p>
        </div>

        {/* Luggage Pass (Boarding Pass Style) */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Luggage Pass</h2>
            <button
              onClick={downloadPass}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              <Download className="h-5 w-5" />
              Download Pass PDF
            </button>
          </div>

          <div ref={passRef} className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {bookingData.flightType === 'demo' && (
              <div className="bg-yellow-400 text-yellow-900 text-center py-2 font-bold text-sm">
                🎭 DEMO BOOKING - FOR DEMONSTRATION PURPOSES ONLY
              </div>
            )}
            
            {/* Boarding Pass Main Section */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="text-blue-100 text-sm mb-1">Luggage Reservation</div>
                  <div className="text-white text-3xl font-bold">BAGGAGE BUDDY</div>
                </div>
                <div className="text-right">
                  <div className="text-blue-100 text-sm">Booking ID</div>
                  <div className="text-white text-xl font-mono font-bold">{bookingData.bookingId}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-6">
                <div>
                  <div className="text-blue-100 text-sm mb-1">Passenger Name</div>
                  <div className="text-white text-2xl font-bold uppercase">{bookingData.passengerName}</div>
                </div>
                <div>
                  <div className="text-blue-100 text-sm mb-1">Airline</div>
                  <div className="text-white text-2xl font-bold">{bookingData.airline}</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-blue-100 text-sm mb-1">Flight</div>
                  <div className="text-white text-xl font-bold">{bookingData.flightNumber}</div>
                </div>
                <div>
                  <div className="text-blue-100 text-sm mb-1">From</div>
                  <div className="text-white text-3xl font-bold">{bookingData.origin}</div>
                </div>
                <div>
                  <div className="text-blue-100 text-sm mb-1">To</div>
                  <div className="text-white text-3xl font-bold">{bookingData.destination}</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8">
              <div className="grid grid-cols-4 gap-6 mb-8">
                <div>
                  <div className="text-gray-500 text-sm mb-1">Date</div>
                  <div className="text-gray-900 font-bold">{formatDate(bookingData.departure)}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-sm mb-1">Departure</div>
                  <div className="text-gray-900 font-bold">{formatTime(bookingData.departure)}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-sm mb-1">Arrival</div>
                  <div className="text-gray-900 font-bold">{formatTime(bookingData.arrival)}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-sm mb-1">Luggage Weight</div>
                  <div className="text-gray-900 font-bold text-xl">{bookingData.luggageWeight} kg</div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6 flex items-center justify-between">
                <div>
                  <div className="text-gray-500 text-sm mb-1">Tag Code</div>
                  <div className="text-gray-900 font-mono font-bold text-lg">{bookingData.tagCode}</div>
                </div>
                <div className="flex items-center justify-center w-32 h-32 border-2 border-gray-300 rounded-lg">
                  <QrCode className="h-24 w-24 text-gray-400" />
                  <div className="absolute text-xs text-gray-500 mt-24">QR CODE</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-100 px-8 py-4 text-sm text-gray-600">
              <p><strong>Important:</strong> Present this pass and your baggage tag at the airline check-in counter. Your luggage must match the weight specified above.</p>
            </div>
          </div>
        </div>

        {/* Baggage Tag */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Baggage Tag</h2>
            <button
              onClick={downloadTag}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              <Download className="h-5 w-5" />
              Print / Save as PDF
            </button>
          </div>

          <div className="max-w-md mx-auto">
            <div ref={tagRef} className="bg-white rounded-xl shadow-2xl overflow-hidden border-4 border-blue-600">
              {/* Tag Header */}
              <div className="bg-blue-600 p-6 text-center">
                <Luggage className="h-12 w-12 mx-auto mb-2 text-white" />
                <div className="text-white text-2xl font-bold">BAGGAGE BUDDY</div>
                <div className="text-blue-100 text-sm mt-1">Luggage Tag</div>
              </div>

              {/* Tag Content */}
              <div className="p-6 space-y-4">
                <div className="text-center border-b-2 border-dashed border-gray-300 pb-4">
                  <div className="text-gray-500 text-sm mb-1">Tag Code</div>
                  <div className="text-gray-900 font-mono font-bold text-2xl">{bookingData.tagCode}</div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-gray-500 text-sm mb-1">From</div>
                    <div className="text-gray-900 font-bold text-3xl">{bookingData.origin}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-sm mb-1">To</div>
                    <div className="text-gray-900 font-bold text-3xl">{bookingData.destination}</div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Flight:</span>
                    <span className="font-bold text-gray-900">{bookingData.flightNumber}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Weight:</span>
                    <span className="font-bold text-gray-900">{bookingData.luggageWeight} kg</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-bold text-gray-900">{formatDate(bookingData.departure)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Booking:</span>
                    <span className="font-mono text-sm font-bold text-gray-900">{bookingData.bookingId}</span>
                  </div>
                </div>

                {/* Barcode/QR Placeholder */}
                <div className="flex items-center justify-center bg-gray-50 border-2 border-gray-300 rounded-lg py-6">
                  <div className="text-center">
                    <QrCode className="h-20 w-20 mx-auto mb-2 text-gray-400" />
                    <div className="text-xs text-gray-500">SCAN AT CHECK-IN</div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-xs text-yellow-800">
                  <strong>⚠️ Attach securely:</strong> Attach this tag to your luggage handle before check-in
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <button
            onClick={() => onNavigate('home')}
            className="px-8 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
          >
            Back to Home
          </button>
          <button
            onClick={() => onNavigate('database')}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            View My Bookings
          </button>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-white rounded-xl shadow-md p-6">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Tag className="h-5 w-5 text-blue-600" />
            What to do next
          </h3>
          <ol className="space-y-3 text-gray-700">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
              <span>Download and print both the Luggage Pass and Baggage Tag (or save to your phone)</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
              <span>Attach the printed Baggage Tag securely to your luggage handle</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
              <span>Arrive at the airport and present your Luggage Pass at the {bookingData.airline} check-in counter</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
              <span>Your luggage will be weighed and checked according to your reservation</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}