import React, { useEffect, useState } from 'react';
import { Search, Trophy } from 'lucide-react';
import { StorageService } from '../services/storage';
import { StudentRegistration, RegistrationStatus } from '../types';

export const Announcement: React.FC = () => {
  const [students, setStudents] = useState<StudentRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const data = await StorageService.getStudents();
      // Filter only accepted students for public view
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
    <div className="max-w-5xl mx-auto py-10 px-4">
      <div className="text-center mb-10">
        <div className="inline-block p-4 bg-yellow-100 rounded-full mb-4 shadow-sm">
          <Trophy className="w-10 h-10 text-yellow-600" />
        </div>
        <h2 className="text-3xl font-heading font-bold text-school-900 mb-2">Pengumuman Kelulusan</h2>
        <p className="text-gray-600">Daftar calon peserta didik yang dinyatakan DITERIMA di SD Negeri Tempurejo 1</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h3 className="font-bold text-lg text-gray-800">Daftar Siswa Lolos Seleksi</h3>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Cari Nama / NIK..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-school-500"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-500">Memuat data...</div>
        ) : filteredStudents.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            {searchTerm ? 'Data tidak ditemukan.' : 'Belum ada pengumuman kelulusan.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-school-50 text-school-900 font-semibold uppercase text-xs tracking-wider">
                <tr>
                  <th className="p-4">No</th>
                  <th className="p-4">Nama Lengkap</th>
                  <th className="p-4">Asal / Alamat</th>
                  <th className="p-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredStudents.map((student, index) => (
                  <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-gray-500 font-mono text-sm">{index + 1}</td>
                    <td className="p-4">
                      <div className="font-bold text-gray-800">{student.fullName}</div>
                      <div className="text-xs text-gray-500">NIK: {student.nik.substring(0, 10)}******</div>
                    </td>
                    <td className="p-4 text-gray-600 text-sm">{student.address}</td>
                    <td className="p-4 text-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                        DITERIMA
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      <div className="mt-8 bg-blue-50 border border-blue-100 p-6 rounded-xl text-center">
        <h4 className="font-bold text-blue-900 mb-2">Informasi Daftar Ulang</h4>
        <p className="text-blue-800 text-sm">
          Bagi siswa yang dinyatakan diterima, harap melakukan daftar ulang pada tanggal <strong>8 - 10 Juli 2024</strong> di Sekretariat SD Negeri Tempurejo 1 membawa berkas asli.
        </p>
      </div>
    </div>
  );
};