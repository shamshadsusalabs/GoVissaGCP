import React from 'react';

// Define interfaces for data structures
interface PartnerLogo {
  id: number;
  name: string;
  logoUrl: string;
}

interface Category {
  id: number;
  title: string;
  type: 'links' | 'description';
  links?: string[];
  description?: string;
}

const PartnersSection: React.FC = () => {
  // Static data for partner logos
  const partnerLogos: PartnerLogo[] = [
    {
      id: 1,
      name: 'Partner 1',
      logoUrl: 'https://images.unsplash.com/photo-1496200186974-4293800e2c20', // Placeholder logo
    },
    {
      id: 2,
      name: 'Partner 2',
      logoUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3', // Placeholder logo
    },
    {
      id: 3,
      name: 'Partner 3',
      logoUrl: 'https://images.unsplash.com/photo-1542744173-05336fcc7ad4', // Placeholder logo
    },
    {
      id: 4,
      name: 'Partner 4',
      logoUrl: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f', // Placeholder logo
    },
    {
      id: 5,
      name: 'Partner 5',
      logoUrl: 'https://images.unsplash.com/photo-1556740738-6b4d43b29c75', // Placeholder logo
    },
    {
      id: 6,
      name: 'Partner 6',
      logoUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952', // Placeholder logo
    },
  ];

  // Static data for information categories
  const categories: Category[] = [
    {
      id: 1,
      title: 'Ctrip Navigation',
      type: 'links',
      links: [
        'Flights to Beijing',
        'Flights to Shanghai',
        'Flights to Guangzhou',
        'Flights to Shenzhen',
        'Flights to Chengdu',
        'Flights to Hangzhou',
      ],
    },
    {
      id: 2,
      title: 'Hotel Reservations',
      type: 'description',
      description:
        'Book hotels with exclusive discounts and flexible cancellation policies for business and leisure travelers.',
    },
    {
      id: 3,
      title: 'Travel Packages',
      type: 'links',
      links: [
        'Kerala Backwaters Tour',
        'Golden Triangle Tour',
        'Goa Beach Getaway',
        'Rajasthan Heritage Tour',
        'Himalayan Adventure',
        'South India Temple Tour',
      ],
    },
    {
      id: 4,
      title: 'Corporate Travel',
      type: 'description',
      description:
        'Tailored corporate travel solutions with 24/7 support and expense management tools.',
    },
  ];

  return (
    <div className="ml-[200px] max-w-[1400px] p-6 space-y-8">
      {/* Partners Title */}
      <h2 className="text-2xl font-bold text-gray-800">Partners</h2>

      {/* Partner Logos Row */}
      <div className="flex items-center justify-between space-x-4 border-y border-gray-200 py-4">
        {partnerLogos.map((partner: PartnerLogo, index: number) => (
          <React.Fragment key={partner.id}>
            <img
              src={partner.logoUrl}
              alt={partner.name}
              className="h-12 w-auto object-contain"
            />
            {index < partnerLogos.length - 1 && (
              <div className="h-8 w-px bg-gray-300"></div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Information Section */}
      <div className="space-y-6">
        {categories.map((category: Category) => (
          <div key={category.id} className="flex flex-col sm:flex-row gap-4">
            {/* Category Title */}
            <div className="w-full sm:w-1/4">
              <h3 className="text-lg font-semibold text-gray-900">{category.title}</h3>
            </div>

            {/* Category Content */}
            <div className="w-full sm:w-3/4">
              {category.type === 'links' && category.links ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {category.links.map((link: string, index: number) => (
                    <a
                      key={index}
                      href="#"
                      className="text-sm text-blue-600 hover:underline truncate"
                    >
                      {link}
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-600 line-clamp-3">
                  {category.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PartnersSection;