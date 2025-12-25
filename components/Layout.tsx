
import React from 'react';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
  activeView: string;
  setActiveView: (view: string) => void;
  title: string;
  subtitle?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, setActiveView, title, subtitle }) => {
  return (
    <div className="flex h-screen bg-[#f8fafc]">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b flex items-center justify-between px-8 z-10">
          <div>
            <h1 className="text-lg font-bold text-gray-900">{title}</h1>
            {subtitle && <p className="text-xs text-gray-400 uppercase tracking-tight font-medium">{subtitle}</p>}
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
              <i className="fa-regular fa-bell text-lg"></i>
            </button>
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center border border-blue-200">
              <i className="fa-solid fa-user text-blue-600 text-sm"></i>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
