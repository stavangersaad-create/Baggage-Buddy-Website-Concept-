import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { HowItWorks } from './components/HowItWorks';
import { LuggageSizes } from './components/LuggageSizes';
import { CTA } from './components/CTA';
import { Footer } from './components/Footer';
import { BaggageTagsPage } from './components/BaggageTagsPage';
import { SearchResults } from './components/SearchResults';
import { AuthPage } from './components/AuthPage';
import { PaymentSuccess } from './components/PaymentSuccess';
import { AdminDashboard } from './components/AdminDashboard';
import { DatabaseViewer } from './components/DatabaseViewer';
import { LuggagePass } from './components/LuggagePass';
import { NewConfirmationPage } from './components/NewConfirmationPage';
import { PaymentPage } from './components/PaymentPage';
import { useState, useEffect } from 'react';
import { getSupabaseClient } from './utils/supabase/client';

interface SearchParams {
  fromCity: string;
  toCity: string;
  flightDate: string;
  numberOfBags: string;
  luggageSize: string;
}

interface PaymentDetails {
  bookingId: string;
  airline: string;
  flightNumber: string;
  route: string;
  date: string;
  bags: string;
  size: string;
  total: string;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [luggagePassData, setLuggagePassData] = useState<any>(null);
  const [confirmationData, setConfirmationData] = useState<any>(null);
  const [paymentPageData, setPaymentPageData] = useState<any>(null);
  const [bookingIdFromURL, setBookingIdFromURL] = useState<string | null>(null);

  const supabase = getSupabaseClient();

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setAccessToken(session.access_token);
        setUser(session.user);
      }
    };
    checkSession();

    // Check for URL parameters (e.g., ?page=confirmation&bookingId=BB-12345)
    const urlParams = new URLSearchParams(window.location.search);
    const page = urlParams.get('page');
    const bookingId = urlParams.get('bookingId');
    
    if (page === 'confirmation' && bookingId) {
      console.log('URL routing: confirmation page with bookingId:', bookingId);
      setBookingIdFromURL(bookingId);
      setCurrentPage('confirmation');
    }
  }, [supabase]);

  const handleSearch = (params: SearchParams) => {
    setSearchParams(params);
    setCurrentPage('search-results');
  };

  const handleSignIn = (token: string, userData: any) => {
    setAccessToken(token);
    setUser(userData);
    setCurrentPage('home');
  };

  const handleNavigate = (page: string, data?: any) => {
    console.log('handleNavigate called with page:', page, 'data:', data);
    if (page === 'luggage-pass' && data) {
      setLuggagePassData(data);
    }
    if (page === 'confirmation' && data) {
      console.log('Setting confirmation data:', data);
      setConfirmationData(data);
    }
    if (page === 'payment' && data) {
      setPaymentPageData(data);
    }
    console.log('Setting currentPage to:', page);
    setCurrentPage(page);
  };

  const handleBookingComplete = (bookingId: string, details: any) => {
    if (!searchParams) return;
    
    setPaymentDetails({
      bookingId,
      airline: details.airline || 'Airline',
      flightNumber: details.flightNumber || 'FL123',
      route: `${searchParams.fromCity} → ${searchParams.toCity}`,
      date: searchParams.flightDate,
      bags: searchParams.numberOfBags,
      size: searchParams.luggageSize,
      total: details.total || '0',
    });
    setCurrentPage('payment-success');
  };

  // Auth page
  if (currentPage === 'auth') {
    return <AuthPage onNavigate={setCurrentPage} onSignIn={handleSignIn} />;
  }

  // Admin dashboard
  if (currentPage === 'admin' && accessToken) {
    return <AdminDashboard onNavigate={setCurrentPage} accessToken={accessToken} />;
  }

  // Database viewer
  if (currentPage === 'database' && accessToken) {
    return <DatabaseViewer onNavigate={setCurrentPage} accessToken={accessToken} />;
  }

  // Payment success page
  if (currentPage === 'payment-success' && paymentDetails) {
    return (
      <PaymentSuccess 
        bookingId={paymentDetails.bookingId}
        bookingDetails={paymentDetails}
        onNavigate={setCurrentPage}
      />
    );
  }

  // Baggage tags page
  if (currentPage === 'tags') {
    return <BaggageTagsPage onNavigate={setCurrentPage} />;
  }

  // Luggage pass page
  if (currentPage === 'luggage-pass' && luggagePassData) {
    return <LuggagePass bookingData={luggagePassData} onNavigate={setCurrentPage} />;
  }

  // Confirmation page - PUBLIC PAGE, loads from localStorage using bookingId
  if (currentPage === 'confirmation') {
    const bookingId = bookingIdFromURL || confirmationData?.bookingId;
    
    if (bookingId) {
      // Load booking data from localStorage
      const savedBooking = localStorage.getItem(`booking_${bookingId}`);
      if (savedBooking) {
        const bookingData = JSON.parse(savedBooking);
        console.log('Rendering confirmation page with data from localStorage:', bookingData);
        return <NewConfirmationPage bookingData={bookingData} onNavigate={setCurrentPage} />;
      }
    }
    
    // If we have confirmationData from navigation, use it
    if (confirmationData) {
      console.log('Rendering confirmation page with data from navigation:', confirmationData);
      return <NewConfirmationPage bookingData={confirmationData} onNavigate={setCurrentPage} />;
    }
    
    // If no data found, show error
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Booking Not Found</h1>
          <p className="text-gray-600 mb-6">We couldn't find this booking.</p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  console.log('Current page:', currentPage, 'Confirmation data:', confirmationData);

  // Payment page
  if (currentPage === 'payment' && paymentPageData) {
    return (
      <PaymentPage
        bookingDetails={paymentPageData}
        onBack={() => setCurrentPage('search-results')}
        onNavigate={handleNavigate}
        accessToken={accessToken}
      />
    );
  }

  // Search results page
  if (currentPage === 'search-results' && searchParams) {
    return (
      <SearchResults 
        searchParams={searchParams} 
        onBack={() => setCurrentPage('home')}
        onNavigate={handleNavigate}
        onBookingComplete={handleBookingComplete}
        accessToken={accessToken}
        user={user}
      />
    );
  }

  // Home page
  return (
    <div className="min-h-screen">
      <Hero 
        onNavigate={setCurrentPage} 
        onSearch={handleSearch}
        user={user}
        onSignOut={() => {
          setAccessToken(null);
          setUser(null);
          supabase.auth.signOut();
        }}
      />
      <LuggageSizes />
      <Services />
      <HowItWorks />
      <CTA />
      <Footer />
    </div>
  );
}