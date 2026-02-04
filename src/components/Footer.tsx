import { Luggage, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer id="contact" className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Luggage className="h-8 w-8 text-blue-500" />
              <span className="text-2xl font-bold text-white">Baggage Buddy</span>
            </div>
            <p className="text-gray-400 mb-4">
              Connecting travelers with airlines' spare luggage capacity. Book extra bag space at discounted rates on thousands of flights worldwide.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-blue-500 transition">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-500 transition">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-500 transition">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-500 transition">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-bold mb-4">Services</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-blue-500 transition">Luggage Storage</a></li>
              <li><a href="#" className="hover:text-blue-500 transition">Baggage Delivery</a></li>
              <li><a href="#" className="hover:text-blue-500 transition">Airport Services</a></li>
              <li><a href="#" className="hover:text-blue-500 transition">Hotel Partnerships</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-bold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-blue-500 transition">About Us</a></li>
              <li><a href="#" className="hover:text-blue-500 transition">Careers</a></li>
              <li><a href="#" className="hover:text-blue-500 transition">Press</a></li>
              <li><a href="#" className="hover:text-blue-500 transition">Blog</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Mail className="h-5 w-5 text-blue-500 mt-0.5" />
                <span>support@baggagebuddy.com</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="h-5 w-5 text-blue-500 mt-0.5" />
                <span>+1 (800) BAG-BUDDY</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-blue-500 mt-0.5" />
                <span>123 Travel Lane<br />New York, NY 10001</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © 2026 Baggage Buddy. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-gray-400 hover:text-blue-500 transition">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-blue-500 transition">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-blue-500 transition">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}