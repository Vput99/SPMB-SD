import React, { useEffect, useState } from 'react';
import { StorageService } from '../services/storage';
import { StudentRegistration, RegistrationStatus } from '../types';
import { Check, X as XIcon, Trash2, ArrowLeft, RefreshCw, Download, FileText, User, Calendar, MapPin, Phone, Settings, Upload, Image as ImageIcon, Save } from 'lucide-react';

interface AdminProps {
  onNavigate: (page: string) => void;
}

export const Admin: React.FC<AdminProps> = ({ onNavigate }) => {
  const [students, setStudents] = useState<StudentRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Logo State
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isSavingLogo, setIsSavingLogo] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const data = await StorageService.getStudents();
    setStudents(data);
    
    // Get existing logo
    const currentLogo = await StorageService.getSchoolLogo();
    if(currentLogo) setLogoPreview(currentLogo);
    
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = async (id: string, status: RegistrationStatus) => {
    if(confirm(`Apakah Anda yakin ingin mengubah status menjadi ${status}?`)) {
        await StorageService.updateStatus(id, status);
        fetchData();
    }
  };

  const handleReset = () => {
    if(confirm("Hapus semua data demo?")) {
        StorageService.clearData();
        window.location.reload();
    }
  }

  const downloadImage = (dataUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Logo Upload Handlers
  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        if (!file.type.startsWith('image/')) {
            alert("Mohon upload file gambar.");
            return;
        }
        
        // Convert to Base64
        const reader = new FileReader();
        reader.onload = (ev) => {
            const result = ev.target?.result as string;
            setLogoPreview(result);
        };
        reader.readAsDataURL(file);
    }
  };

  const saveLogo = async () => {
      if (!logoPreview) return;
      setIsSavingLogo(true);
      try {
          await StorageService.saveSchoolLogo(logoPreview);
          // Update local cache manually to reflect changes immediately
          localStorage.setItem('schoolLogo', logoPreview);
          alert("Logo sekolah berhasil diperbarui!");
      } catch (error) {
          alert("Gagal menyimpan logo.");
      } finally {
          setIsSavingLogo(false);
      }
  };

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
                <p className="text-[10px] text-gray-300">Dashboard Administrator</p>
            </div>
        </div>
        <button onClick={fetchData} className="p-2 hover:bg-white/20 rounded-full">
            <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        
        {/* Settings Section (Logo) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="font-bold text-gray-800 flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
                <Settings className="w-5 h-5 text-school-600" />
                Pengaturan Sekolah
            </h2>
            <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-full md:w-auto flex flex-col items-center gap-3">
                    <div className="w-32 h-32 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden relative group">
                        {logoPreview ? (
                            <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-contain p-2" />
                        ) : (
                            <div className="text-gray-400 text-xs text-center p-2">
                                <ImageIcon className="w-8 h-8 mx-auto mb-1" />
                                Belum ada logo
                            </div>
                        )}
                        <label className="absolute inset-0 bg-black/0 group-hover:bg-black/10 cursor-pointer flex items-center justify-center transition-all">
                             <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                             <Upload className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 drop-shadow-md" />
                        </label>
                    </div>
                    <p className="text-[10px] text-gray-500 text-center max-w-[150px]">
                        Klik gambar untuk upload Logo Sekolah (Format PNG/JPG transparan disarankan)
                    </p>
                </div>
                <div className="flex-1 space-y-3">
                    <div>
                        <h3 className="font-bold text-sm text-gray-700">Logo Sekolah</h3>
                        <p className="text-xs text-gray-500 leading-relaxed">
                            Logo ini akan ditampilkan di Header, Footer, Halaman Depan, dan Surat Bukti Pendaftaran.
                        </p>
                    </div>
                    {logoPreview && (
                         <button 
                            onClick={saveLogo}
                            disabled={isSavingLogo}
                            className="flex items-center gap-2 px-4 py-2 bg-school-600 text-white rounded-lg text-sm font-bold hover:bg-school-700 transition-colors disabled:opacity-50"
                         >
                            {isSavingLogo ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            {isSavingLogo ? 'Menyimpan...' : 'Simpan Perubahan Logo'}
                         </button>
                    )}
                </div>
            </div>
        </div>

        {/* Verifikasi Section */}
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-gray-700 flex items-center gap-2">
                    <User className="w-5 h-5 text-school-600" />
                    Verifikasi Pendaftar ({students.length})
                </h2>
                <button onClick={handleReset} className="text-red-600 text-xs font-medium hover:underline bg-red-50 px-2 py-1 rounded">Reset Demo</button>
            </div>

            {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
                <div className="w-8 h-8 border-4 border-school-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-500 text-sm">Memuat data...</p>
            </div>
            ) : (
            <div className="space-y-6">
                {students.length === 0 && (
                    <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-dashed border-gray-300">
                        <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 font-medium">Belum ada pendaftaran masuk.</p>
                    </div>
                )}
                
                {students.map((student) => (
                <div key={student.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md">
                    
                    {/* Card Header */}
                    <div className="bg-gray-50 px-5 py-4 border-b border-gray-100 flex justify-between items-start">
                        <div>
                            <h3 className="font-bold text-gray-900 text-lg">{student.fullName}</h3>
                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                <span className="font-mono bg-gray-200 px-1.5 py-0.5 rounded text-gray-700">{student.nik}</span>
                                <span>•</span>
                                <span>{new Date(student.registrationDate).toLocaleDateString('id-ID')}</span>
                            </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                            student.status === RegistrationStatus.ACCEPTED ? 'bg-green-100 text-green-700 border-green-200' :
                            student.status === RegistrationStatus.REJECTED ? 'bg-red-100 text-red-700 border-red-200' :
                            'bg-yellow-100 text-yellow-700 border-yellow-200'
                        }`}>
                            {student.status === 'PENDING' ? 'MENUNGGU' : student.status}
                        </span>
                    </div>

                    <div className="p-5">
                        {/* Data Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-[10px] text-gray-500 uppercase font-bold">TTL & Gender</p>
                                        <p className="text-sm font-medium text-gray-800">{student.birthPlace}, {student.birthDate}</p>
                                        <p className="text-xs text-gray-600">{student.gender}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-[10px] text-gray-500 uppercase font-bold">Alamat</p>
                                        <p className="text-sm font-medium text-gray-800 leading-snug">{student.address}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <User className="w-4 h-4 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-[10px] text-gray-500 uppercase font-bold">Orang Tua</p>
                                        <p className="text-sm font-medium text-gray-800">{student.parentName}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Phone className="w-4 h-4 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-[10px] text-gray-500 uppercase font-bold">Kontak (WA)</p>
                                        <a href={`https://wa.me/${student.parentPhone.replace(/^0/, '62')}`} target="_blank" rel="noreferrer" className="text-sm font-medium text-blue-600 hover:underline">
                                            {student.parentPhone}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Documents Section */}
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 mb-6">
                            <h4 className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
                                <FileText className="w-4 h-4" /> Dokumen Lampiran
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                                {/* KK Card */}
                                <div className="bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
                                    <div className="aspect-video bg-gray-100 rounded overflow-hidden mb-2 relative group cursor-pointer">
                                        {student.kkImage ? (
                                            <a href={student.kkImage} target="_blank" rel="noreferrer">
                                                <img src={student.kkImage} alt="KK" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                            </a>
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Image</div>
                                        )}
                                    </div>
                                    <div className="flex justify-between items-center px-1">
                                        <span className="text-xs font-bold text-gray-700">Kartu Keluarga</span>
                                        {student.kkImage && (
                                            <button 
                                                onClick={() => downloadImage(student.kkImage!, `KK - ${student.fullName}.jpg`)}
                                                className="text-blue-600 hover:bg-blue-50 p-1 rounded transition-colors"
                                                title="Download KK"
                                            >
                                                <Download className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Akte Card */}
                                <div className="bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
                                    <div className="aspect-video bg-gray-100 rounded overflow-hidden mb-2 relative group cursor-pointer">
                                        {student.akteImage ? (
                                            <a href={student.akteImage} target="_blank" rel="noreferrer">
                                                <img src={student.akteImage} alt="Akte" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                            </a>
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Image</div>
                                        )}
                                    </div>
                                    <div className="flex justify-between items-center px-1">
                                        <span className="text-xs font-bold text-gray-700">Akte Lahir</span>
                                        {student.akteImage && (
                                            <button 
                                                onClick={() => downloadImage(student.akteImage!, `Akte - ${student.fullName}.jpg`)}
                                                className="text-blue-600 hover:bg-blue-50 p-1 rounded transition-colors"
                                                title="Download Akte"
                                            >
                                                <Download className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        {student.status === RegistrationStatus.PENDING && (
                            <div className="grid grid-cols-2 gap-3">
                                <button 
                                    onClick={() => handleStatusChange(student.id, RegistrationStatus.ACCEPTED)}
                                    className="flex items-center justify-center gap-2 py-3 bg-green-600 text-white hover:bg-green-700 rounded-xl font-bold transition-all shadow-md shadow-green-200"
                                >
                                    <Check className="w-5 h-5" /> TERIMA SISWA
                                </button>
                                <button 
                                    onClick={() => handleStatusChange(student.id, RegistrationStatus.REJECTED)}
                                    className="flex items-center justify-center gap-2 py-3 bg-white text-red-600 border-2 border-red-100 hover:bg-red-50 rounded-xl font-bold transition-all"
                                >
                                    <XIcon className="w-5 h-5" /> TOLAK
                                </button>
                            </div>
                        )}
                        
                        {student.status !== RegistrationStatus.PENDING && (
                            <div className="text-center pt-2 border-t border-gray-100">
                                <button 
                                    onClick={() => handleStatusChange(student.id, RegistrationStatus.PENDING)}
                                    className="text-gray-400 text-xs hover:text-gray-600 underline"
                                >
                                    Batalkan Status (Kembali ke Pending)
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                ))}
            </div>
            )}
        </div>
      </div>
    </div>
  );
};