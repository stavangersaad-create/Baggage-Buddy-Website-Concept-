import { ImageWithFallback } from './figma/ImageWithFallback';
import { Luggage, Menu, X, Plane, Calendar } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const CITIES = [
  'New York, USA', 'London, UK', 'Paris, France', 'Tokyo, Japan', 'Singapore', 
  'Dubai, UAE', 'Los Angeles, USA', 'Barcelona, Spain', 'Amsterdam, Netherlands',
  'Rome, Italy', 'Berlin, Germany', 'Madrid, Spain', 'Hong Kong', 'Sydney, Australia',
  'Bangkok, Thailand', 'Istanbul, Turkey', 'Vienna, Austria', 'Prague, Czech Republic',
  'Lisbon, Portugal', 'Copenhagen, Denmark', 'Stockholm, Sweden', 'Oslo, Norway',
  'Athens, Greece', 'Dublin, Ireland', 'Brussels, Belgium', 'Zurich, Switzerland',
  'Toronto, Canada', 'Vancouver, Canada', 'Montreal, Canada', 'San Francisco, USA',
  'Chicago, USA', 'Boston, USA', 'Miami, USA', 'Las Vegas, USA', 'Seattle, USA',
  'Melbourne, Australia', 'Auckland, New Zealand', 'Seoul, South Korea', 'Taipei, Taiwan',
  'Shanghai, China', 'Beijing, China', 'Mumbai, India', 'Delhi, India', 'Bangalore, India'
];

