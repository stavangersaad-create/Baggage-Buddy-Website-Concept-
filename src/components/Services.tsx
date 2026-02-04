import { Plane, DollarSign, Clock, Shield } from 'lucide-react';

const services = [
  {
    icon: Plane,
    title: 'Airlines List Space',
    description: 'Airlines list their available cargo and passenger luggage capacity on flights. Turn unused space into revenue.',
    color: 'bg-blue-100 text-blue-600'
  },
  {
    icon: DollarSign,
    title: 'Travelers Save Money',
    description: 'Book extra luggage space at up to 60% less than standard airline excess baggage fees. Compare prices across airlines.',
    color: 'bg-green-100 text-green-600'
  },
  {
    icon: Clock,
    title: 'Instant Booking',
    description: 'Book your luggage space in seconds. Get instant confirmation and digital baggage tags for seamless check-in.',
    color: 'bg-purple-100 text-purple-600'
  },
  {
    icon: Shield,
    title: 'Insurance Included',
    description: 'All bookings include comprehensive insurance up to $5,000 per bag. Your belongings are fully protected.',
    color: 'bg-orange-100 text-orange-600'
  }
];

export function Services() {
  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Connecting airlines with travelers to optimize luggage capacity and save money on every flight.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className={`${service.color} w-16 h-16 rounded-lg flex items-center justify-center mb-6`}>
                  <Icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}