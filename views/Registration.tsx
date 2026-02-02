import React, { useState } from 'react';
import { Upload, Check, AlertCircle, Loader2, ArrowLeft, Camera, FileText, User, Phone, MapPin, Calendar as CalendarIcon, Printer, Users, ChevronDown, ChevronUp, Edit3, School, Plus, Trash2 } from 'lucide-react';
import { StorageService } from '../services/storage';
import { Logo } from '../components/Logo';

interface RegistrationProps {
  onNavigate: (page: string) => void;
}

// Daftar Sekolah Terdekat (Kec. Pesantren, Kediri)
const NEARBY_SCHOOLS = [
  "UPTD SDN Tempurejo 2",
  "UPTD SDN Ketami 1",
  "UPTD SDN Ketami 2",
  "UPTD SDN Ngletih 1",
  "UPTD SDN Bawang 2",
  "UPTD SDN Bawang 1",
  "UPTD SDN Pesantren 1",
  "UPTD SDN Pesantren 2",
  "UPTD SDN Bawang 3"
];

// Komponen Accordion Item dipindahkan ke luar agar tidak re-render saat state berubah
interface AccordionSectionProps {
  id: number;
  title: string;
  icon: any;
  children: React.ReactNode;
  isCompleted: boolean;
  currentStep: number;
  maxStep: number;
  onStepChange: (step: number) => void;
}

