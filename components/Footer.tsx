import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-school-900 text-school-100 py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-heading font-bold text-xl text-white mb-4">SD Negeri Tempurejo 1</h3>
            <p className="text-sm">
              Membentuk generasi penerus bangsa yang cerdas, berkarakter, dan bertaqwa.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Hubungi Kami</h4>
            <ul className="text-sm space-y-2">
              <li>Jl. Raya Tempurejo No. 123</li>
              <li>Desa Tempurejo, Jember</li>
              <li>Telp: (0331) 123456</li>
              <li>Email: info@sdntempurejo1.sch.id</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Jam Operasional</h4>
            <ul className="text-sm space-y-2">
              <li>Senin - Kamis: 07.00 - 12.00</li>
              <li>Jumat - Sabtu: 07.00 - 10.30</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-school-800 mt-8 pt-8 text-center text-xs">
          &copy; {new Date().getFullYear()} SD Negeri Tempurejo 1. All rights reserved.
        </div>
      </div>
    </footer>
  );
};