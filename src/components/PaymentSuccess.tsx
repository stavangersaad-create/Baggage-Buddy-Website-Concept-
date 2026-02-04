import { CheckCircle, Luggage, Download, Mail, ArrowRight } from 'lucide-react';

interface PaymentSuccessProps {
  bookingId: string;
  bookingDetails: {
    airline: string;
    flightNumber: string;
    route: string;
    date: string;
    bags: string;
    size: string;
    total: string;
  };
  onNavigate: (page: string) => void;
}

export function PaymentSuccess({ bookingId, bookingDetails, onNavigate }: PaymentSuccessProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-4 animate-bounce">
            <CheckCircle className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Payment Successful!
          </h1>
          <p className="text-xl text-gray-600">
            Your luggage space has been confirmed
          </p>
        </div>

        {/* Booking Details Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200">
            <Luggage className="h-8 w-8 text-blue-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Booking Confirmed</h2>
              <p className="text-gray-600">Confirmation #: {bookingId}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Airline</p>
                <p className="font-semibold text-gray-900">{bookingDetails.airline}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Flight Number</p>
                <p className="font-semibold text-gray-900">{bookingDetails.flightNumber}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Route</p>
                <p className="font-semibold text-gray-900">{bookingDetails.route}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Date</p>
                <p className="font-semibold text-gray-900">{bookingDetails.date}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Luggage</p>
                <p className="font-semibold text-gray-900">{bookingDetails.bags} {bookingDetails.size}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Paid</p>
                <p className="font-semibold text-green-600 text-xl">${bookingDetails.total}</p>
              </div>
            </div>
          </div>

          {/* Insurance Info */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-blue-600" />
              Insurance included: $5,000 coverage per bag
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h3 className="font-bold text-gray-900 mb-4">Next Steps</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-gray-700">
              <Mail className="h-5 w-5 text-blue-600" />
              <span>Confirmation email sent to your inbox</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <Download className="h-5 w-5 text-blue-600" />
              <span>Digital baggage tags are ready to download</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <CheckCircle className="h-5 w-5 text-blue-600" />
              <span>Present tags at airport check-in</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => onNavigate('tags')}
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition shadow-md flex items-center justify-center gap-2"
          >
            View Baggage Tags
            <ArrowRight className="h-5 w-5" />
          </button>
          <button
            onClick={() => onNavigate('home')}
            className="flex-1 bg-white text-gray-700 px-6 py-4 rounded-lg font-semibold border-2 border-gray-300 hover:bg-gray-50 transition flex items-center justify-center gap-2"
          >
            Back to Home
          </button>
        </div>

        <p className="text-center text-gray-600 text-sm mt-6">
          Questions? Contact us at support@baggagebuddy.com
        </p>
      </div>
    </div>
  );
}
