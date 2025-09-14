import { FiStar, FiTrendingUp } from 'react-icons/fi';

const TopPackages = () => {
  const packages = [
    {
      name: 'Golden Triangle Tour',
      sales: 8,
      revenue: '₹5,60,000',
      commission: '₹56,000'
    },
    {
      name: 'Kerala Backwaters',
      sales: 5,
      revenue: '₹3,40,000',
      commission: '₹40,800'
    },
    {
      name: 'Ladakh Adventure',
      sales: 3,
      revenue: '₹6,45,000',
      commission: '₹96,750'
    },
    {
      name: 'Goa Beach Holiday',
      sales: 7,
      revenue: '₹5,25,000',
      commission: '₹42,000'
    }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Top Selling Packages</h3>
        <div className="flex items-center text-sm text-blue-600">
          <FiTrendingUp className="mr-1" />
          <span>View All</span>
        </div>
      </div>
      
      <div className="space-y-4">
        {packages.map((pkg, index) => (
          <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <div className={`p-2 rounded-full ${
                index === 0 ? 'bg-yellow-50 text-yellow-500' : 'bg-gray-100 text-gray-500'
              }`}>
                <FiStar className="h-4 w-4" />
              </div>
              <div className="ml-4">
                <h4 className="text-sm font-medium text-gray-900">{pkg.name}</h4>
                <p className="text-xs text-gray-500">{pkg.sales} sales</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{pkg.revenue}</p>
              <p className="text-xs text-green-600">{pkg.commission} commission</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopPackages;