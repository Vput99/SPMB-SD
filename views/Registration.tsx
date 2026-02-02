import React, { useState } from 'react';
import { Upload, Check, AlertCircle, Loader2 } from 'lucide-react';
import { StorageService } from '../services/storage';

export const Registration: React.FC = () => {
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

  // Fungsi untuk mengompres gambar agar ukurannya kecil (di bawah 400KB)
  // Ini Wajib karena Firestore membatasi 1MB per dokumen
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
          
          // Logika Resize: Max lebar 800px
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
            // Kompresi ke JPEG dengan kualitas 0.6 (60%)
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
      // Validasi awal tipe file
      if (!file.type.startsWith('image/')) {
        alert("Mohon upload file gambar (JPG/PNG).");
        return;
      }

      try {
        // Lakukan kompresi sebelum disimpan ke state
        const compressedBase64 = await compressImage(file);
        setFiles(prev => ({ ...prev, [type]: compressedBase64 }));
      } catch (err) {
        console.error("Gagal mengompres gambar:", err);
        alert("Gagal memproses gambar. Coba gambar lain.");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!files.kk || !files.akte) {
      setError("Mohon upload kedua dokumen (KK dan Akte) sebelum mendaftar.");
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
      setStep(4); // Success step
    } catch (err: any) {
      // Error handling khusus jika payload terlalu besar
      if (err.message && err.message.includes("exceeds the maximum allowed size")) {
        setError("Ukuran data terlalu besar. Mohon ganti foto dengan resolusi lebih rendah.");
      } else {
        setError(err.message || "Terjadi kesalahan saat menyimpan data.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const Steps = () => (
    <div className="flex justify-center mb-8">
      <div className="flex items-center">
        {[1, 2, 3].map((num) => (
          <div key={num} className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= num ? 'bg-school-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
              {step > num ? <Check className="w-6 h-6" /> : num}
            </div>
            {num < 3 && <div className={`w-16 h-1 ${step > num ? 'bg-school-600' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>
    </div>
  );

  if (successId) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center animate-fade-in-up">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-12 h-12 text-green-600" />
        </div>
        <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">Pendaftaran Berhasil!</h2>
        <p className="text-lg text-gray-600 mb-8">
          Data Ananda <strong>{formData.fullName}</strong> telah berhasil disimpan ke database sekolah.
          <br/>Silakan cek status penerimaan secara berkala di menu Pengumuman.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-school-600 text-white px-6 py-3 rounded-lg hover:bg-school-700 transition-colors"
        >
          Daftar Siswa Lain
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h2 className="text-3xl font-heading font-bold text-center text-school-900 mb-2">Formulir Pendaftaran</h2>
      <p className="text-center text-gray-500 mb-8">Isi data dengan benar dan jujur sesuai dokumen asli.</p>
      
      <Steps />

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="p-8">
          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 flex items-center gap-3 border border-red-100">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <div className="text-sm">{error}</div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-xl font-bold text-school-700 border-b pb-2">Data Diri Calon Siswa</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                <input
                  required
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-school-500 focus:border-school-500"
                  placeholder="Sesuai Akte Kelahiran"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">NIK (Nomor Induk Kependudukan)</label>
                <input
                  required
                  type="number"
                  name="nik"
                  value={formData.nik}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-school-500 focus:border-school-500"
                  placeholder="16 digit angka"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tempat Lahir</label>
                  <input
                    required
                    type="text"
                    name="birthPlace"
                    value={formData.birthPlace}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-school-500 focus:border-school-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Lahir</label>
                  <input
                    required
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-school-500 focus:border-school-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Kelamin</label>
                <div className="flex gap-4">
                  {['Laki-laki', 'Perempuan'].map((g) => (
                    <label key={g} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value={g}
                        checked={formData.gender === g}
                        onChange={handleInputChange}
                        className="text-school-600 focus:ring-school-500 h-4 w-4"
                      />
                      {g}
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="bg-school-600 text-white px-6 py-2 rounded-lg hover:bg-school-700 transition-colors font-medium"
                >
                  Lanjut
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-xl font-bold text-school-700 border-b pb-2">Data Orang Tua & Alamat</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Orang Tua / Wali</label>
                <input
                  required
                  type="text"
                  name="parentName"
                  value={formData.parentName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-school-500 focus:border-school-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nomor WhatsApp</label>
                <input
                  required
                  type="tel"
                  name="parentPhone"
                  value={formData.parentPhone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-school-500 focus:border-school-500"
                  placeholder="08..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Lengkap</label>
                <textarea
                  required
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-school-500 focus:border-school-500"
                  placeholder="Nama Jalan, RT/RW, Dusun, Desa"
                />
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-gray-600 px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                >
                  Kembali
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="bg-school-600 text-white px-6 py-2 rounded-lg hover:bg-school-700 transition-colors font-medium"
                >
                  Lanjut
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-xl font-bold text-school-700 border-b pb-2">Upload Dokumen</h3>
              
              <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800 mb-4">
                <p><strong>Info:</strong> Foto dokumen akan dikompres otomatis agar hemat data. Pastikan tulisan tetap terbaca jelas saat difoto.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-school-500 transition-colors bg-gray-50">
                  <div className="mb-4 flex justify-center">
                    {files.kk ? (
                      <img src={files.kk} alt="Preview KK" className="h-32 object-contain" />
                    ) : (
                      <Upload className="w-12 h-12 text-gray-400" />
                    )}
                  </div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Foto Kartu Keluarga (KK)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'kk')}
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-school-50 file:text-school-700
                      hover:file:bg-school-100"
                  />
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-school-500 transition-colors bg-gray-50">
                  <div className="mb-4 flex justify-center">
                    {files.akte ? (
                      <img src={files.akte} alt="Preview Akte" className="h-32 object-contain" />
                    ) : (
                      <Upload className="w-12 h-12 text-gray-400" />
                    )}
                  </div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Foto Akte Kelahiran
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'akte')}
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-school-50 file:text-school-700
                      hover:file:bg-school-100"
                  />
                </div>
              </div>

              <div className="flex justify-between pt-6 border-t mt-6">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={isLoading}
                  className="text-gray-600 px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium disabled:opacity-50"
                >
                  Kembali
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-accent-500 text-white px-8 py-2 rounded-lg hover:bg-accent-600 transition-colors font-bold shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                  {isLoading ? 'Mengirim Data...' : 'Kirim Pendaftaran'}
                </button>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};