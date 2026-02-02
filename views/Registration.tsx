import React, { useState } from 'react';
import { Upload, Check, AlertCircle, Loader2, ArrowLeft, Camera } from 'lucide-react';
import { StorageService } from '../services/storage';

interface RegistrationProps {
  onNavigate: (page: string) => void;
}

export const Registration: React.FC<RegistrationProps> = ({ onNavigate }) => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [successId, setSuccessId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    nik: '',
    birthPlace: '',
    birthDate: '',
    gender: 'Laki-laki' as 'Laki-laki' | 'Perempuan',
    address: '',
    parentName: '',
    parentPhone: '',
  });

  const [files, setFiles] = useState<{ kk: string | null; akte: string | null }>({
    kk: null,
    akte: null,
  });

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const MAX_WIDTH = 800;
          let width = img.width;
          let height = img.height;
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
          canvas.width = width;
          canvas.height = height;
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
            resolve(dataUrl);
          } else {
            reject(new Error("Gagal memproses gambar"));
          }
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'kk' | 'akte') => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert("Mohon upload file gambar (JPG/PNG).");
        return;
      }
      try {
        const compressedBase64 = await compressImage(file);
        setFiles(prev => ({ ...prev, [type]: compressedBase64 }));
      } catch (err) {
        alert("Gagal memproses gambar.");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!files.kk || !files.akte) {
      setError("Mohon upload KK dan Akte sebelum mendaftar.");
      setIsLoading(false);
      return;
    }

    try {
      const result = await StorageService.addStudent({
        ...formData,
        kkImage: files.kk,
        akteImage: files.akte,
      });
      setSuccessId(result.id);
      setStep(4);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat menyimpan data.");
    } finally {
      setIsLoading(false);
    }
  };

  if (successId) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center animate-fade-in">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
          <Check className="w-12 h-12 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Pendaftaran Berhasil!</h2>
        <p className="text-gray-500 mb-8">
          Data <strong>{formData.fullName}</strong> berhasil dikirim. Silakan cek menu Pengumuman secara berkala.
        </p>
        <div className="space-y-3 w-full max-w-xs">
            <button 
            onClick={() => onNavigate('home')}
            className="w-full bg-gray-100 text-gray-800 px-6 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors"
            >
            Kembali ke Beranda
            </button>
            <button 
            onClick={() => window.location.reload()}
            className="w-full bg-school-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-school-700 transition-colors shadow-lg shadow-school-200"
            >
            Daftar Siswa Lain
            </button>
        </div>
      </div>
    );
  }

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
        <h1 className="font-bold text-lg text-gray-800">Formulir PPDB</h1>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Progress Bar */}
        <div className="flex justify-between items-center mb-8 px-4">
            {[1, 2, 3].map((num) => (
                <div key={num} className="flex flex-col items-center gap-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= num ? 'bg-school-600 text-white shadow-md' : 'bg-gray-200 text-gray-500'}`}>
                        {step > num ? <Check className="w-5 h-5" /> : num}
                    </div>
                    <span className="text-[10px] text-gray-500 font-medium">
                        {num === 1 ? 'Data Diri' : num === 2 ? 'Ortu' : 'Berkas'}
                    </span>
                </div>
            ))}
             <div className="absolute left-0 right-0 top-6 h-0.5 bg-gray-200 -z-10 mx-12 hidden md:block"></div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6">
            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6 flex items-start gap-3 border border-red-100 text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>{error}</div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-5 animate-fade-in">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nama Lengkap</label>
                  <input required type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-school-500 focus:outline-none transition-all" placeholder="Sesuai Akte" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">NIK</label>
                  <input required type="number" name="nik" value={formData.nik} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-school-500 focus:outline-none transition-all" placeholder="16 Digit" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tempat Lahir</label>
                    <input required type="text" name="birthPlace" value={formData.birthPlace} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-school-500 focus:outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tgl Lahir</label>
                    <input required type="date" name="birthDate" value={formData.birthDate} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-school-500 focus:outline-none transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Jenis Kelamin</label>
                  <div className="flex gap-2">
                    {['Laki-laki', 'Perempuan'].map((g) => (
                      <label key={g} className={`flex-1 text-center py-3 rounded-xl cursor-pointer border transition-all ${formData.gender === g ? 'bg-school-50 border-school-500 text-school-700 font-bold' : 'bg-white border-gray-200 text-gray-600'}`}>
                        <input type="radio" name="gender" value={g} checked={formData.gender === g} onChange={handleInputChange} className="hidden" />
                        {g}
                      </label>
                    ))}
                  </div>
                </div>
                <button type="button" onClick={() => setStep(2)} className="w-full bg-school-600 text-white py-3.5 rounded-xl font-bold hover:bg-school-700 transition-colors shadow-lg shadow-school-200 mt-4">
                  Lanjut
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5 animate-fade-in">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nama Ortu/Wali</label>
                  <input required type="text" name="parentName" value={formData.parentName} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-school-500 focus:outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">No. WhatsApp</label>
                  <input required type="tel" name="parentPhone" value={formData.parentPhone} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-school-500 focus:outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Alamat Lengkap</label>
                  <textarea required name="address" value={formData.address} onChange={handleInputChange} rows={3} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-school-500 focus:outline-none transition-all" />
                </div>
                <div className="flex gap-3 mt-4">
                    <button type="button" onClick={() => setStep(1)} className="flex-1 bg-gray-100 text-gray-700 py-3.5 rounded-xl font-bold hover:bg-gray-200 transition-colors">
                    Kembali
                    </button>
                    <button type="button" onClick={() => setStep(3)} className="flex-1 bg-school-600 text-white py-3.5 rounded-xl font-bold hover:bg-school-700 transition-colors shadow-lg shadow-school-200">
                    Lanjut
                    </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-fade-in">
                {['kk', 'akte'].map((type) => (
                  <div key={type} className="border-2 border-dashed border-gray-200 rounded-xl p-4 bg-gray-50 hover:bg-white hover:border-school-400 transition-all text-center relative group">
                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, type as 'kk' | 'akte')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                    <div className="flex flex-col items-center gap-2">
                      {files[type as 'kk' | 'akte'] ? (
                        <div className="relative w-full h-32 rounded-lg overflow-hidden border border-gray-200">
                            <img src={files[type as 'kk' | 'akte']!} alt={type} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-medium text-sm">Ganti Foto</div>
                        </div>
                      ) : (
                        <>
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-school-500 mb-1">
                                <Camera className="w-6 h-6" />
                            </div>
                            <span className="font-bold text-gray-600 text-sm">Upload Foto {type === 'kk' ? 'Kartu Keluarga' : 'Akte Kelahiran'}</span>
                            <span className="text-xs text-gray-400">Ketuk untuk mengambil gambar</span>
                        </>
                      )}
                    </div>
                  </div>
                ))}

                <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
                  <button type="button" onClick={() => setStep(2)} disabled={isLoading} className="flex-1 bg-gray-100 text-gray-700 py-3.5 rounded-xl font-bold hover:bg-gray-200 transition-colors disabled:opacity-50">
                    Kembali
                  </button>
                  <button type="submit" disabled={isLoading} className="flex-1 bg-accent-500 text-white py-3.5 rounded-xl font-bold hover:bg-accent-600 transition-colors shadow-lg shadow-accent-200 flex items-center justify-center gap-2 disabled:opacity-50">
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                    {isLoading ? 'Mengirim...' : 'Kirim Data'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};