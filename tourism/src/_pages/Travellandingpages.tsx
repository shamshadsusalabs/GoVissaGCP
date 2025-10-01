import { 
  FiArrowRight, 
  FiCheck, 
  FiGlobe, 
  FiMapPin, 
  FiStar, 
  FiCalendar,
  FiHome,      // Replacement for FiHotel
  FiAward,     // Replacement for FiPackage
  FiUmbrella,
  FiTruck      // Replacement for FiPlane
} from 'react-icons/fi';

const TravelLandingPage = () => {
  // Featured destinations data with working image URLs
  const featuredDestinations = [
    {
      name: 'Maldives',
      image: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      packagesFrom: '₹45,999'
    },
    {
      name: 'Bali',
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      packagesFrom: '₹32,499'
    },
    {
      name: 'Switzerland',
      image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      packagesFrom: '₹89,999'
    },
    {
      name: 'Dubai',
      image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      packagesFrom: '₹54,500'
    }
  ];

  // Services data
  const services = [
    {
      icon: <  FiHome className="w-8 h-8 text-blue-600" />,
      title: "Flight Bookings",
      description: "Best deals on domestic & international flights with flexible cancellation policies."
    },
    {
      icon: <  FiAward className="w-8 h-8 text-green-600" />,
      title: "Luxury Stays",
      description: "Curated selection of 5-star hotels, resorts, and boutique accommodations."
    },
    {
      icon: < FiTruck  className="w-8 h-8 text-purple-600" />,
      title: "Vacation Packages",
      description: "All-inclusive packages with flights, hotels, transfers and activities."
    },
    {
      icon: <FiUmbrella className="w-8 h-8 text-yellow-600" />,
      title: "Travel Insurance",
      description: "Comprehensive coverage for trip cancellations, medical emergencies and more."
    }
  ];

  // Testimonials
  const testimonials = [
    {
      quote: "The Maldives package exceeded all expectations! Flawless coordination from start to finish.",
      author: "Priya Sharma",
      rating: 5
    },
    {
      quote: "Got business class flights at economy prices. Will definitely book again!",
      author: "Rahul Verma",
      rating: 4
    },
    {
      quote: "Our Europe tour was perfectly planned with amazing hotels and transport.",
      author: "Anjali Patel",
      rating: 5
    }
  ];

  return (
    <div className="font-sans ml-[200px] max-w-[1400px]">
      {/* Hero Section */}
      <div className="relative bg-blue-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <img 
          src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80" 
          alt="Travel background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Discover Your Perfect Getaway
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Book flights, hotels, and packages with exclusive deals and personalized service
            </p>
            <div className="bg-white rounded-lg shadow-xl p-4 max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1 text-left">Destination</label>
                  <div className="relative">
                    <FiMapPin className="absolute left-3 top-3 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Where to?" 
                      className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1 text-left">Travel Dates</label>
                  <div className="relative">
                    <FiCalendar className="absolute left-3 top-3 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Select dates" 
                      className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center transition-colors duration-300">
                  Search <FiArrowRight className="ml-2" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-6">
              <div className="text-4xl font-bold text-blue-600">50K+</div>
              <div className="text-gray-600 mt-2">Happy Travelers</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-green-600">150+</div>
              <div className="text-gray-600 mt-2">Destinations</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-purple-600">10K+</div>
              <div className="text-gray-600 mt-2">Hotels Worldwide</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-yellow-600">24/7</div>
              <div className="text-gray-600 mt-2">Customer Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Your Complete Travel Solution</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need for a seamless travel experience in one place
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-xl hover:shadow-lg transition-shadow duration-300">
                <div className="bg-white p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4 shadow-md">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Destinations */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Featured Destinations</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our most popular travel destinations
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredDestinations.map((destination, index) => (
              <div key={index} className="relative group overflow-hidden rounded-xl shadow-lg">
                <img 
                  src={destination.image} 
                  alt={destination.name}
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80"></div>
                <div className="absolute bottom-0 left-0 p-6 w-full">
                  <h3 className="text-xl font-bold text-white">{destination.name}</h3>
                  <p className="text-white">Packages from {destination.packagesFrom}</p>
                  <button className="mt-3 text-white border border-white px-4 py-2 rounded-lg hover:bg-white hover:text-black transition-colors duration-300">
                    Explore
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="lg:w-1/2 mb-12 lg:mb-0">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Travel With Us?</h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <FiCheck className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <span className="text-lg">Best price guarantee - We'll match or beat any competitor's price</span>
                </li>
                <li className="flex items-start">
                  <FiCheck className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <span className="text-lg">24/7 customer support - Assistance anytime, anywhere</span>
                </li>
                <li className="flex items-start">
                  <FiCheck className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <span className="text-lg">Flexible booking options - Change plans with no hassle</span>
                </li>
                <li className="flex items-start">
                  <FiCheck className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <span className="text-lg">Verified reviews - Real experiences from real travelers</span>
                </li>
              </ul>
            </div>
            <div className="lg:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1503220317375-aaad61436b1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="Happy travelers"
                className="rounded-xl shadow-xl w-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-16 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">What Our Travelers Say</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Don't just take our word for it - hear from our happy customers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <FiStar 
                      key={i} 
                      className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <p className="text-gray-600 italic mb-6">"{testimonial.quote}"</p>
                <p className="font-semibold">— {testimonial.author}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FiGlobe className="w-16 h-16 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Ready for Your Next Adventure?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Sign up now and get exclusive access to deals, discounts and travel tips
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="px-4 py-3 rounded-lg text-gray-900 flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-6 py-3 rounded-lg font-semibold transition-colors duration-300">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">TravelEase</h3>
              <p className="text-gray-400">
                Making travel planning effortless and enjoyable since 2010.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Explore</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Destinations</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Deals</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Travel Guides</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cancellation Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Customer Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            © {new Date().getFullYear()} TravelEase. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TravelLandingPage;