import React from 'react';
import { Calendar, CheckCircle, Upload, Users, ChevronRight, FileText, Bell, Lock, Leaf, Sprout, MapPin, Trophy, Home as HomeIcon } from 'lucide-react';

interface HomeProps {
  onNavigate: (page: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  // Pastikan Anda menyimpan gambar poster dengan nama 'background.jpg' di folder public
  // Fallback ke gambar sekolah jika file tidak ditemukan
  const bgImage = "/background.jpg"; 
  const fallbackBg = "https://images.unsplash.com/photo-1588072432836-e10032774350?q=80&w=2072&auto=format&fit=crop";

  return (
    <div className="min-h-screen pb-10 relative overflow-hidden font-sans">
      
      {/* Background Image Fixed */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ 
            backgroundImage: `url('${bgImage}'), url('${fallbackBg}')`,
            backgroundPosition: 'center top' 
        }}
      >
        {/* Gradient Overlay untuk keterbacaan (Adiwiyata Theme) */}
        {/* Menggunakan overlay hijau gelap agar teks putih terbaca, namun gambar tetap terlihat */}
        <div className="absolute inset-0 bg-gradient-to-b from-school-900/90 via-school-800/80 to-school-600/90"></div>
      </div>

      {/* Content Wrapper */}
      <div className="relative z-10">
        
        {/* External Home Button */}
        <div className="absolute top-4 left-4 z-50">
            <a 
                href="https://sdntempurejo1kotakediri.my.id/beranda" 
                className="flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg hover:bg-white/30 hover:scale-105 transition-all group"
            >
                <div className="bg-white/20 p-1 rounded-full group-hover:bg-white/30 transition-colors">
                  <HomeIcon className="w-4 h-4" />
                </div>
                <span>Website Sekolah</span>
            </a>
        </div>

        {/* Hero Section */}
        <section className="text-white pt-16 px-6 pb-4">
            <div className="max-w-md mx-auto text-center">
                {/* Logo Wrapper with Glass Effect */}
                <div className="mx-auto bg-white/20 backdrop-blur-md p-3 rounded-full w-24 h-24 flex items-center justify-center shadow-xl mb-4 border-2 border-white/30 animate-float">
                    <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/b/b5/Tut_Wuri_Handayani.svg" 
                    alt="Logo Tut Wuri Handayani" 
                    className="w-16 h-16 drop-shadow-md"
                    />
                </div>

                <div className="inline-flex items-center gap-1 bg-school-900/50 px-3 py-1 rounded-full backdrop-blur-md mb-4 border border-white/20 shadow-sm">
                    <Leaf className="w-3 h-3 text-accent-500" />
                    <span className="text-accent-100 font-bold tracking-wider text-[10px] uppercase">Sekolah Adiwiyata</span>
                </div>

                {/* Judul Besar Sesuai Poster */}
                <h1 className="text-5xl font-black uppercase leading-none mb-2 drop-shadow-[0_4px_4px_rgba(0,0,0,0.3)] text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-200 tracking-tight">
                    SPMB
                </h1>
                <h2 className="text-lg font-bold uppercase tracking-widest mb-1 text-accent-400 drop-shadow-sm">
                    SDN Tempurejo 1
                </h2>
                <p className="text-white/90 text-sm font-medium px-4 leading-relaxed mb-8 max-w-xs mx-auto">
                    Tahun Ajaran 2026/2027
                </p>

                {/* Main Menu Grid */}
                <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                    <button 
                        onClick={() => onNavigate('register')}
                        className="bg-white/95 hover:bg-white text-school-900 p-5 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all flex flex-col items-center gap-3 group border-b-4 border-school-600 backdrop-blur-sm"
                    >
                        <div className="w-12 h-12 bg-school-100 text-school-600 rounded-full flex items-center justify-center group-hover:bg-school-600 group-hover:text-white transition-colors">
                            <FileText className="w-6 h-6" />
                        </div>
                        <span className="font-bold text-sm">Daftar Baru</span>
                    </button>

                    <button 
                        onClick={() => onNavigate('announcement')}
                        className="bg-white/95 hover:bg-white text-school-900 p-5 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all flex flex-col items-center gap-3 group border-b-4 border-accent-500 backdrop-blur-sm"
                    >
                        <div className="w-12 h-12 bg-accent-100 text-accent-600 rounded-full flex items-center justify-center group-hover:bg-accent-500 group-hover:text-white transition-colors">
                            <Bell className="w-6 h-6" />
                        </div>
                        <span className="font-bold text-sm">Pengumuman</span>
                    </button>

                     <button 
                        onClick={() => onNavigate('students')}
                        className="col-span-2 bg-white/95 hover:bg-white text-school-900 p-4 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all flex flex-row items-center justify-center gap-4 group border-b-4 border-blue-500 backdrop-blur-sm"
                    >
                        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors">
                            <Users className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-sm">Data Siswa Terverifikasi</span>
                    </button>
                </div>
            </div>
        </section>

        {/* Info Section Cards (Glassmorphism) */}
        <section className="max-w-md mx-auto px-6 mt-4 pb-20 space-y-5">
            
            {/* Fasilitas Preview (Based on Flyer) */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-5 border border-white/20 text-white">
                <h3 className="font-bold text-accent-400 mb-3 flex items-center gap-2 text-sm uppercase tracking-wide">
                    <Trophy className="w-4 h-4" />
                    Fasilitas Unggulan
                </h3>
                <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs font-medium">
                    <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-white"></span>Ruang Multimedia</div>
                    <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-white"></span>Gedung Aula</div>
                    <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-white"></span>Perpustakaan</div>
                    <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-white"></span>Mushola & Pendopo</div>
                </div>
            </div>

             {/* Ekstrakurikuler Preview */}
             <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-5 border border-white/20 text-white">
                <h3 className="font-bold text-accent-400 mb-3 flex items-center gap-2 text-sm uppercase tracking-wide">
                    <Sprout className="w-4 h-4" />
                    Ekstrakurikuler
                </h3>
                <div className="flex flex-wrap gap-2">
                    {['Pramuka', 'Karate', 'Tari', 'Voli', 'Qiro\'ah', 'Menggambar'].map((ekstra) => (
                        <span key={ekstra} className="px-2 py-1 rounded-md bg-white/20 text-[10px] font-medium border border-white/10">
                            {ekstra}
                        </span>
                    ))}
                </div>
            </div>

            {/* Alur Pendaftaran */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border-t-4 border-accent-500 relative overflow-hidden">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 relative z-10">
                    <Users className="w-5 h-5 text-school-600" />
                    Alur Pendaftaran
                </h3>
                <div className="space-y-5 relative z-10">
                    <div className="absolute left-3.5 top-2 bottom-2 w-0.5 bg-gray-100"></div>
                    {[
                        { title: "Isi Formulir", desc: "Siapkan KK & Akte" },
                        { title: "Verifikasi Admin", desc: "Data divalidasi sekolah" },
                        { title: "Pengumuman", desc: "Lihat hasil seleksi online" }
                    ].map((step, idx) => (
                        <div key={idx} className="relative flex gap-4 items-center">
                            <div className="w-8 h-8 rounded-full bg-school-600 text-white flex items-center justify-center text-xs font-bold shadow-md ring-4 ring-white z-10 flex-shrink-0">
                                {idx + 1}
                            </div>
                            <div>
                                <h4 className="font-bold text-sm text-gray-800 leading-tight">{step.title}</h4>
                                <p className="text-[10px] text-gray-500">{step.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
             <div className="mt-8 text-center pb-8">
                 <p className="text-[10px] text-white/80 font-medium drop-shadow-sm flex items-center justify-center gap-1">
                    <MapPin className="w-3 h-3 text-accent-400" />
                    Jl. Bagawanta Bhari No. 1, Kota Kediri
                 </p>
                 <p className="text-[10px] text-white/50 mt-1">
                    &copy; 2026 SDN Tempurejo 1
                 </p>
             </div>
        </section>
      </div>
    </div>
  );
};