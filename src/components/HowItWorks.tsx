import { Search, CreditCard, Plane, Package2 } from 'lucide-react';

const steps = [
  {
    icon: Search,
    step: 'Step 1',
    title: 'Search Your Flight',
    description: 'Enter your departure city, destination, and travel dates. Browse available luggage space from airlines flying your route.'
  },
  {
    icon: CreditCard,
    step: 'Step 2',
    title: 'Book & Pay',
    description: 'Select your luggage size and quantity. Book instantly and save up to 60% compared to standard airline excess baggage fees.'
  },
  {
    icon: Package2,
    step: 'Step 3',
    title: 'Get Digital Tags',
    description: 'Receive your digital baggage tags and confirmation. Track your luggage in real-time through your booking.'
  },
  {
    icon: Plane,
    step: 'Step 4',
    title: 'Check In & Fly',
    description: 'Present your digital tags at check-in. Your bags travel with the airline\'s spare capacity you booked.'
  }
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            How Baggage Buddy Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">
            Airlines have spare luggage capacity. Travelers need affordable extra baggage space. We connect both.
          </p>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Book luggage space on your flight at a fraction of the cost of standard airline fees. It's that simple.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="relative">
                <div className="relative bg-white flex flex-col items-center text-center">
                  <div className="bg-gradient-to-br from-blue-600 to-blue-700 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                    <Icon className="h-10 w-10 text-white" />
                  </div>
                  <div className="text-sm font-semibold text-blue-600 mb-2">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}