export function Hero({ onNavigate, onSearch, user, onSignOut }: { 
  onNavigate: (page: string) => void;
  onSearch: (params: {
    fromCity: string;
    toCity: string;
    flightDate: string;
    numberOfBags: string;
    luggageSize: string;
  }) => void;
  user?: any;
  onSignOut?: () => void;
}) {
  const [fromCity, setFromCity] = useState('');
  const [toCity, setToCity] = useState('');
  const [showFromCities, setShowFromCities] = useState(false);
  const [showToCities, setShowToCities] = useState(false);
  const [filteredFromCities, setFilteredFromCities] = useState(CITIES);
  const [filteredToCities, setFilteredToCities] = useState(CITIES);
  const [flightDate, setFlightDate] = useState('');
  const [numberOfBags, setNumberOfBags] = useState('1');
  const [luggageSize, setLuggageSize] = useState('Medium');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Get today's date in YYYY-MM-DD format for min attribute
  const today = new Date().toISOString().split('T')[0];

  const fromDropdownRef = useRef<HTMLDivElement>(null);
  const toDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (fromDropdownRef.current && !fromDropdownRef.current.contains(event.target as Node)) {
        setShowFromCities(false);
      }
      if (toDropdownRef.current && !toDropdownRef.current.contains(event.target as Node)) {
        setShowToCities(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleFromCityChange = (value: string) => {
    setFromCity(value);
    if (value.trim()) {
      const filtered = CITIES.filter(city => 
        city.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredFromCities(filtered);
      setShowFromCities(true);
    } else {
      setFilteredFromCities(CITIES);
      setShowFromCities(false);
    }
  };

  const handleToCityChange = (value: string) => {
    setToCity(value);
    if (value.trim()) {
      const filtered = CITIES.filter(city => 
        city.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredToCities(filtered);
      setShowToCities(true);
    } else {
      setFilteredToCities(CITIES);
      setShowToCities(false);
    }
  };

  const selectFromCity = (city: string) => {
    setFromCity(city);
    setShowFromCities(false);
  };

  const selectToCity = (city: string) => {
    setToCity(city);
    setShowToCities(false);
  };

  const handleSearch = () => {
    // Validate required fields
    if (!fromCity.trim()) {
      alert('Please select a departure city');
      return;
    }
    if (!toCity.trim()) {
      alert('Please select an arrival city');
      return;
    }
    if (!flightDate) {
      alert('Please select a flight date');
      return;
    }
    
    // Handle search logic here
    onSearch({ fromCity, toCity, flightDate, numberOfBags, luggageSize });
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="relative min-h-screen">
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <button 
              onClick={() => onNavigate('home')} 
              className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition"
            >
              <Luggage className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-white">Baggage Buddy</span>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <button onClick={() => scrollToSection('luggage-sizes')} className="text-white hover:text-blue-200 transition">Pricing</button>
              <button onClick={() => scrollToSection('services')} className="text-white hover:text-blue-200 transition">Services</button>
              <button onClick={() => scrollToSection('how-it-works')} className="text-white hover:text-blue-200 transition">How It Works</button>
              <button 
                onClick={() => onNavigate('tags')} 
                className="text-white hover:text-blue-200 transition"
              >
                Baggage Tags
              </button>
              <button onClick={() => scrollToSection('contact')} className="text-white hover:text-blue-200 transition">Contact</button>
              
              {user ? (
                <div className="relative">
                  <button 
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold">
                      {user.user_metadata?.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                    </div>
                    <span>{user.user_metadata?.name || user.email}</span>
                  </button>
                  
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          onNavigate('admin');
                        }}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                      >
                        Admin Dashboard
                      </button>
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          onNavigate('database');
                        }}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                      >
                        View Database
                      </button>
                      <hr className="my-2 border-gray-200" />
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          onSignOut?.();
                        }}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button 
                  onClick={() => onNavigate('auth')}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Sign In
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-gray-900 bg-opacity-95">
            <div className="px-4 pt-2 pb-4 space-y-3">
              <button onClick={() => scrollToSection('luggage-sizes')} className="block text-white hover:text-blue-200 transition py-2 text-left w-full">Pricing</button>
              <button onClick={() => scrollToSection('services')} className="block text-white hover:text-blue-200 transition py-2 text-left w-full">Services</button>
              <button onClick={() => scrollToSection('how-it-works')} className="block text-white hover:text-blue-200 transition py-2 text-left w-full">How It Works</button>
              <button 
                onClick={() => {
                  onNavigate('tags');
                  setMobileMenuOpen(false);
                }} 
                className="block text-white hover:text-blue-200 transition py-2 text-left w-full"
              >
                Baggage Tags
              </button>
              <button onClick={() => scrollToSection('contact')} className="block text-white hover:text-blue-200 transition py-2 text-left w-full">Contact</button>
              {user ? (
                <div className="relative">
                  <button
                    className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                  >
                    {user.name}
                  </button>
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-xl z-50">
                      <button
                        className="w-full text-left px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 flex items-center gap-2"
                        onClick={onSignOut}
                      >
                        <X className="h-4 w-4 text-blue-600 flex-shrink-0" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                  Sign In
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Content */}
      <div className="relative h-screen">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1660082120861-952dc7ad9652?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhaXJwb3J0JTIwbHVnZ2FnZSUyMHRyYXZlbHxlbnwxfHx8fDE3Njg5MDc4MTN8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Airport luggage"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/70 via-gray-900/60 to-gray-900/80"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="w-full">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                Book Airline Luggage Space
              </h1>
              <p className="text-xl text-gray-200 max-w-2xl mx-auto">
                Airlines list their spare luggage capacity - travelers book extra bag space at great prices
              </p>
            </div>

            {/* Search Box - Skyscanner Style */}
            <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* From Location */}
                <div className="lg:col-span-2 relative" ref={fromDropdownRef}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Plane className="inline h-4 w-4 mr-1" />
                    From
                  </label>
                  <input
                    type="text"
                    placeholder="Departure city or airport"
                    value={fromCity}
                    onChange={(e) => handleFromCityChange(e.target.value)}
                    onFocus={() => {
                      if (fromCity.trim()) {
                        setShowFromCities(true);
                      } else {
                        setFilteredFromCities(CITIES);
                        setShowFromCities(true);
                      }
                    }}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
                  />
                  {/* City Dropdown */}
                  {showFromCities && filteredFromCities.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-xl max-h-64 overflow-y-auto z-50">
                      {filteredFromCities.map((city, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => selectFromCity(city)}
                          className="w-full text-left px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 flex items-center gap-2"
                        >
                          <Plane className="h-4 w-4 text-blue-600 flex-shrink-0" />
                          <span>{city}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* To Location */}
                <div className="lg:col-span-2 relative" ref={toDropdownRef}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Plane className="inline h-4 w-4 mr-1" />
                    To
                  </label>
                  <input
                    type="text"
                    placeholder="Arrival city or airport"
                    value={toCity}
                    onChange={(e) => handleToCityChange(e.target.value)}
                    onFocus={() => {
                      if (toCity.trim()) {
                        setShowToCities(true);
                      } else {
                        setFilteredToCities(CITIES);
                        setShowToCities(true);
                      }
                    }}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
                  />
                  {/* City Dropdown */}
                  {showToCities && filteredToCities.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-xl max-h-64 overflow-y-auto z-50">
                      {filteredToCities.map((city, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => selectToCity(city)}
                          className="w-full text-left px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 flex items-center gap-2"
                        >
                          <Plane className="h-4 w-4 text-blue-600 flex-shrink-0" />
                          <span>{city}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Flight Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Calendar className="inline h-4 w-4 mr-1" />
                    Flight Date
                  </label>
                  <input
                    type="date"
                    value={flightDate}
                    onChange={(e) => setFlightDate(e.target.value)}
                    className={`w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none ${!flightDate ? 'text-gray-400' : ''}`}
                    min={today}
                    required
                  />
                  {!flightDate && (
                    <p className="text-xs text-gray-500 mt-1">Select your flight date</p>
                  )}
                </div>

                {/* Number of Bags */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Luggage className="inline h-4 w-4 mr-1" />
                    Number of Bags
                  </label>
                  <select
                    value={numberOfBags}
                    onChange={(e) => setNumberOfBags(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                </div>

                {/* Luggage Size */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Luggage className="inline h-4 w-4 mr-1" />
                    Luggage Size
                  </label>
                  <select
                    value={luggageSize}
                    onChange={(e) => setLuggageSize(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </div>
              </div>

              {/* Search Button */}
              <button 
                onClick={handleSearch}
                className="w-full mt-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition shadow-lg"
              >
                Search Available Luggage Space
              </button>

              {/* Quick Stats */}
              <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">50+</div>
                  <div className="text-sm text-gray-600">Airlines</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">10,000+</div>
                  <div className="text-sm text-gray-600">Routes</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">Save 60%</div>
                  <div className="text-sm text-gray-600">vs Standard Fees</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}