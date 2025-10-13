import React, { JSX, useState } from 'react';
import { 
  FaHotel, FaPlane, FaUmbrellaBeach, FaMapMarkedAlt, 
  FaChevronDown, FaChevronRight, FaBars, FaTimes 
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

type MenuItem = {
  title: string;
  icon: JSX.Element;
  subItems?: string[];
  onClick?: (title?: string) => void;
};

const Sidebar: React.FC = () => {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    hotel: true,
  });
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  const toggleItem = (title: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const menuItems: MenuItem[] = [
    {
      title: 'hotel',
      subItems: ['Domestic Hotels', 'Overseas Hotels'],
      icon: <FaHotel className="text-blue-600 text-lg" />,
      onClick: (title) => {
        if (title === 'Domestic Hotels') navigate('/domestic');
        else if (title === 'Overseas Hotels') navigate('/overseas');
      },
    },
    {
      title: 'Flights',
      subItems: ['Domestic Flights', 'International Flights'],
      icon: <FaPlane className="text-blue-600 text-lg" />,
      onClick: (title) => {
        if (title === 'Domestic Flights') navigate('/domesticFlight');
        else if (title === 'International Flights') navigate('/overseasFlights');
      },
    },
    {
      title: 'Travel',
      subItems: ['Tour Packages', 'Custom Tours'],
      icon: <FaUmbrellaBeach className="text-blue-600 text-lg" />,
    },
    {
      title: 'Guides and Attractions',
      subItems: ['Local Guides', 'Attractions Pass'],
      icon: <FaMapMarkedAlt className="text-blue-600 text-lg" />,
    },
    {
      title: 'Visa',
      icon: <FaPlane className="text-blue-600 text-lg" />,
      onClick: () => navigate('/visa'),
    },
  ];

  return (
    <>
      {/* Toggle Sidebar Button */}
      <button
        className="fixed left-4 top-4 z-50 p-2 rounded-md bg-white shadow-md hover:bg-blue-50 transition-colors"
        onClick={() => setIsCollapsed(!isCollapsed)}
        aria-label="Toggle sidebar"
      >
        {isCollapsed ? (
          <FaTimes className="text-blue-600 text-lg" />
        ) : (
          <FaBars className="text-blue-600 text-lg" />
        )}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full ${
          isCollapsed ? 'w-16' : 'w-50'
        } bg-white shadow-lg z-40 overflow-y-auto pt-16 transition-all duration-300`}
      >
        <div className="flex flex-col p-2 space-y-1">
          {menuItems.map((item, index) => (
            <div key={index} className="w-full">
              {/* Main Menu Item */}
              <div
                className={`flex items-center p-2 mt-8 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors ${
                  expandedItems[item.title] ? 'bg-blue-50' : ''
                }`}
                onClick={() => {
                  if (item.subItems) toggleItem(item.title);
                  else if (item.onClick) item.onClick();
                }}
              >
                <div className={`flex items-center ${isCollapsed ? 'mx-auto' : ''}`}>
                  {React.cloneElement(item.icon, {
                    className: `${item.icon.props.className} ${
                      isCollapsed ? 'text-xl' : ''
                    }`,
                  })}
                </div>

                {!isCollapsed && (
                  <div className="flex items-center justify-between w-full ml-3">
                    <span className="text-sm font-medium text-gray-800 truncate">
                      {item.title}
                    </span>
                    {item.subItems && (
                      expandedItems[item.title] ? (
                        <FaChevronDown className="text-xs text-blue-600" />
                      ) : (
                        <FaChevronRight className="text-xs text-blue-600" />
                      )
                    )}
                  </div>
                )}
              </div>

              {/* Sub Items */}
              {!isCollapsed && item.subItems && expandedItems[item.title] && (
                <div className="ml-6 mt-1 space-y-1">
                  {item.subItems.map((subItem, subIndex) => (
                    <div
                      key={subIndex}
                      className="flex items-center p-2 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors"
                      onClick={() => item.onClick?.(subItem)}
                    >
                      <span className="text-xs text-gray-600 truncate">{subItem}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
