import { ArrowRight } from 'lucide-react';

export function CTA() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Save on Luggage Fees?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of smart travelers booking airline luggage space at a fraction of standard fees. 
            Search your next flight now.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={scrollToTop}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition text-lg font-semibold inline-flex items-center justify-center gap-2"
            >
              Search Flights
              <ArrowRight className="h-5 w-5" />
            </button>
            <button className="bg-transparent text-white px-8 py-4 rounded-lg border-2 border-white hover:bg-white hover:text-blue-600 transition text-lg font-semibold">
              For Airlines
            </button>
          </div>
          <p className="text-blue-200 mt-6">
            No membership fees • Instant confirmation • Save up to 60%
          </p>
        </div>
      </div>
    </section>
  );
}