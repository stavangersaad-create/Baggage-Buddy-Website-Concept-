import { Package, Briefcase, ShoppingBag, Boxes } from 'lucide-react';

const luggageSizes = [
  {
    icon: Briefcase,
    name: 'Small',
    dimensions: 'Up to 40cm × 30cm × 20cm',
    examples: 'Backpack, small carry-on, laptop bag',
    price: '$5',
    period: 'per day',
    color: 'from-blue-500 to-blue-600',
    iconBg: 'bg-blue-100 text-blue-600'
  },
  {
    icon: Package,
    name: 'Medium',
    dimensions: 'Up to 60cm × 45cm × 30cm',
    examples: 'Carry-on suitcase, duffel bag, sports equipment',
    price: '$8',
    period: 'per day',
    color: 'from-green-500 to-green-600',
    iconBg: 'bg-green-100 text-green-600',
    popular: true
  },
  {
    icon: ShoppingBag,
    name: 'Large',
    dimensions: 'Up to 80cm × 60cm × 40cm',
    examples: 'Large suitcase, oversized backpack, golf bag',
    price: '$12',
    period: 'per day',
    color: 'from-purple-500 to-purple-600',
    iconBg: 'bg-purple-100 text-purple-600'
  },
  {
    icon: Boxes,
    name: 'Custom',
    dimensions: 'Larger than 80cm or multiple items',
    examples: 'Multiple bags, bikes, skis, surfboards',
    price: 'Quote',
    period: 'based on size',
    color: 'from-orange-500 to-orange-600',
    iconBg: 'bg-orange-100 text-orange-600'
  }
];

export function LuggageSizes() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16" id="luggage-sizes">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Pricing Per Bag
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Pay per bag based on size. Compare with airline excess fees and save up to 60%.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {luggageSizes.map((size, index) => {
            const Icon = size.icon;
            return (
              <div
                key={index}
                className={`relative bg-white rounded-2xl border-2 ${
                  size.popular ? 'border-green-500 shadow-xl scale-105' : 'border-gray-200 shadow-lg'
                } hover:shadow-2xl transition-all overflow-hidden`}
              >
                {size.popular && (
                  <div className="absolute top-0 right-0 bg-green-500 text-white px-4 py-1 text-sm font-semibold rounded-bl-lg">
                    Most Popular
                  </div>
                )}
                
                <div className="p-8">
                  <div className={`${size.iconBg} w-16 h-16 rounded-xl flex items-center justify-center mb-6`}>
                    <Icon className="h-8 w-8" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {size.name}
                  </h3>
                  
                  <div className="text-sm text-gray-600 mb-4">
                    {size.dimensions}
                  </div>
                  
                  <div className="text-sm text-gray-500 mb-6 min-h-[3rem]">
                    {size.examples}
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex items-end gap-1">
                      <span className="text-4xl font-bold text-gray-900">{size.price}</span>
                      <span className="text-gray-600 mb-1">/{size.period}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={scrollToTop}
                    className={`w-full bg-gradient-to-r ${size.color} text-white py-3 rounded-lg font-semibold hover:opacity-90 transition`}
                  >
                    Select {size.name}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600">
            All prices include insurance up to $5,000 • Prices vary by airline and route
          </p>
        </div>
      </div>
    </section>
  );
}