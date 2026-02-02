import React, { useState } from 'react';
import { Upload, Check, AlertCircle, Loader2, ArrowLeft, Camera, FileText, User, Phone, MapPin, Calendar as CalendarIcon, Printer } from 'lucide-react';
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

  const handleNextToValidation = () => {
     if (!files.kk || !files.akte) {
        setError("Mohon upload KK dan Akte sebelum melanjutkan.");
        return;
     }
     setError(null);
     setStep(4);
  }

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
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat menyimpan data.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (successId) {
    return (
      <>
        {/* Tampilan Layar (Screen View) */}
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center animate-fade-in print:hidden">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
            <Check className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Pendaftaran Berhasil!</h2>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">
            Data atas nama <strong>{formData.fullName}</strong> berhasil dikirim. Silakan cetak bukti pendaftaran di bawah ini.
          </p>
          
          <div className="space-y-3 w-full max-w-xs">
              <button 
              onClick={handlePrint}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
              >
              <Printer className="w-5 h-5" />
              Cetak Bukti Pendaftaran
              </button>

              <div className="h-4"></div>

              <button 
              onClick={() => onNavigate('home')}
              className="w-full bg-gray-100 text-gray-800 px-6 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors"
              >
              Kembali ke Beranda
              </button>
              <button 
              onClick={() => window.location.reload()}
              className="w-full border border-school-600 text-school-600 px-6 py-3 rounded-xl font-bold hover:bg-school-50 transition-colors"
              >
              Daftar Siswa Lain
              </button>
          </div>
        </div>

        {/* Tampilan Cetak (Print View) - Hanya muncul saat diprint */}
        <div className="hidden print:block fixed inset-0 bg-white z-[9999] p-8 font-serif text-black">
            {/* Kop Surat */}
            <div className="flex items-center gap-4 border-b-4 border-black pb-4 mb-6">
                <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/b/b5/Tut_Wuri_Handayani.svg" 
                    alt="Logo" 
                    className="w-24 h-24 grayscale"
                />
                <div className="text-center flex-1">
                    <h3 className="text-lg font-bold uppercase tracking-widest">Pemerintah Kota Kediri</h3>
                    <h3 className="text-lg font-bold uppercase tracking-widest">Dinas Pendidikan</h3>
                    <h1 className="text-3xl font-black uppercase mb-1">UPTD SDN Tempurejo 1</h1>
                    <p className="text-sm">Jl. Bagawanta Bhari No. 1, Tempurejo, Kec. Pesantren, Kota Kediri - 64132</p>
                    <p className="text-sm">Email: sdntempurejo1@gmail.com | Telp: (0354) 123456</p>
                </div>
            </div>

            {/* Judul Dokumen */}
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold uppercase underline decoration-2 underline-offset-4">Bukti Pendaftaran PPDB Online</h2>
                <p className="text-md mt-1 font-bold">Tahun Ajaran 2026/2027</p>
            </div>

            {/* Nomor Registrasi */}
            <div className="border-2 border-black p-4 mb-8 text-center bg-gray-50">
                <p className="text-sm font-bold uppercase mb-1">Nomor Registrasi</p>
                <p className="text-3xl font-mono font-black tracking-widest">{successId.slice(0, 8).toUpperCase()}</p>
            </div>

            {/* Data Siswa */}
            <div className="mb-8">
                <h3 className="text-lg font-bold border-b border-black mb-4 pb-1">A. Data Calon Peserta Didik</h3>
                <table className="w-full text-sm">
                    <tbody>
                        <tr className="border-b border-gray-300">
                            <td className="py-2 w-40 font-bold">Nama Lengkap</td>
                            <td className="py-2">: {formData.fullName.toUpperCase()}</td>
                        </tr>
                        <tr className="border-b border-gray-300">
                            <td className="py-2 w-40 font-bold">NIK</td>
                            <td className="py-2">: {formData.nik}</td>
                        </tr>
                        <tr className="border-b border-gray-300">
                            <td className="py-2 w-40 font-bold">Tempat, Tgl Lahir</td>
                            <td className="py-2">: {formData.birthPlace}, {formData.birthDate}</td>
                        </tr>
                        <tr className="border-b border-gray-300">
                            <td className="py-2 w-40 font-bold">Jenis Kelamin</td>
                            <td className="py-2">: {formData.gender}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Data Orang Tua */}
            <div className="mb-8">
                <h3 className="text-lg font-bold border-b border-black mb-4 pb-1">B. Data Orang Tua / Wali</h3>
                <table className="w-full text-sm">
                    <tbody>
                        <tr className="border-b border-gray-300">
                            <td className="py-2 w-40 font-bold">Nama Orang Tua</td>
                            <td className="py-2">: {formData.parentName}</td>
                        </tr>
                        <tr className="border-b border-gray-300">
                            <td className="py-2 w-40 font-bold">No. WhatsApp</td>
                            <td className="py-2">: {formData.parentPhone}</td>
                        </tr>
                        <tr className="border-b border-gray-300">
                            <td className="py-2 w-40 font-bold">Alamat Rumah</td>
                            <td className="py-2">: {formData.address}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Catatan */}
            <div className="bg-gray-100 border border-gray-400 p-4 mb-12 text-sm">
                <p className="font-bold mb-2">Catatan Penting:</p>
                <ul className="list-disc pl-5 space-y-1">
                    <li>Simpan bukti pendaftaran ini sebagai syarat daftar ulang.</li>
                    <li>Silakan pantau hasil seleksi melalui menu <strong>PENGUMUMAN</strong> di website sekolah.</li>
                    <li>Verifikasi berkas fisik akan diinformasikan lebih lanjut melalui WhatsApp.</li>
                </ul>
            </div>

            {/* Tanda Tangan */}
            <div className="flex justify-end mt-10">
                <div className="text-center w-64">
                    <p className="mb-20">Kediri, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    <p className="font-bold border-b border-black inline-block min-w-[200px] mb-1">Panitia PPDB</p>
                    <p className="text-xs">SDN Tempurejo 1</p>
                </div>
            </div>

            {/* Footer Print */}
            <div className="fixed bottom-4 left-0 right-0 text-center text-[10px] text-gray-500 italic">
                Dicetak otomatis melalui Sistem PPDB Online SDN Tempurejo 1 pada {new Date().toLocaleString('id-ID')}
            </div>
        </div>
      </>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-10 print:hidden">
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
        <div className="flex justify-between items-center mb-8 px-2 relative">
             <div className="absolute left-4 right-4 top-5 h-0.5 bg-gray-200 -z-10"></div>
             <div className={`absolute left-4 top-5 h-0.5 bg-school-600 -z-10 transition-all duration-500`} style={{ width: `${((step - 1) / 3) * 100}%` }}></div>

            {[1, 2, 3, 4].map((num) => (
                <div key={num} className="flex flex-col items-center gap-1 bg-gray-50 px-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${step >= num ? 'bg-school-600 text-white shadow-md scale-110' : 'bg-gray-200 text-gray-500'}`}>
                        {step > num ? <Check className="w-5 h-5" /> : num}
                    </div>
                    <span className={`text-[10px] font-medium transition-colors ${step >= num ? 'text-school-700' : 'text-gray-400'}`}>
                        {num === 1 ? 'Data Diri' : num === 2 ? 'Ortu' : num === 3 ? 'Berkas' : 'Validasi'}
                    </span>
                </div>
            ))}
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
                  <button type="button" onClick={handleNextToValidation} className="flex-1 bg-school-600 text-white py-3.5 rounded-xl font-bold hover:bg-school-700 transition-colors shadow-lg shadow-school-200 flex items-center justify-center gap-2">
                    Lanjut Validasi
                  </button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6 animate-fade-in">
                <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-xl text-yellow-800 text-sm flex gap-3">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p>Mohon periksa kembali data di bawah ini sebelum dikirim. Data yang sudah dikirim tidak dapat diubah sendiri.</p>
                </div>

                <div className="space-y-4">
                    {/* Review Data Diri */}
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                        <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2 border-b border-gray-200 pb-2">
                            <User className="w-4 h-4 text-school-600" />
                            Data Calon Siswa
                        </h3>
                        <div className="grid grid-cols-1 gap-y-2 text-sm">
                            <div>
                                <span className="text-gray-500 text-xs block">Nama Lengkap</span>
                                <span className="font-medium text-gray-800">{formData.fullName}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <span className="text-gray-500 text-xs block">NIK</span>
                                    <span className="font-medium text-gray-800">{formData.nik}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500 text-xs block">Jenis Kelamin</span>
                                    <span className="font-medium text-gray-800">{formData.gender}</span>
                                </div>
                            </div>
                            <div>
                                <span className="text-gray-500 text-xs block">TTL</span>
                                <span className="font-medium text-gray-800">{formData.birthPlace}, {formData.birthDate}</span>
                            </div>
                        </div>
                    </div>

                    {/* Review Data Ortu */}
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                        <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2 border-b border-gray-200 pb-2">
                            <User className="w-4 h-4 text-school-600" />
                            Data Orang Tua
                        </h3>
                        <div className="grid grid-cols-1 gap-y-2 text-sm">
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <span className="text-gray-500 text-xs block">Nama Ortu</span>
                                    <span className="font-medium text-gray-800">{formData.parentName}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500 text-xs block">No. WhatsApp</span>
                                    <span className="font-medium text-gray-800">{formData.parentPhone}</span>
                                </div>
                            </div>
                            <div>
                                <span className="text-gray-500 text-xs block">Alamat</span>
                                <span className="font-medium text-gray-800">{formData.address}</span>
                            </div>
                        </div>
                    </div>

                    {/* Review Berkas */}
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                        <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2 border-b border-gray-200 pb-2">
                            <FileText className="w-4 h-4 text-school-600" />
                            Berkas
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="border rounded-lg p-2 bg-white text-center">
                                <span className="text-xs text-gray-500 block mb-1">Kartu Keluarga</span>
                                <img src={files.kk!} alt="Preview KK" className="w-full h-20 object-cover rounded" />
                            </div>
                            <div className="border rounded-lg p-2 bg-white text-center">
                                <span className="text-xs text-gray-500 block mb-1">Akte Kelahiran</span>
                                <img src={files.akte!} alt="Preview Akte" className="w-full h-20 object-cover rounded" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
                  <button type="button" onClick={() => setStep(3)} disabled={isLoading} className="flex-1 bg-gray-100 text-gray-700 py-3.5 rounded-xl font-bold hover:bg-gray-200 transition-colors disabled:opacity-50">
                    Perbaiki Data
                  </button>
                  <button type="submit" disabled={isLoading} className="flex-1 bg-accent-500 text-white py-3.5 rounded-xl font-bold hover:bg-accent-600 transition-colors shadow-lg shadow-accent-200 flex items-center justify-center gap-2 disabled:opacity-50">
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                    {isLoading ? 'Mengirim...' : 'Kirim Pendaftaran'}
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