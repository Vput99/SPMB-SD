import React, { useEffect, useState } from 'react';
import { StorageService } from '../services/storage';
import { StudentRegistration, RegistrationStatus } from '../types';
import { Check, X as XIcon, Trash2, ArrowLeft, RefreshCw } from 'lucide-react';

interface AdminProps {
  onNavigate: (page: string) => void;
}

export const Admin: React.FC<AdminProps> = ({ onNavigate }) => {
  const [students, setStudents] = useState<StudentRegistration[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const data = await StorageService.getStudents();
    setStudents(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = async (id: string, status: RegistrationStatus) => {
    await StorageService.updateStatus(id, status);
    fetchData();
  };

  const handleReset = () => {
    if(confirm("Hapus semua data demo?")) {
        StorageService.clearData();
        window.location.reload();
    }
  }

  return (
    <div className="bg-gray-100 min-h-screen pb-10">
      {/* Top Bar */}
      <div className="bg-school-900 text-white px-4 py-4 shadow-md sticky top-0 z-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
            <button 
            onClick={() => onNavigate('home')} 
            className="p-1 rounded hover:bg-white/20 transition-colors"
            >
            <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
                <h1 className="font-bold text-lg leading-none">Admin Panel</h1>
                <p className="text-[10px] text-gray-300">Kelola Data PPDB</p>
            </div>
        </div>
        <button onClick={fetchData} className="p-2 hover:bg-white/20 rounded-full">
            <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-gray-700">Data Masuk ({students.length})</h2>
            <button onClick={handleReset} className="text-red-600 text-xs font-medium hover:underline">Reset Demo</button>
        </div>

        {loading ? (
          <div className="text-center py-10 text-gray-500">Memuat data...</div>
        ) : (
          <div className="space-y-4">
            {students.length === 0 && <p className="text-center text-gray-500 py-10 bg-white rounded-xl">Belum ada pendaftaran.</p>}
            
            {students.map((student) => (
              <div key={student.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <h3 className="font-bold text-gray-900">{student.fullName}</h3>
                        <p className="text-xs text-gray-500">NIK: {student.nik}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide ${
                        student.status === RegistrationStatus.ACCEPTED ? 'bg-green-100 text-green-700' :
                        student.status === RegistrationStatus.REJECTED ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                    }`}>
                        {student.status}
                    </span>
                </div>

                <div className="text-xs text-gray-600 space-y-1 mb-4 bg-gray-50 p-3 rounded-lg">
                    <p><strong>TTL:</strong> {student.birthPlace}, {student.birthDate}</p>
                    <p><strong>Ortu:</strong> {student.parentName} ({student.parentPhone})</p>
                    <p><strong>Alamat:</strong> {student.address}</p>
                </div>

                <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                    {student.kkImage && (
                        <a href={student.kkImage} target="_blank" rel="noreferrer" className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-lg overflow-hidden border">
                            <img src={student.kkImage} alt="KK" className="w-full h-full object-cover" />
                        </a>
                    )}
                    {student.akteImage && (
                        <a href={student.akteImage} target="_blank" rel="noreferrer" className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-lg overflow-hidden border">
                            <img src={student.akteImage} alt="Akte" className="w-full h-full object-cover" />
                        </a>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => handleStatusChange(student.id, RegistrationStatus.ACCEPTED)}
                    className="flex items-center justify-center gap-2 py-2 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg text-xs font-bold transition-colors border border-green-200"
                  >
                    <Check className="w-4 h-4" /> TERIMA
                  </button>
                  <button 
                    onClick={() => handleStatusChange(student.id, RegistrationStatus.REJECTED)}
                    className="flex items-center justify-center gap-2 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-xs font-bold transition-colors border border-red-200"
                  >
                    <XIcon className="w-4 h-4" /> TOLAK
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};