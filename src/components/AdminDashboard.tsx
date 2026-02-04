import { Luggage, Plus, Edit2, Trash2, ArrowLeft, Save, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface Listing {
  id: string;
  name: string;
  logo: string;
  flightNumber: string;
  departure: string;
  arrival: string;
  priceSmall: number;
  priceMedium: number;
  priceLarge: number;
  availableSpace: number;
  rating: number;
  savings: number;
}

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
  accessToken: string;
}

export function AdminDashboard({ onNavigate, accessToken }: AdminDashboardProps) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Listing>>({
    name: '',
    logo: '✈️',
    flightNumber: '',
    departure: '09:00',
    arrival: '14:30',
    priceSmall: 5,
    priceMedium: 8,
    priceLarge: 12,
    availableSpace: 10,
    rating: 4.5,
    savings: 45,
  });

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-5cdb4afc/listings`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });
      const data = await response.json();
      setListings(data.listings || []);
    } catch (error) {
      console.error('Failed to fetch listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        // Update existing listing
        const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-5cdb4afc/listings/${editingId.replace('listing:', '')}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify(formData)
        });

        if (!response.ok) {
          alert('Failed to update listing');
          return;
        }
      } else {
        // Create new listing
        const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-5cdb4afc/listings`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify(formData)
        });

        if (!response.ok) {
          alert('Failed to create listing');
          return;
        }
      }

      // Reset form and refresh listings
      setFormData({
        name: '',
        logo: '✈️',
        flightNumber: '',
        departure: '09:00',
        arrival: '14:30',
        priceSmall: 5,
        priceMedium: 8,
        priceLarge: 12,
        availableSpace: 10,
        rating: 4.5,
        savings: 45,
      });
      setEditingId(null);
      setShowAddForm(false);
      fetchListings();
    } catch (error) {
      console.error('Failed to save listing:', error);
      alert('Failed to save listing');
    }
  };

  const handleEdit = (listing: Listing) => {
    setFormData(listing);
    setEditingId(listing.id);
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) {
      return;
    }

    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-5cdb4afc/listings/${id.replace('listing:', '')}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        alert('Failed to delete listing');
        return;
      }

      fetchListings();
    } catch (error) {
      console.error('Failed to delete listing:', error);
      alert('Failed to delete listing');
    }
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      logo: '✈️',
      flightNumber: '',
      departure: '09:00',
      arrival: '14:30',
      priceSmall: 5,
      priceMedium: 8,
      priceLarge: 12,
      availableSpace: 10,
      rating: 4.5,
      savings: 45,
    });
    setEditingId(null);
    setShowAddForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-gray-900 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Luggage className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-bold text-white">Admin Dashboard</span>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => onNavigate('database')}
                className="text-white hover:text-blue-400 transition font-medium"
              >
                View Database
              </button>
              <button 
                onClick={() => onNavigate('home')}
                className="flex items-center gap-2 text-white hover:text-blue-400 transition"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Site
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Airline Listings</h1>
            <p className="text-gray-600 mt-1">Add and edit available luggage space from airlines</p>
          </div>
          {!showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition shadow-md flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Add Listing
            </button>
          )}
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {editingId ? 'Edit Listing' : 'Add New Listing'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Airline Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., United Airlines"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Logo (Emoji)</label>
                <input
                  type="text"
                  value={formData.logo}
                  onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., ✈️"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Flight Number</label>
                <input
                  type="text"
                  value={formData.flightNumber}
                  onChange={(e) => setFormData({ ...formData, flightNumber: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., UA 123"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Available Space (bags)</label>
                <input
                  type="number"
                  value={formData.availableSpace}
                  onChange={(e) => setFormData({ ...formData, availableSpace: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Departure Time</label>
                <input
                  type="time"
                  value={formData.departure}
                  onChange={(e) => setFormData({ ...formData, departure: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Arrival Time</label>
                <input
                  type="time"
                  value={formData.arrival}
                  onChange={(e) => setFormData({ ...formData, arrival: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Small ($)</label>
                <input
                  type="number"
                  value={formData.priceSmall}
                  onChange={(e) => setFormData({ ...formData, priceSmall: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Medium ($)</label>
                <input
                  type="number"
                  value={formData.priceMedium}
                  onChange={(e) => setFormData({ ...formData, priceMedium: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Large ($)</label>
                <input
                  type="number"
                  value={formData.priceLarge}
                  onChange={(e) => setFormData({ ...formData, priceLarge: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating (1-5)</label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="5"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Savings %</label>
                <input
                  type="number"
                  value={formData.savings}
                  onChange={(e) => setFormData({ ...formData, savings: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSave}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition flex items-center justify-center gap-2"
              >
                <Save className="h-5 w-5" />
                {editingId ? 'Update' : 'Save'} Listing
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition flex items-center justify-center gap-2"
              >
                <X className="h-5 w-5" />
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Listings Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-500">Loading listings...</div>
          ) : listings.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <Luggage className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg">No listings yet. Add your first airline listing!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Airline</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Flight #</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Times</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prices</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Space</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{listing.flightNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {listing.departure} - {listing.arrival}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        ${listing.priceSmall} / ${listing.priceMedium} / ${listing.priceLarge}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{listing.availableSpace} bags</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">⭐ {listing.rating}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(listing)}
                            className="text-blue-600 hover:text-blue-800 transition"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(listing.id)}
                            className="text-red-600 hover:text-red-800 transition"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}