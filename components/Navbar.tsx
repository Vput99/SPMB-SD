import React, { useState } from 'react';
import { Menu, X, Home, FileText, Bell, Lock, Phone, Mail, Facebook, Youtube, Instagram, MapPin, Users } from 'lucide-react';
import { Logo } from './Logo';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'BERANDA', icon: <Home className="w-4 h-4 mr-2" /> },
    { id: 'register', label: 'PPDB ONLINE', icon: <FileText className="w-4 h-4 mr-2" /> },
    { id: 'announcement', label: 'PENGUMUMAN', icon: <Bell className="w-4 h-4 mr-2" /> },
    { id: 'students', label: 'DATA SISWA', icon: <Users className="w-4 h-4 mr-2" /> },
    { id: 'admin', label: 'LOGIN ADMIN', icon: <Lock className="w-4 h-4 mr-2" /> },
  ];

  return (
    <header className="flex flex-col w-full shadow-md bg-white">
      {/* 1. Top Bar - Informasi Kontak (Dark Bar) */}
      <div className="bg-gray-800 text-white text-[11px] py-2 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-1">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Phone className="w-3 h-3 text-yellow-400" />
              <span>(0354) 123456</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Mail className="w-3 h-3 text-yellow-400" />
              <span>admin.sd@sdntempurejo1kotakediri.my.id</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <div className="flex gap-3">
               <a href="#" className="hover:text-yellow-400 transition-colors"><Facebook className="w-3 h-3" /></a>
               <a href="#" className="hover:text-yellow-400 transition-colors"><Instagram className="w-3 h-3" /></a>
               <a href="#" className="hover:text-yellow-400 transition-colors"><Youtube className="w-3 h-3" /></a>
             </div>
          </div>
        </div>
      </div>

      {/* 2. Main Header (Kop Surat Style) */}
      <div className="bg-white py-4 lg:py-6 border-b-4 border-school-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-4">
          {/* Logo */}
          <div className="flex-shrink-0">
             <Logo className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 filter drop-shadow-sm" />
          </div>
          
          {/* Teks Kop */}
          <div className="flex flex-col justify-center">
             <h3 className="font-bold text-gray-600 text-[10px] sm:text-xs lg:text-sm tracking-widest uppercase mb-0.5 sm:mb-1">
               PEMERINTAH KOTA KEDIRI
             </h3>
             <h3 className="font-bold text-gray-600 text-[10px] sm:text-xs lg:text-sm tracking-widest uppercase mb-0.5 sm:mb-1">
               DINAS PENDIDIKAN
             </h3>
             <h1 className="font-black text-school-700 text-xl sm:text-2xl lg:text-4xl leading-none tracking-tight uppercase mb-1 sm:mb-2">
               SD NEGERI TEMPUREJO 1
             </h1>
             <div className="flex flex-wrap items-center gap-1 text-gray-500 text-[10px] sm:text-xs lg:text-sm font-medium">
               <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" />
               <span>Jl. Raya Tempurejo No.12, Pesantren, Kota Kediri - 64132</span>
             </div>
          </div>
        </div>
      </div>

      {/* 3. Navigation Bar (Red Bar) */}
      <nav className="bg-school-700 text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12 lg:h-14">
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center px-5 h-12 lg:h-14 text-xs lg:text-sm font-bold tracking-wide transition-colors duration-200 uppercase ${
                    currentPage === item.id
                      ? 'bg-school-800 text-white border-b-4 border-yellow-400'
                      : 'hover:bg-school-600 text-white border-b-4 border-transparent hover:border-school-400'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden w-full justify-between items-center">
              <span className="font-bold text-sm tracking-widest uppercase flex items-center gap-2">
                <Menu className="w-4 h-4" /> MENU UTAMA
              </span>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-school-600 focus:outline-none"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {isOpen && (
          <div className="md:hidden bg-school-800 border-t border-school-900 animate-fade-in">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setIsOpen(false);
                  }}
                  className={`flex items-center w-full px-4 py-3 text-sm font-bold uppercase ${
                    currentPage === item.id
                      ? 'bg-school-900 text-yellow-400 border-l-4 border-yellow-400 pl-3'
                      : 'text-gray-100 hover:bg-school-700'
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
    </header>
  );
};