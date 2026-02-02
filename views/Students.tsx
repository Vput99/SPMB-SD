import React, { useEffect, useState } from 'react';
import { Search, Users, ArrowLeft, CheckCircle2, MapPin } from 'lucide-react';
import { StorageService } from '../services/storage';
import { StudentRegistration, RegistrationStatus } from '../types';

interface StudentsProps {
  onNavigate: (page: string) => void;
}

export const Students: React.FC<StudentsProps> = ({ onNavigate }) => {
  const [students, setStudents] = useState<StudentRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const data = await StorageService.getStudents();
      // Filter hanya siswa yang statusnya ACCEPTED (Sudah divalidasi admin)
      const accepted = data.filter(s => s.status === RegistrationStatus.ACCEPTED);
      setStudents(accepted);
      setLoading(false);
    };
    fetchData();
  }, []);

  const filteredStudents = students.filter(student => 
    student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.address.toLowerCase().includes(searchTerm.toLowerCase())
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
        <h1 className="font-bold text-lg text-gray-800">Data Siswa Terverifikasi</h1>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Info Banner */}
        <div className="bg-school-600 rounded-2xl p-6 text-white mb-6 shadow-lg relative overflow-hidden">
            <div className="absolute right-0 top-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10"></div>
            <div className="relative z-10">
                <h2 className="text-xl font-black uppercase tracking-tight mb-1">Calon Siswa SD Negeri Tempurejo 1</h2>
                <p className="text-school-100 text-sm">Tahun Ajaran 2026/2027</p>
                <div className="mt-4 inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg">
                    <Users className="w-4 h-4 text-yellow-300" />
                    <span className="font-bold">{students.length} Siswa Terdaftar</span>
                </div>
            </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari nama siswa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-school-500 transition-all"
            />
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-10 gap-3">
             <div className="w-8 h-8 border-4 border-school-600 border-t-transparent rounded-full animate-spin"></div>
             <p className="text-gray-500 text-sm">Mengambil data siswa...</p>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-xl shadow-sm border border-gray-100">
             <p className="text-gray-500">{searchTerm ? 'Siswa tidak ditemukan.' : 'Belum ada siswa yang divalidasi.'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
             {filteredStudents.map((student, index) => (
                 <div key={student.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow animate-fade-in-up flex gap-4">
                    {/* Avatar / Photo Placeholder */}
                    <div className="w-14 h-14 rounded-full bg-gray-100 flex-shrink-0 overflow-hidden border-2 border-school-100">
                        {student.gender === 'Perempuan' ? (
                             <img src={`https://api.dicebear.com/7.x/micah/svg?seed=${student.fullName}&backgroundColor=fce7f3`} alt="Avatar" />
                        ) : (
                             <img src={`https://api.dicebear.com/7.x/micah/svg?seed=${student.fullName}&backgroundColor=e0f2fe`} alt="Avatar" />
                        )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                            <h4 className="font-bold text-gray-800 text-sm truncate pr-2">{student.fullName}</h4>
                            <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5 mb-2">{student.gender}</p>
                        
                        <div className="flex items-center gap-1 text-[10px] text-gray-400">
                            <MapPin className="w-3 h-3" />
                            <span className="truncate">{student.address}</span>
                        </div>
                    </div>
                 </div>
             ))}
          </div>
        )}
      </div>
    </div>
  );
};