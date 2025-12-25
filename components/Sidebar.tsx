
import React from 'react';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fa-table-columns', section: 'MAIN' },
    { id: 'operations', label: 'Operations', icon: 'fa-arrow-right-arrow-left', section: 'MAIN' },
    { id: 'balance', label: 'Inventory Balance', icon: 'fa-box-archive', section: 'MAIN' },
    { id: 'items', label: 'Items', icon: 'fa-boxes-stacked', section: 'MANAGEMENT' },
    { id: 'warehouses', label: 'Warehouses', icon: 'fa-warehouse', section: 'MANAGEMENT' },
    { id: 'sources', label: 'Sources', icon: 'fa-truck-field', section: 'MANAGEMENT' },
    { id: 'categories', label: 'Categories', icon: 'fa-tags', section: 'MANAGEMENT' },
    { id: 'couriers', label: 'Couriers', icon: 'fa-truck-fast', section: 'MANAGEMENT' },
    { id: 'reports', label: 'Reports', icon: 'fa-chart-line', section: 'ANALYTICS' },
  ];

  const sections = ['MAIN', 'MANAGEMENT', 'ANALYTICS'];

  return (
    <div className="w-64 bg-white border-r h-full flex flex-col shadow-sm overflow-y-auto">
      <div className="p-6 border-b">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <i className="fa-solid fa-cube text-white text-xl"></i>
          </div>
          <span className="font-bold text-gray-800 text-lg">Pure Food Mart</span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-8">
        {sections.map(section => (
          <div key={section}>
            <p className="text-xs font-semibold text-gray-400 mb-4 px-2 tracking-wider">
              {section}
            </p>
            <div className="space-y-1">
              {menuItems
                .filter(item => item.section === section)
                .map(item => (
                  <button
                    key={item.id}
                    onClick={() => setActiveView(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      activeView === item.id
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                        : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                    }`}
                  >
                    <i className={`fa-solid ${item.icon} w-5`}></i>
                    <span>{item.label}</span>
                  </button>
                ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t">
        <button className="w-full flex items-center space-x-3 px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg text-sm font-medium">
          <i className="fa-solid fa-right-from-bracket w-5"></i>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
