import { Luggage, Mail, Lock, User, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { getSupabaseClient } from '../utils/supabase/client';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface AuthPageProps {
  onNavigate: (page: string) => void;
  onSignIn: (accessToken: string, user: any) => void;
}

export function AuthPage({ onNavigate, onSignIn }: AuthPageProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const supabase = getSupabaseClient();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Attempting to sign in with email:', email);
      
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        console.error('Sign in error:', signInError);
        
        // Provide user-friendly error messages
        if (signInError.message.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please check your credentials or create a new account.');
        } else if (signInError.message.includes('Email not confirmed')) {
          setError('Please confirm your email address.');
        } else {
          setError(signInError.message);
        }
        
        setLoading(false);
        return;
      }

      if (data.session) {
        console.log('Sign in successful!', data.user);
        onSignIn(data.session.access_token, data.user);
      } else {
        setError('Failed to create session. Please try again.');
        setLoading(false);
      }
    } catch (err) {
      console.error('Sign in exception:', err);
      setError('Failed to sign in. Please try again.');
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Creating new account for:', email);
      
      // Call our backend to create the user
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-5cdb4afc/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ email, password, name })
      });

      const data = await response.json();
      console.log('Signup response:', data);

      if (!response.ok) {
        console.error('Signup error:', data.error);
        setError(data.error || 'Failed to create account');
        setLoading(false);
        return;
      }

      console.log('Account created successfully! Now signing in...');

      // Now sign in the user
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        console.error('Auto sign-in error:', signInError);
        setError('Account created! Please sign in manually.');
        setIsSignUp(false);
        setLoading(false);
        return;
      }

      if (signInData.session) {
        console.log('Auto sign-in successful!');
        onSignIn(signInData.session.access_token, signInData.user);
      } else {
        setError('Account created! Please sign in.');
        setIsSignUp(false);
        setLoading(false);
      }
    } catch (err) {
      console.error('Signup exception:', err);
      setError('Failed to create account. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <button 
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-2 mb-6 text-blue-600 hover:text-blue-700 transition"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Back to Home</span>
          </button>
          
          <div className="flex items-center justify-center gap-3 mb-4">
            <Luggage className="h-10 w-10 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Baggage Buddy</h1>
          </div>
          <p className="text-gray-600">
            {isSignUp ? 'Create your account to start booking' : 'Sign in to your account'}
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex gap-2 mb-8">
            <button
              onClick={() => {
                setIsSignUp(false);
                setError('');
              }}
              className={`flex-1 py-3 rounded-lg font-semibold transition ${
                !isSignUp
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setIsSignUp(true);
                setError('');
              }}
              className={`flex-1 py-3 rounded-lg font-semibold transition ${
                isSignUp
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Sign Up
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border-2 border-red-300 rounded-lg mb-6 p-4">
              <p className="text-red-800 font-semibold mb-2">⚠️ {error}</p>
              {error.includes('Invalid email or password') && !isSignUp && (
                <button
                  onClick={() => {
                    setIsSignUp(true);
                    setError('');
                  }}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium underline"
                >
                  Don't have an account? Click here to sign up
                </button>
              )}
            </div>
          )}

          <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="space-y-5">
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>
              {isSignUp && (
                <p className="text-sm text-gray-500 mt-1">
                  Must be at least 6 characters
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              {loading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          {!isSignUp && (
            <div className="mt-6 text-center">
              <a href="#" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Forgot your password?
              </a>
            </div>
          )}

          {/* Quick Test Account Info */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-xs text-blue-900 font-semibold mb-2">💡 For Testing:</p>
            <p className="text-xs text-blue-800 mb-2">
              Create a test account with any email (e.g., test@example.com) and a password of at least 6 characters. No real email verification needed!
            </p>
            <p className="text-xs text-blue-800 font-semibold">
              ✨ Note: Booking works without an account! Sign in is optional.
            </p>
          </div>
        </div>

        <p className="text-center text-gray-600 text-sm mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}