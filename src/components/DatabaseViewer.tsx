import { Database, Luggage, User, Calendar, ArrowLeft, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface DatabaseViewerProps {
  onNavigate: (page: string) => void;
  accessToken: string;
}

export function DatabaseViewer({ onNavigate, accessToken }: DatabaseViewerProps) {
  const [activeTab, setActiveTab] = useState<'listings' | 'bookings'>('listings');
  const [listings, setListings] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch listings
      const listingsResponse = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-5cdb4afc/listings`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });
      const listingsData = await listingsResponse.json();
      setListings(listingsData.listings || []);

      // Fetch bookings (we'll need to add this endpoint)
      const bookingsResponse = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-5cdb4afc/bookings`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      if (bookingsResponse.ok) {
        const bookingsData = await bookingsResponse.json();
        setBookings(bookingsData.bookings || []);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-gray-900 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Database className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-bold text-white">Database Viewer</span>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={fetchData}
                className="flex items-center gap-2 text-white hover:text-blue-400 transition"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>
              <button 
                onClick={() => onNavigate('admin')}
                className="flex items-center gap-2 text-white hover:text-blue-400 transition"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Admin
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setActiveTab('listings')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'listings'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Luggage className="h-5 w-5" />
            Airline Listings ({listings.length})
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'bookings'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Calendar className="h-5 w-5" />
            Bookings ({bookings.length})
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <RefreshCw className="h-12 w-12 mx-auto mb-4 text-gray-400 animate-spin" />
            <p className="text-gray-600">Loading data...</p>
          </div>
        ) : activeTab === 'listings' ? (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 bg-gray-50 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Airline Listings Database</h2>
              <p className="text-sm text-gray-600 mt-1">All airline luggage capacity listings in the system</p>
            </div>
            {listings.length === 0 ? (
              <div className="p-12 text-center">
                <Luggage className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">No listings in database yet.</p>
                <button
                  onClick={() => onNavigate('admin')}
                  className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Add First Listing
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Airline</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Flight</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Times</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prices (S/M/L)</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Space</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {listings.map((listing) => (
                      <tr key={listing.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{listing.logo}</span>
                            <span className="font-medium text-gray-900">{listing.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {listing.flightNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {listing.departure} - {listing.arrival}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          ${listing.priceSmall} / ${listing.priceMedium} / ${listing.priceLarge}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {listing.availableSpace} bags
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          ⭐ {listing.rating}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {listing.createdAt ? new Date(listing.createdAt).toLocaleDateString() : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 bg-gray-50 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Bookings Database</h2>
              <p className="text-sm text-gray-600 mt-1">All customer bookings in the system</p>
            </div>
            {bookings.length === 0 ? (
              <div className="p-12 text-center">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">No bookings in database yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booking ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Airline</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Route</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bags</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booked At</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {bookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">
                          {booking.id?.replace('booking:', '').substring(0, 12)}...
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{booking.airlineName}</div>
                          <div className="text-xs text-gray-500">{booking.flightNumber}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {booking.route}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {booking.flightDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {booking.numberOfBags} {booking.luggageSize}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                          ${booking.totalPrice}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {booking.userEmail}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {booking.createdAt ? new Date(booking.createdAt).toLocaleString() : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Database Info */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
            <Database className="h-5 w-5" />
            Database Information
          </h3>
          <div className="space-y-1 text-sm text-blue-800">
            <p>• All data is stored in Supabase KV Store (key-value database)</p>
            <p>• Listings are prefixed with "listing:" in the database</p>
            <p>• Bookings are prefixed with "booking:" in the database</p>
            <p>• User authentication is handled by Supabase Auth</p>
            <p>• Database is persistent - data will remain after page refresh</p>
          </div>
        </div>
      </div>
    </div>
  );
}
