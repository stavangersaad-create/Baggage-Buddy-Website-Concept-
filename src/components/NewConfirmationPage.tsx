import { Luggage, Download, QrCode, Plane, Mail, Home, ArrowRight } from 'lucide-react';
import { useState, useMemo } from 'react';

interface BookingData {
  bookingId: string;
  tagCode: string;
  fullName: string;
  email?: string;
  recipientName?: string;
  luggageType?: string;
  luggageDimensions?: string;
  airline: string;
  flightNumber: string;
  routeOrigin: string;
  routeDestination: string;
  departure: string;
  arrival: string;
  departureDate: string;
  departureTime: string;
  weightKg: number;
  totalPaid: number;
  flightType?: 'live' | 'demo';
}

interface ConfirmationPageProps {
  bookingData: BookingData;
  onNavigate: (page: string) => void;
}

export function NewConfirmationPage({ bookingData, onNavigate }: ConfirmationPageProps) {
  const [emailAddress, setEmailAddress] = useState(bookingData.email || '');
  const [emailSent, setEmailSent] = useState(false);
  const [sending, setSending] = useState(false);

  const isPaid = bookingData.totalPaid > 0;

  const downloadPass = () => {
    window.print();
  };

  const sendEmailHandler = async () => {
    if (!emailAddress.trim()) {
      alert('Please enter an email address');
      return;
    }

    setSending(true);
    setTimeout(() => {
      setEmailSent(true);
      setSending(false);
      alert(`Pass and tag sent to ${emailAddress}`);
    }, 1500);
  };

  const originCode = bookingData.routeOrigin.split(',')[0].trim();
  const destinationCode = bookingData.routeDestination.split(',')[0].trim();

  // Generate stable barcode patterns
  const topBarcodePattern = useMemo(() => {
    const seed = bookingData.bookingId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return Array.from({ length: 40 }).map((_, i) => ({
      width: ((seed + i * 7) % 2 === 0) ? '3px' : '2px',
      height: ((seed + i * 11) % 10 > 3) ? '80px' : '70px',
    }));
  }, [bookingData.bookingId]);

  const bottomBarcodePattern = useMemo(() => {
    const seed = bookingData.tagCode.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return Array.from({ length: 35 }).map((_, i) => ({
      width: ((seed + i * 5) % 2 === 0) ? '3px' : '2px',
      height: ((seed + i * 13) % 10 > 3) ? '50px' : '45px',
    }));
  }, [bookingData.tagCode]);

  // Generate vertical barcode pattern for center
  const verticalBarcodePattern = useMemo(() => {
    const seed = bookingData.tagCode.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return Array.from({ length: 50 }).map((_, i) => ({
      width: ((seed + i * 3) % 3 === 0) ? '4px' : ((seed + i * 5) % 2 === 0) ? '2px' : '3px',
    }));
  }, [bookingData.tagCode]);

  // Generate horizontal barcode pattern for top
  const horizontalBarcodePattern = useMemo(() => {
    const seed = bookingData.bookingId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return Array.from({ length: 8 }).map((_, i) => ({
      height: ((seed + i * 7) % 3 === 0) ? '8px' : ((seed + i * 5) % 2 === 0) ? '6px' : '10px',
    }));
  }, [bookingData.bookingId]);

  // Determine stripe color based on destination
  const stripeColor = useMemo(() => {
    const colors = ['bg-green-500', 'bg-red-500', 'bg-blue-500', 'bg-yellow-500', 'bg-purple-500'];
    const index = destinationCode.charCodeAt(0) % colors.length;
    return colors[index];
  }, [destinationCode]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Luggage className="h-5 w-5 text-blue-600" />
              <span className="text-lg font-semibold text-gray-900">Baggage Buddy</span>
            </div>
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition text-sm font-medium"
            >
              <Home className="h-4 w-4" />
              Back to Home
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Header */}
        <div className="mb-8 print:hidden">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            {isPaid ? 'Payment Confirmed' : 'Booking Confirmed'}
          </h1>
          <p className="text-gray-600">
            Your booking has been confirmed. Please download your baggage pass and tag below.
          </p>
          {bookingData.flightType === 'demo' && (
            <div className="inline-block bg-amber-50 border border-amber-200 rounded-md px-4 py-2 mt-4">
              <p className="text-sm text-amber-800">Demo Booking — For demonstration purposes</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-8 print:hidden">
          <button
            onClick={downloadPass}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition font-medium"
          >
            <Download className="h-5 w-5" />
            Download Pass & Tag
          </button>
          <div className="flex-1 min-w-[300px] flex gap-2">
            <input
              type="email"
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
              placeholder="Email to send pass & tag"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none text-sm"
            />
            <button
              onClick={sendEmailHandler}
              disabled={sending || emailSent}
              className="bg-gray-800 text-white px-5 py-3 rounded-md hover:bg-gray-900 transition disabled:bg-gray-400 font-medium text-sm"
            >
              {sending ? 'Sending...' : emailSent ? 'Sent' : 'Send'}
            </button>
          </div>
        </div>

        {/* BOARDING PASS STYLE CARD */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6 print:shadow-none">
          {/* Header Bar */}
          <div className="bg-gray-900 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Luggage className="h-5 w-5 text-white" />
              <span className="text-white font-semibold text-sm">BAGGAGE BUDDY</span>
            </div>
            <span className="text-gray-400 text-xs uppercase tracking-wider">Baggage Pass</span>
          </div>

          <div className="p-6">
            {/* Top Section: Passenger & Booking Details */}
            <div className="flex justify-between items-start mb-6 pb-6 border-b-2 border-dashed border-gray-300">
              <div className="flex-1">
                <div className="mb-4">
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Passenger Name</div>
                  <div className="text-xl font-bold text-gray-900">{bookingData.fullName}</div>
                </div>
                {bookingData.recipientName && (
                  <div className="mb-4">
                    <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Recipient</div>
                    <div className="text-sm font-medium text-gray-700">{bookingData.recipientName}</div>
                  </div>
                )}
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Booking Reference</div>
                <div className="text-2xl font-bold text-gray-900 font-mono">{bookingData.bookingId}</div>
              </div>
            </div>

            {/* Flight & Route Information */}
            <div className="grid grid-cols-4 gap-6 mb-6">
              {/* From */}
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">From</div>
                <div className="text-3xl font-bold text-gray-900">{originCode}</div>
                <div className="text-xs text-gray-600 mt-1">{bookingData.routeOrigin.split(',').slice(1).join(',').trim()}</div>
              </div>

              {/* Arrow */}
              <div className="flex items-center justify-center">
                <ArrowRight className="h-6 w-6 text-gray-400" />
              </div>

              {/* To */}
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">To</div>
                <div className="text-3xl font-bold text-gray-900">{destinationCode}</div>
                <div className="text-xs text-gray-600 mt-1">{bookingData.routeDestination.split(',').slice(1).join(',').trim()}</div>
              </div>

              {/* QR Code */}
              <div className="flex items-center justify-center">
                <div className="bg-white border-2 border-gray-300 p-2 rounded">
                  <div className="w-24 h-24 bg-gray-100 flex items-center justify-center">
                    <QrCode className="h-16 w-16 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Flight Details Grid */}
            <div className="grid grid-cols-5 gap-4 pt-6 border-t border-gray-200">
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Date</div>
                <div className="text-sm font-semibold text-gray-900">{bookingData.departureDate}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Time</div>
                <div className="text-sm font-semibold text-gray-900">{bookingData.departureTime}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Flight</div>
                <div className="text-sm font-semibold text-gray-900">{bookingData.flightNumber}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Airline</div>
                <div className="text-sm font-semibold text-gray-900">{bookingData.airline}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Weight</div>
                <div className="text-sm font-semibold text-gray-900">{bookingData.weightKg} kg</div>
              </div>
            </div>

            {/* Tag Code Bar */}
            <div className="mt-6 bg-amber-50 border border-amber-300 rounded px-4 py-3 flex items-center justify-between">
              <div>
                <div className="text-xs text-amber-800 uppercase tracking-wide mb-1">Baggage Tag Code</div>
                <div className="text-xl font-bold text-amber-900 font-mono">{bookingData.tagCode}</div>
              </div>
              <div className="text-xs text-amber-700">
                Present at bag drop
              </div>
            </div>

            {/* Footer Note */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-600">
                Show this pass at the Baggage Buddy counter or airline bag drop. Ensure your baggage tag is securely attached to your luggage.
              </p>
            </div>
          </div>
        </div>

        {/* BAGGAGE TAG */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6 print:shadow-none print:break-before-page">
          <div className="bg-gray-900 px-6 py-3">
            <span className="text-white font-semibold text-sm">BAGGAGE TAG — ATTACH TO LUGGAGE</span>
          </div>
          
          <div className="p-6 flex justify-center">
            {/* Professional Airline Baggage Tag */}
            <div className="w-80 bg-white border-2 border-black">
              {/* Top Horizontal Barcode */}
              <div className="p-3 border-b-2 border-gray-400">
                <div className="space-y-1">
                  {horizontalBarcodePattern.map((bar, i) => (
                    <div
                      key={i}
                      className="bg-black w-full"
                      style={{ height: bar.height }}
                    />
                  ))}
                </div>
                <div className="text-center text-[10px] font-mono mt-2 tracking-wider">
                  {bookingData.bookingId}
                </div>
              </div>

              {/* Main Content with Vertical Barcode and Color Stripes */}
              <div className="flex relative">
                {/* Left Color Stripe */}
                <div className={`absolute left-0 top-0 bottom-0 w-2 ${stripeColor}`} />
                
                {/* Center Content */}
                <div className="flex-1 px-6 py-4">
                  {/* Vertical Barcode */}
                  <div className="flex justify-center mb-3">
                    <div className="flex gap-0">
                      {verticalBarcodePattern.map((bar, i) => (
                        <div
                          key={i}
                          className="bg-black h-32"
                          style={{ width: bar.width }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Tag Code Below Vertical Barcode */}
                  <div className="text-center text-xs font-mono mb-4 tracking-wider">
                    {bookingData.tagCode}
                  </div>

                  {/* Destination Airport Code */}
                  <div className="bg-black text-white py-4 px-4 mb-3 text-center">
                    <div className="text-7xl font-black tracking-tight leading-none">
                      {destinationCode}
                    </div>
                  </div>

                  {/* Flight Info */}
                  <div className="text-center mb-2">
                    <div className="text-[10px] text-gray-600 uppercase tracking-wide">Flight</div>
                    <div className="text-sm font-bold">{bookingData.airline} {bookingData.flightNumber}</div>
                  </div>

                  {/* Origin */}
                  <div className="text-center mb-2">
                    <div className="text-[10px] text-gray-600 uppercase tracking-wide">From</div>
                    <div className="text-sm font-bold">{originCode}</div>
                  </div>

                  {/* Passenger */}
                  <div className="text-center mb-2">
                    <div className="text-[10px] text-gray-600 uppercase tracking-wide">Passenger</div>
                    <div className="text-xs font-semibold">{bookingData.fullName}</div>
                  </div>

                  {/* Weight */}
                  <div className="text-center">
                    <div className="text-[10px] text-gray-600 uppercase tracking-wide">Weight</div>
                    <div className="text-xs font-semibold">{bookingData.weightKg} kg</div>
                  </div>
                </div>

                {/* Right Color Stripe */}
                <div className={`absolute right-0 top-0 bottom-0 w-2 ${stripeColor}`} />
              </div>

              {/* Bottom Horizontal Barcode */}
              <div className="p-3 border-t-2 border-gray-400">
                <div className="space-y-1">
                  {horizontalBarcodePattern.slice().reverse().map((bar, i) => (
                    <div
                      key={i}
                      className="bg-black w-full"
                      style={{ height: bar.height }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* DELIVERY INSTRUCTIONS */}
        <div className="bg-white rounded-lg shadow-md p-6 print:shadow-none">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">How to deliver your luggage</h2>
          
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-bold">
                1
              </div>
              <p className="text-sm text-gray-700 pt-0.5">
                Print the baggage tag and attach it securely to your luggage handle
              </p>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-bold">
                2
              </div>
              <p className="text-sm text-gray-700 pt-0.5">
                Arrive at {originCode} airport before departure time on {bookingData.departureDate}
              </p>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-bold">
                3
              </div>
              <p className="text-sm text-gray-700 pt-0.5">
                Present your baggage pass at the Baggage Buddy counter or airline bag drop
              </p>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-bold">
                4
              </div>
              <p className="text-sm text-gray-700 pt-0.5">
                Staff will scan your QR code or tag code to register your luggage
              </p>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-bold">
                5
              </div>
              <p className="text-sm text-gray-700 pt-0.5">
                Your luggage will be loaded onto {bookingData.airline} flight {bookingData.flightNumber}
              </p>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-bold">
                6
              </div>
              <p className="text-sm text-gray-700 pt-0.5">
                Recipient collects luggage at {destinationCode} using the tag code
              </p>
            </div>
          </div>

          <div className="mt-6 bg-blue-50 border border-blue-200 rounded px-4 py-3">
            <p className="text-xs text-blue-900">
              <span className="font-semibold">Important:</span> Keep a screenshot or photo of your booking ID ({bookingData.bookingId}) and tag code ({bookingData.tagCode}) for reference.
            </p>
          </div>
        </div>

        {/* Thank You Section */}
        <div className="mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-lg overflow-hidden print:shadow-none">
          <div className="px-8 py-10 text-center">
            <div className="mb-4">
              <Luggage className="h-12 w-12 text-white mx-auto mb-3 opacity-90" />
            </div>
            <h2 className="text-4xl font-bold text-white mb-3">
              Thank You!
            </h2>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto">
              We appreciate your trust in Baggage Buddy. Have a wonderful journey!
            </p>
            <div className="mt-6 flex items-center justify-center gap-2">
              <div className="h-1 w-12 bg-white/30 rounded"></div>
              <Plane className="h-5 w-5 text-white/70" />
              <div className="h-1 w-12 bg-white/30 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}