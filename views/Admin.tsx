import React, { useEffect, useState } from 'react';
import { StorageService } from '../services/storage';
import { StudentRegistration, RegistrationStatus } from '../types';
import { Eye, Check, X as XIcon, Trash2 } from 'lucide-react';

export const Admin: React.FC = () => {
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
    <div className="max-w-7xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Dashboard Admin (Demo)</h2>
          <p className="text-gray-500 text-sm">Kelola data pendaftaran dan dokumen</p>
        </div>
        <button onClick={handleReset} className="text-red-600 text-sm hover:underline">Reset Data Demo</button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid gap-6">
            {students.length === 0 && <p className="text-gray-500">Belum ada data pendaftaran.</p>}
          {students.map((student) => (
            <div key={student.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-bold text-lg text-gray-900">{student.fullName}</h3>
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                    student.status === RegistrationStatus.ACCEPTED ? 'bg-green-100 text-green-800' :
                    student.status === RegistrationStatus.REJECTED ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {student.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-600">
                    <p><span className="font-semibold">NIK:</span> {student.nik}</p>
                    <p><span className="font-semibold">TTL:</span> {student.birthPlace}, {student.birthDate}</p>
                    <p><span className="font-semibold">Ortu:</span> {student.parentName}</p>
                    <p><span className="font-semibold">HP:</span> {student.parentPhone}</p>
                    <p className="col-span-2"><span className="font-semibold">Alamat:</span> {student.address}</p>
                </div>
              </div>

              <div className="flex gap-4">
                {student.kkImage && (
                    <div className="w-24 h-24 bg-gray-100 rounded border overflow-hidden relative group">
                        <img src={student.kkImage} alt="KK" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs">
                            KK
                        </div>
                    </div>
                )}
                {student.akteImage && (
                    <div className="w-24 h-24 bg-gray-100 rounded border overflow-hidden relative group">
                        <img src={student.akteImage} alt="Akte" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs">
                            Akte
                        </div>
                    </div>
                )}
              </div>

              <div className="flex flex-row lg:flex-col gap-2 justify-center border-t lg:border-t-0 lg:border-l pt-4 lg:pt-0 lg:pl-6">
                <button 
                  onClick={() => handleStatusChange(student.id, RegistrationStatus.ACCEPTED)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg text-sm font-medium transition-colors"
                >
                  <Check className="w-4 h-4" /> Terima
                </button>
                <button 
                  onClick={() => handleStatusChange(student.id, RegistrationStatus.REJECTED)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors"
                >
                  <XIcon className="w-4 h-4" /> Tolak
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};