const AccordionSection: React.FC<AccordionSectionProps> = ({ 
  id, 
  title, 
  icon: Icon, 
  children, 
  isCompleted,
  currentStep,
  maxStep,
  onStepChange
}) => {
  const isActive = currentStep === id;
  const isLocked = id > maxStep;

  return (
      <div className={`border rounded-xl transition-all duration-300 overflow-hidden mb-3 ${isActive ? 'bg-white border-school-400 shadow-md ring-1 ring-school-100' : 'bg-gray-50 border-gray-200'}`}>
          <button 
              type="button"
              onClick={() => !isLocked && onStepChange(id)}
              disabled={isLocked}
              className={`w-full flex items-center justify-between p-4 text-left transition-colors ${isLocked ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:bg-gray-50'}`}
          >
              <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isActive ? 'bg-school-600 text-white' : isCompleted ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'}`}>
                      {isCompleted && !isActive ? <Check className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <div className="flex flex-col">
                    <span className={`font-bold text-sm ${isActive ? 'text-school-800' : 'text-gray-700'}`}>{title}</span>
                    {isCompleted && !isActive && <span className="text-[10px] text-green-600 font-medium flex items-center gap-1"><Check className="w-3 h-3" /> Data Tersimpan</span>}
                  </div>
              </div>
              {!isLocked && (
                  isActive ? <ChevronUp className="w-5 h-5 text-school-600" /> : <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
          </button>
          
          {isActive && (
              <div className="p-4 pt-0 border-t border-gray-100 animate-fade-in">
                  <div className="mt-4">
                    {children}
                  </div>
              </div>
          )}
      </div>
  );
};

export const Registration: React.FC<RegistrationProps> = ({ onNavigate }) => {
  // Step sekarang merepresentasikan Section yang sedang TERBUKA (Expanded)
  // Total ada 5 step sekarang (termasuk pilihan sekolah)
  const [step, setStep] = useState(1);
  const [maxStep, setMaxStep] = useState(1);
  
  const [isLoading, setIsLoading] = useState(false);
  const [successId, setSuccessId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // State untuk Pilihan Sekolah
  // Pilihan 1 terkunci otomatis
  const [schoolChoices, setSchoolChoices] = useState<string[]>(['UPTD SDN Tempurejo 1']);
  const [selectedNearbySchool, setSelectedNearbySchool] = useState<string>('');

  const [formData, setFormData] = useState({
    fullName: '',
    nik: '',
    birthPlace: '',
    birthDate: '',
    gender: 'Laki-laki' as 'Laki-laki' | 'Perempuan',
    address: '',
    
    kkNumber: '',
    fatherName: '',
    fatherNik: '',
    motherName: '',
    motherNik: '',
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

  // Logic tambah sekolah pilihan
  const addSchoolChoice = () => {
      if (!selectedNearbySchool) return;
      if (schoolChoices.includes(selectedNearbySchool)) {
          alert("Sekolah ini sudah dipilih.");
          return;
      }
      if (schoolChoices.length >= 5) {
          alert("Maksimal memilih 5 sekolah.");
          return;
      }
      setSchoolChoices([...schoolChoices, selectedNearbySchool]);
      setSelectedNearbySchool('');
  };

  // Logic hapus sekolah pilihan (kecuali index 0)
  const removeSchoolChoice = (index: number) => {
      if (index === 0) return; // Cannot remove main school
      const newChoices = [...schoolChoices];
      newChoices.splice(index, 1);
      setSchoolChoices(newChoices);
  };

  const handleNextStep = (nextStep: number) => {
      setError(null);
      // Validasi Step 1: Data Siswa
      if (step === 1) {
          if(!formData.fullName || !formData.nik || !formData.birthPlace || !formData.birthDate) {
              setError("Mohon lengkapi data diri wajib.");
              return;
          }
      }
      // Validasi Step 2: Data Ortu
      if (step === 2) {
          if(!formData.kkNumber || !formData.fatherName || !formData.motherName || !formData.parentPhone || !formData.address) {
              setError("Mohon lengkapi data orang tua & alamat.");
              return;
          }
      }
      // Validasi Step 3: Upload
      if (step === 3) {
        if (!files.kk || !files.akte) {
            setError("Mohon upload KK dan Akte sebelum melanjutkan.");
            return;
        }
      }
      // Validasi Step 4: Pilihan Sekolah (Step baru)
      if (step === 4 && nextStep === 5) {
          // Pilihan 1 selalu ada, jadi validasi minimal length 1 sudah pasti lolos
          if (schoolChoices.length < 1) {
              setError("Minimal pilih 1 sekolah.");
              return;
          }
      }

      setStep(nextStep);
      if (nextStep > maxStep) {
          setMaxStep(nextStep);
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
        schoolChoices: schoolChoices,
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
        {/* Style khusus untuk cetak agar ukuran kertas pas A4 */}
        <style>
            {`
            @media print {
                @page {
                    size: A4;
                    margin: 0;
                }
                body {
                    margin: 0;
                    padding: 0;
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }
                .print-hidden {
                    display: none !important;
                }
                .print-visible {
                    display: block !important;
                }
            }
            `}
        </style>

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

        {/* Tampilan Cetak (Print View) - Layout A4 */}
        <div className="hidden print:block fixed inset-0 bg-white z-[9999] font-serif text-black">
            {/* Sheet A4 Wrapper */}
            <div className="w-[210mm] min-h-[297mm] mx-auto p-[20mm] relative">
                
                {/* Kop Surat */}
                <div className="flex items-center gap-4 pb-2 mb-1">
                    <Logo className="w-24 h-24 grayscale" />
                    <div className="text-center flex-1">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-600">Pemerintah Kota Kediri</h3>
                        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-600 mb-1">Dinas Pendidikan</h3>
                        <h1 className="text-3xl font-black uppercase mb-1">SD NEGERI TEMPUREJO 1</h1>
                        <p className="text-sm">Jl. Raya Tempurejo No.12, Pesantren, Kediri</p>
                        <p className="text-sm">Email: admin.sd@sdntempurejo1kotakediri.my.id</p>
                    </div>
                </div>
                {/* Garis Ganda Kop Surat */}
                <div className="border-t-4 border-black mb-0.5"></div>
                <div className="border-t border-black mb-8"></div>

                {/* Judul Dokumen */}
                <div className="text-center mb-8">
                    <h2 className="text-xl font-bold uppercase underline decoration-2 underline-offset-4">Bukti Pendaftaran PPDB Online</h2>
                    <p className="text-md mt-1 font-bold">Tahun Ajaran 2026/2027</p>
                </div>

                {/* Nomor Registrasi Box */}
                <div className="border-2 border-black p-4 mb-8 text-center bg-gray-50 mx-auto w-3/4 rounded-lg">
                    <p className="text-sm font-bold uppercase mb-1">Nomor Registrasi</p>
                    <p className="text-3xl font-mono font-black tracking-widest">{successId.slice(0, 8).toUpperCase()}</p>
                </div>

                {/* Data Siswa */}
                <div className="mb-6">
                    <h3 className="text-md font-bold border-b border-black mb-3 pb-1 uppercase">A. Data Calon Peserta Didik</h3>
                    <table className="w-full text-sm">
                        <tbody>
                            <tr>
                                <td className="py-1.5 w-48 font-bold align-top">Nama Lengkap</td>
                                <td className="py-1.5 align-top font-medium">: {formData.fullName.toUpperCase()}</td>
                            </tr>
                            <tr>
                                <td className="py-1.5 w-48 font-bold align-top">NIK Siswa</td>
                                <td className="py-1.5 align-top">: {formData.nik}</td>
                            </tr>
                            <tr>
                                <td className="py-1.5 w-48 font-bold align-top">Tempat, Tgl Lahir</td>
                                <td className="py-1.5 align-top">: {formData.birthPlace}, {formData.birthDate}</td>
                            </tr>
                            <tr>
                                <td className="py-1.5 w-48 font-bold align-top">Jenis Kelamin</td>
                                <td className="py-1.5 align-top">: {formData.gender}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Pilihan Sekolah */}
                <div className="mb-6">
                    <h3 className="text-md font-bold border-b border-black mb-3 pb-1 uppercase">B. Pilihan Sekolah</h3>
                    <table className="w-full text-sm">
                        <tbody>
                            {schoolChoices.map((school, idx) => (
                                <tr key={idx}>
                                    <td className="py-1.5 w-48 font-bold align-top">Pilihan {idx + 1}</td>
                                    <td className="py-1.5 align-top uppercase">: {school} {idx === 0 ? '(Pilihan Wajib)' : ''}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Data Orang Tua */}
                <div className="mb-6">
                    <h3 className="text-md font-bold border-b border-black mb-3 pb-1 uppercase">C. Data Orang Tua / Wali</h3>
                    <table className="w-full text-sm">
                        <tbody>
                            <tr>
                                <td className="py-1.5 w-48 font-bold align-top">Nomor KK</td>
                                <td className="py-1.5 align-top">: {formData.kkNumber}</td>
                            </tr>
                            <tr>
                                <td className="py-1.5 w-48 font-bold align-top">Nama Ayah</td>
                                <td className="py-1.5 align-top">: {formData.fatherName}</td>
                            </tr>
                            <tr>
                                <td className="py-1.5 w-48 font-bold align-top">Nama Ibu</td>
                                <td className="py-1.5 align-top">: {formData.motherName}</td>
                            </tr>
                            <tr>
                                <td className="py-1.5 w-48 font-bold align-top">No. WhatsApp</td>
                                <td className="py-1.5 align-top">: {formData.parentPhone}</td>
                            </tr>
                             <tr>
                                <td className="py-1.5 w-48 font-bold align-top">Alamat Rumah</td>
                                <td className="py-1.5 align-top">: {formData.address}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Catatan Box */}
                <div className="border border-black p-3 mb-8 text-sm">
                    <p className="font-bold mb-1">Catatan Penting:</p>
                    <ul className="list-disc pl-5 space-y-0.5 text-xs">
                        <li>Simpan bukti pendaftaran ini sebagai syarat daftar ulang.</li>
                        <li>Silakan pantau hasil seleksi melalui menu <strong>PENGUMUMAN</strong> di website sekolah.</li>
                    </ul>
                </div>

                {/* Tanda Tangan */}
                <div className="flex justify-end mt-4">
                    <div className="text-center w-64">
                        <p className="mb-16">Kediri, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                        <p className="font-bold border-b border-black inline-block min-w-[200px] mb-1">Panitia PPDB</p>
                        <p className="text-xs">SDN Tempurejo 1</p>
                    </div>
                </div>
                
                {/* Footer timestamp */}
                <div className="absolute bottom-[20mm] left-[20mm] text-[10px] text-gray-400 italic">
                    Dicetak pada: {new Date().toLocaleString('id-ID')}
                </div>
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
        <p className="text-gray-500 text-xs mb-4 ml-1">Silakan lengkapi data di setiap bagian berikut:</p>

        <form onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6 flex items-start gap-3 border border-red-100 text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>{error}</div>
              </div>
            )}

            {/* SECTION 1: DATA SISWA */}
            <AccordionSection 
                id={1} 
                title="Data Calon Siswa" 
                icon={User} 
                isCompleted={maxStep > 1}
                currentStep={step}
                maxStep={maxStep}
                onStepChange={setStep}
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nama Lengkap (Sesuai Akte)</label>
                        <input required type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-school-500 focus:outline-none transition-all" placeholder="Contoh: Ahmad Dahlan" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">NIK Siswa (16 Digit)</label>
                        <input required type="number" name="nik" value={formData.nik} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-school-500 focus:outline-none transition-all" placeholder="3571xxxxxxxx" />
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
                    <button type="button" onClick={() => handleNextStep(2)} className="w-full bg-school-600 text-white py-3.5 rounded-xl font-bold hover:bg-school-700 transition-colors shadow-lg shadow-school-200 mt-4 flex justify-center items-center gap-2">
                        Lanjut Data Ortu <ChevronDown className="w-4 h-4" />
                    </button>
                </div>
            </AccordionSection>

            {/* SECTION 2: DATA ORANG TUA */}
            <AccordionSection 
                id={2} 
                title="Data Orang Tua & Kontak" 
                icon={Users} 
                isCompleted={maxStep > 2}
                currentStep={step}
                maxStep={maxStep}
                onStepChange={setStep}
            >
                <div className="space-y-4">
                    {/* Nomor KK */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nomor Kartu Keluarga (KK)</label>
                        <input required type="number" name="kkNumber" value={formData.kkNumber} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-school-500 focus:outline-none transition-all" placeholder="16 Digit Nomor KK" />
                    </div>

                    {/* Data Ayah */}
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-4">
                        <h3 className="font-bold text-sm text-gray-800 border-b border-gray-300 pb-2">Data Ayah Kandung</h3>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nama Ayah</label>
                            <input required type="text" name="fatherName" value={formData.fatherName} onChange={handleInputChange} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-school-500 focus:outline-none" placeholder="Sesuai KK" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">NIK Ayah</label>
                            <input required type="number" name="fatherNik" value={formData.fatherNik} onChange={handleInputChange} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-school-500 focus:outline-none" placeholder="16 Digit NIK Ayah" />
                        </div>
                    </div>

                    {/* Data Ibu */}
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-4">
                        <h3 className="font-bold text-sm text-gray-800 border-b border-gray-300 pb-2">Data Ibu Kandung</h3>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nama Ibu</label>
                            <input required type="text" name="motherName" value={formData.motherName} onChange={handleInputChange} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-school-500 focus:outline-none" placeholder="Sesuai KK" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">NIK Ibu</label>
                            <input required type="number" name="motherNik" value={formData.motherNik} onChange={handleInputChange} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-school-500 focus:outline-none" placeholder="16 Digit NIK Ibu" />
                        </div>
                    </div>
                    
                    <hr className="border-gray-100" />

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">No. WhatsApp Aktif</label>
                        <input required type="tel" name="parentPhone" value={formData.parentPhone} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-school-500 focus:outline-none transition-all" placeholder="08xxxxxxxxxx" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Alamat Lengkap (Domisili)</label>
                        <textarea required name="address" value={formData.address} onChange={handleInputChange} rows={3} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-school-500 focus:outline-none transition-all" placeholder="Jalan, RT/RW, Kelurahan, Kecamatan" />
                    </div>

                    <button type="button" onClick={() => handleNextStep(3)} className="w-full bg-school-600 text-white py-3.5 rounded-xl font-bold hover:bg-school-700 transition-colors shadow-lg shadow-school-200 mt-4 flex justify-center items-center gap-2">
                        Lanjut Upload Dokumen <ChevronDown className="w-4 h-4" />
                    </button>
                </div>
            </AccordionSection>

            {/* SECTION 3: UPLOAD DOKUMEN */}
            <AccordionSection 
                id={3} 
                title="Upload Dokumen" 
                icon={Upload} 
                isCompleted={maxStep > 3}
                currentStep={step}
                maxStep={maxStep}
                onStepChange={setStep}
            >
                 <div className="space-y-6">
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
                    
                    <button type="button" onClick={() => handleNextStep(4)} className="w-full bg-school-600 text-white py-3.5 rounded-xl font-bold hover:bg-school-700 transition-colors shadow-lg shadow-school-200 mt-4 flex justify-center items-center gap-2">
                        Lanjut Pilih Sekolah <ChevronDown className="w-4 h-4" />
                    </button>
                 </div>
            </AccordionSection>

            {/* SECTION 4: PILIHAN SEKOLAH (NEW) */}
            <AccordionSection 
                id={4} 
                title="Pilihan Sekolah" 
                icon={School} 
                isCompleted={maxStep > 4}
                currentStep={step}
                maxStep={maxStep}
                onStepChange={setStep}
            >
                <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-100 p-3 rounded-xl text-blue-800 text-xs mb-2">
                        <p className="font-bold mb-1">Ketentuan Pilihan:</p>
                        <ul className="list-disc pl-4 space-y-0.5">
                            <li>Pilihan 1 Wajib: UPTD SDN Tempurejo 1.</li>
                            <li>Anda dapat menambahkan maksimal 4 sekolah lain sebagai cadangan.</li>
                            <li>Sekolah terdekat diprioritaskan.</li>
                        </ul>
                    </div>

                    {/* List Sekolah Terpilih */}
                    <div className="space-y-3">
                        {schoolChoices.map((school, index) => (
                            <div key={index} className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
                                <div className="w-8 h-8 rounded-full bg-school-100 text-school-700 flex items-center justify-center font-bold text-sm">
                                    {index + 1}
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-gray-800 text-sm">{school}</p>
                                    {index === 0 && <span className="text-[10px] text-green-600 font-bold uppercase bg-green-50 px-2 py-0.5 rounded">Pilihan Utama</span>}
                                </div>
                                {index !== 0 && (
                                    <button 
                                        type="button" 
                                        onClick={() => removeSchoolChoice(index)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                                {index === 0 && <div className="w-8"></div>} {/* Spacer for locked item */}
                            </div>
                        ))}
                    </div>

                    {/* Tambah Pilihan Sekolah */}
                    {schoolChoices.length < 5 && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Tambah Pilihan Sekolah Lain (Opsional)</label>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <select 
                                        value={selectedNearbySchool}
                                        onChange={(e) => setSelectedNearbySchool(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-school-500 focus:outline-none appearance-none text-sm"
                                    >
                                        <option value="">-- Pilih Sekolah Terdekat --</option>
                                        {NEARBY_SCHOOLS.filter(s => !schoolChoices.includes(s)).map((school) => (
                                            <option key={school} value={school}>{school}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                </div>
                                <button 
                                    type="button" 
                                    onClick={addSchoolChoice}
                                    disabled={!selectedNearbySchool}
                                    className="bg-school-600 text-white px-4 rounded-xl hover:bg-school-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}

                    <button type="button" onClick={() => handleNextStep(5)} className="w-full bg-school-600 text-white py-3.5 rounded-xl font-bold hover:bg-school-700 transition-colors shadow-lg shadow-school-200 mt-4 flex justify-center items-center gap-2">
                        Review & Kirim <ChevronDown className="w-4 h-4" />
                    </button>
                </div>
            </AccordionSection>

            {/* SECTION 5: KONFIRMASI */}
            <AccordionSection 
                id={5} 
                title="Konfirmasi Pendaftaran" 
                icon={FileText} 
                isCompleted={false}
                currentStep={step}
                maxStep={maxStep}
                onStepChange={setStep}
            >
                <div className="space-y-6">
                    <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-xl text-yellow-800 text-xs flex gap-3">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p>Mohon periksa kembali data di bawah ini. Pastikan data sudah benar sebelum dikirim.</p>
                    </div>

                    <div className="space-y-4">
                        {/* Review Data Diri */}
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                            <div className="flex justify-between items-center mb-3 border-b border-gray-200 pb-2">
                                <h3 className="font-bold text-gray-800 flex items-center gap-2 text-sm">
                                    <User className="w-4 h-4 text-school-600" />
                                    Calon Siswa
                                </h3>
                                <button type="button" onClick={() => setStep(1)} className="text-blue-600 p-1"><Edit3 className="w-4 h-4" /></button>
                            </div>
                            <div className="grid grid-cols-1 gap-y-2 text-sm">
                                <div><span className="text-gray-500 text-xs block">Nama</span> <span className="font-medium text-gray-800">{formData.fullName}</span></div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div><span className="text-gray-500 text-xs block">NIK</span> <span className="font-medium text-gray-800">{formData.nik}</span></div>
                                    <div><span className="text-gray-500 text-xs block">JK</span> <span className="font-medium text-gray-800">{formData.gender}</span></div>
                                </div>
                            </div>
                        </div>

                         {/* Review Pilihan Sekolah */}
                         <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                            <div className="flex justify-between items-center mb-3 border-b border-gray-200 pb-2">
                                <h3 className="font-bold text-gray-800 flex items-center gap-2 text-sm">
                                    <School className="w-4 h-4 text-school-600" />
                                    Pilihan Sekolah
                                </h3>
                                <button type="button" onClick={() => setStep(4)} className="text-blue-600 p-1"><Edit3 className="w-4 h-4" /></button>
                            </div>
                            <div className="text-sm space-y-1">
                                {schoolChoices.map((school, i) => (
                                    <div key={i} className="flex gap-2">
                                        <span className="text-gray-500 w-4 font-mono">{i+1}.</span>
                                        <span className={`font-medium ${i===0 ? 'text-school-700' : 'text-gray-800'}`}>{school}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Review Data Ortu */}
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                            <div className="flex justify-between items-center mb-3 border-b border-gray-200 pb-2">
                                <h3 className="font-bold text-gray-800 flex items-center gap-2 text-sm">
                                    <Users className="w-4 h-4 text-school-600" />
                                    Orang Tua
                                </h3>
                                <button type="button" onClick={() => setStep(2)} className="text-blue-600 p-1"><Edit3 className="w-4 h-4" /></button>
                            </div>
                            <div className="text-sm space-y-2">
                                <div><span className="text-gray-500 text-xs block">Ayah</span> <span className="font-medium text-gray-800">{formData.fatherName}</span></div>
                                <div><span className="text-gray-500 text-xs block">Ibu</span> <span className="font-medium text-gray-800">{formData.motherName}</span></div>
                                <div><span className="text-gray-500 text-xs block">Kontak</span> <span className="font-medium text-gray-800">{formData.parentPhone}</span></div>
                            </div>
                        </div>
                    </div>

                    <button type="submit" disabled={isLoading} className="w-full bg-accent-500 text-white py-4 rounded-xl font-bold hover:bg-accent-600 transition-colors shadow-lg shadow-accent-200 flex items-center justify-center gap-2 disabled:opacity-50">
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                        {isLoading ? 'Mengirim Data...' : 'Kirim Pendaftaran Sekarang'}
                    </button>
                </div>
            </AccordionSection>

        </form>
      </div>
    </div>
  );
};