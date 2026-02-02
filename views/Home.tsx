import React from 'react';
import { Calendar, CheckCircle, Upload, Users } from 'lucide-react';

interface HomeProps {
  onNavigate: (page: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <section className="relative bg-school-600 text-white py-20 rounded-b-[3rem] shadow-xl overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/school-supplies.png')]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6">
            Selamat Datang di<br/>SD Negeri Tempurejo 1
          </h1>
          <p className="text-xl md:text-2xl text-school-100 mb-8 max-w-2xl mx-auto font-light">
            Membangun Generasi Cerdas, Berkarakter, dan Berakhlak Mulia. Penerimaan Peserta Didik Baru Tahun Ajaran 2024/2025 Telah Dibuka!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => onNavigate('register')}
              className="bg-accent-500 text-white px-8 py-3 rounded-full font-bold text-lg shadow-lg hover:bg-accent-600 transform transition hover:-translate-y-1"
            >
              Daftar Sekarang
            </button>
            <button 
              onClick={() => onNavigate('announcement')}
              className="bg-white/10 backdrop-blur-sm border-2 border-white/50 text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-white/20 transition-colors"
            >
              Cek Pengumuman
            </button>
          </div>
        </div>
      </section>

      {/* Info Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-heading font-bold text-school-900 text-center mb-10">Alur Pendaftaran</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <Users className="w-10 h-10 text-school-500" />,
              title: "1. Isi Data Diri",
              desc: "Lengkapi formulir data diri calon siswa dan data orang tua dengan benar."
            },
            {
              icon: <Upload className="w-10 h-10 text-school-500" />,
              title: "2. Upload Dokumen",
              desc: "Unggah foto Kartu Keluarga (KK) dan Akte Kelahiran asli yang jelas."
            },
            {
              icon: <CheckCircle className="w-10 h-10 text-school-500" />,
              title: "3. Verifikasi & Pengumuman",
              desc: "Data akan diverifikasi oleh panitia. Cek hasil seleksi di menu Pengumuman."
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-8 rounded-2xl shadow-md border-b-4 border-school-500 hover:shadow-lg transition-shadow">
              <div className="bg-school-50 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats/Features */}
      <section className="bg-school-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <img 
                src="https://picsum.photos/800/600" 
                alt="Kegiatan Sekolah" 
                className="rounded-2xl shadow-xl w-full object-cover h-64 md:h-96"
              />
            </div>
            <div className="flex-1 space-y-6">
              <h2 className="text-3xl font-heading font-bold text-school-900">Kenapa Memilih Kami?</h2>
              <ul className="space-y-4">
                {[
                  "Terakreditasi A",
                  "Guru Profesional & Berpengalaman",
                  "Ekstrakurikuler Lengkap (Pramuka, Drumband, Tari)",
                  "Lingkungan Asri dan Kondusif",
                  "Program Pembiasaan Karakter Religius"
                ].map((point, i) => (
                  <li key={i} className="flex items-center gap-3 text-lg text-gray-700">
                    <div className="w-2 h-2 rounded-full bg-accent-500"></div>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Schedule */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-gradient-to-r from-school-600 to-school-700 rounded-3xl p-8 md:p-12 text-white shadow-2xl">
          <div className="inline-flex items-center justify-center p-3 bg-white/20 rounded-full mb-6">
            <Calendar className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Jadwal PPDB</h2>
          <div className="grid md:grid-cols-2 gap-6 text-left mt-8">
            <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
              <h4 className="font-bold text-accent-500 mb-1">Pendaftaran Online</h4>
              <p>1 Mei - 30 Juni 2024</p>
            </div>
            <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
              <h4 className="font-bold text-accent-500 mb-1">Verifikasi Berkas</h4>
              <p>1 Juli - 5 Juli 2024</p>
            </div>
            <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
              <h4 className="font-bold text-accent-500 mb-1">Pengumuman</h4>
              <p>7 Juli 2024</p>
            </div>
            <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
              <h4 className="font-bold text-accent-500 mb-1">Daftar Ulang</h4>
              <p>8 Juli - 10 Juli 2024</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};