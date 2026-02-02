import React from 'react';
import { MapPin, Phone, Mail, Facebook, Instagram, Youtube, ChevronRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1a1a1a] text-gray-300 border-t-4 border-yellow-500 font-sans mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Kolom 1: Tentang Sekolah */}
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center gap-3 mb-2">
                <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/b/b5/Tut_Wuri_Handayani.svg" 
                    alt="Logo" 
                    className="w-12 h-12"
                />
                <div>
                    <h3 className="font-bold text-white text-lg leading-tight uppercase">SD NEGERI<br/>TEMPUREJO 1</h3>
                </div>
            </div>
            <p className="text-sm leading-relaxed text-gray-400 text-justify">
              Website resmi Penerimaan Peserta Didik Baru (PPDB) SD NEGERI TEMPUREJO 1 Kota Kediri. Mewujudkan generasi berprestasi, berkarakter, dan beriman.
            </p>
            <div className="flex gap-3 pt-2">
                <a href="#" className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-sm transition-colors"><Facebook className="w-4 h-4"/></a>
                <a href="#" className="bg-pink-600 hover:bg-pink-700 text-white p-2 rounded-sm transition-colors"><Instagram className="w-4 h-4"/></a>
                <a href="#" className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-sm transition-colors"><Youtube className="w-4 h-4"/></a>
            </div>
          </div>

          {/* Kolom 2: Tautan Cepat */}
          <div className="lg:col-span-1">
            <h4 className="font-bold text-white text-base mb-4 uppercase tracking-wider border-l-4 border-yellow-500 pl-3">Menu</h4>
            <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-yellow-400 flex items-center gap-2"><ChevronRight className="w-3 h-3 text-yellow-500"/> Beranda</a></li>
                <li><a href="#register" className="hover:text-yellow-400 flex items-center gap-2"><ChevronRight className="w-3 h-3 text-yellow-500"/> PPDB Online</a></li>
                <li><a href="#announcement" className="hover:text-yellow-400 flex items-center gap-2"><ChevronRight className="w-3 h-3 text-yellow-500"/> Pengumuman</a></li>
                <li><a href="#admin" className="hover:text-yellow-400 flex items-center gap-2"><ChevronRight className="w-3 h-3 text-yellow-500"/> Login Admin</a></li>
            </ul>
          </div>
          
          {/* Kolom 3: Kontak */}
          <div className="lg:col-span-1">
            <h4 className="font-bold text-white text-base mb-4 uppercase tracking-wider border-l-4 border-yellow-500 pl-3">Kontak</h4>
            <ul className="text-sm space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <span>Jl. Bagawanta Bhari No. 1,<br/>Tempurejo, Kec. Pesantren,<br/>Kota Kediri 64132</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                <span>(0354) 123456</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                <span>sdntempurejo1@gmail.com</span>
              </li>
            </ul>
          </div>
          
          {/* Kolom 4: Peta */}
          <div className="lg:col-span-1">
            <h4 className="font-bold text-white text-base mb-4 uppercase tracking-wider border-l-4 border-yellow-500 pl-3">Lokasi</h4>
            <div className="w-full h-40 bg-gray-800 rounded-sm overflow-hidden border border-gray-700">
                <iframe 
                    title="Peta Lokasi"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3952.540166661664!2d112.0536423147783!3d-7.838389979991206!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7856e395555555%3A0x5555555555555555!2sSDN%20Tempurejo%201!5e0!3m2!1sid!2sid!4v1620000000000!5m2!1sid!2sid" 
                    width="100%" 
                    height="100%" 
                    style={{border:0}} 
                    allowFullScreen={true} 
                    loading="lazy"
                    className="opacity-80 hover:opacity-100 transition-opacity"
                ></iframe>
            </div>
          </div>

        </div>
      </div>

      {/* Copyright */}
      <div className="bg-black py-4 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-gray-500">
            <p>&copy; {new Date().getFullYear()} SD NEGERI TEMPUREJO 1. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};