import React, { useState } from 'react';
import { Menu, X, School, GraduationCap, ClipboardList, Megaphone } from 'lucide-react';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Beranda', icon: <School className="w-4 h-4 mr-2" /> },
    { id: 'register', label: 'Pendaftaran', icon: <ClipboardList className="w-4 h-4 mr-2" /> },
    { id: 'announcement', label: 'Pengumuman', icon: <Megaphone className="w-4 h-4 mr-2" /> },
    { id: 'admin', label: 'Admin (Demo)', icon: <GraduationCap className="w-4 h-4 mr-2" /> },
  ];

  return (
    <nav className="bg-school-600 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center cursor-pointer" onClick={() => onNavigate('home')}>
            <School className="w-8 h-8 text-accent-500 mr-3" />
            <div>
              <h1 className="font-heading font-bold text-xl leading-none">SDN Tempurejo 1</h1>
              <p className="text-xs text-school-100 font-sans">Sistem Penerimaan Murid Baru</p>
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentPage === item.id
                      ? 'bg-school-700 text-white'
                      : 'text-school-100 hover:bg-school-500'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-school-100 hover:bg-school-500 focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-school-700">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setIsOpen(false);
                }}
                className={`flex items-center w-full px-3 py-2 rounded-md text-base font-medium ${
                  currentPage === item.id
                    ? 'bg-school-900 text-white'
                    : 'text-school-100 hover:bg-school-500'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};