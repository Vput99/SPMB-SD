import React, { useEffect, useState } from 'react';
import { Search, Trophy, ArrowLeft } from 'lucide-react';
import { StorageService } from '../services/storage';
import { StudentRegistration, RegistrationStatus } from '../types';

interface AnnouncementProps {
  onNavigate: (page: string) => void;
}

export const Announcement: React.FC<AnnouncementProps> = ({ onNavigate }) => {
  const [students, setStudents] = useState<StudentRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const data = await StorageService.getStudents();
      const accepted = data.filter(s => s.status === RegistrationStatus.ACCEPTED);
      setStudents(accepted);
      setLoading(false);
    };
    fetchData();
  }, []);

  const filteredStudents = students.filter(student => 
    student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.nik.includes(searchTerm)
  );

  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      {/* Sticky Top Bar */}
      <div className="bg-white px-4 py-3 shadow-sm sticky top-0 z-50 flex items-center gap-3">
        <button 
          onClick={() => onNavigate('home')} 
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="font-bold text-lg text-gray-800">Pengumuman</h1>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        <div className="bg-gradient-to-r from-yellow-500 to-amber-500 rounded-2xl p-6 text-white text-center shadow-lg mb-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-6 -mt-6"></div>
            <Trophy className="w-12 h-12 mx-auto mb-3 text-white drop-shadow-sm" />
            <h2 className="text-xl font-bold mb-1">Selamat & Sukses!</h2>
            <p className="text-yellow-50 text-sm">Bagi calon peserta didik yang dinyatakan diterima.</p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari Nama Siswa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-school-500 transition-all"
            />
        </div>

        {loading ? (
          <div className="text-center py-10 text-gray-500">Memuat data...</div>
        ) : filteredStudents.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-xl shadow-sm border border-gray-100">
             <p className="text-gray-500">{searchTerm ? 'Nama tidak ditemukan.' : 'Belum ada data pengumuman.'}</p>
          </div>
        ) : (
          <div className="space-y-3">
             {filteredStudents.map((student, index) => (
                 <div key={student.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 animate-fade-in-up">
                    <div className="w-10 h-10 rounded-full bg-school-50 text-school-700 flex items-center justify-center font-bold text-sm flex-shrink-0">
                        {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-800 truncate">{student.fullName}</h4>
                        <p className="text-xs text-gray-500 truncate">{student.address}</p>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded uppercase">
                        Diterima
                    </span>
                 </div>
             ))}
          </div>
        )}

        <div className="mt-8 bg-blue-50 border border-blue-100 p-4 rounded-xl text-center">
            <h4 className="font-bold text-blue-900 text-sm mb-1">Jadwal Daftar Ulang</h4>
            <p className="text-blue-800 text-xs">8 - 10 Juli 2024 di Sekretariat Sekolah</p>
        </div>
      </div>
    </div>
  );
};