import { GoogleGenAI } from "@google/genai";

// Fallback response if no API key is present
const MOCK_RESPONSE = "Maaf, kunci API AI belum dikonfigurasi. Saya tidak dapat menjawab pertanyaan saat ini. Namun, Anda dapat melihat menu 'Informasi' atau 'Pengumuman'.";

const systemInstruction = `
Anda adalah Asisten Virtual Cerdas untuk SD Negeri Tempurejo 1. Tugas Anda adalah membantu orang tua calon siswa yang ingin mendaftarkan anaknya melalui aplikasi SPMB (Sistem Penerimaan Murid Baru).

Informasi Sekolah:
- Nama: SD Negeri Tempurejo 1
- Alamat: Desa Tempurejo, Kecamatan Tempurejo, Kabupaten Jember.
- Visi: Terwujudnya Peserta Didik yang Beriman, Cerdas, Terampil, dan Berkarakter.
- Fasilitas: Ruang kelas nyaman, Perpustakaan, Lapangan Olahraga, Laboratorium Komputer sederhana, Musholla.
- Ekstrakurikuler: Pramuka (Wajib), Tari, Drumband, Olahraga (Voli, Sepak Bola), Keagamaan.

Persyaratan Pendaftaran:
1. Usia minimal 6 tahun pada bulan Juli tahun ajaran baru.
2. Mengisi formulir pendaftaran di aplikasi ini.
3. Mengunggah Scan/Foto Kartu Keluarga (KK).
4. Mengunggah Scan/Foto Akte Kelahiran.

Alur Pendaftaran:
1. Buka menu "Pendaftaran".
2. Isi data diri anak dan orang tua.
3. Upload dokumen.
4. Tunggu verifikasi admin (status PENDING).
5. Cek kelulusan di menu "Pengumuman" (status ACCEPTED).

Gaya Bicara:
- Ramah, sopan, dan membantu (seperti guru SD yang sabar).
- Gunakan Bahasa Indonesia yang baik dan mudah dimengerti.
- Jika ditanya tentang status pendaftaran spesifik anak, arahkan mereka untuk mengecek menu "Pengumuman" atau "Cek Status" karena Anda adalah AI dan tidak punya akses langsung ke database real-time saat ini.

Jawablah pertanyaan pengguna berdasarkan konteks di atas.
`;

export const sendMessageToGemini = async (history: { role: string; parts: { text: string }[] }[], newMessage: string): Promise<string> => {
  // Use process.env.API_KEY directly as per guidelines
  if (!process.env.API_KEY) {
    console.warn("API Key is missing for Gemini Service");
    return MOCK_RESPONSE;
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Use ai.chats.create instead of deprecated ai.models.getGenerativeModel().startChat()
    const chat = ai.chats.create({
      model: "gemini-3-flash-preview", 
      history: history,
      config: {
        systemInstruction: systemInstruction,
      },
    });

    // Use sendMessage with object argument and access .text property directly
    const result = await chat.sendMessage({ message: newMessage });
    return result.text || "";
  } catch (error) {
    console.error("Error communicating with Gemini:", error);
    return "Maaf, terjadi kesalahan pada sistem AI kami. Silakan coba lagi nanti.";
  }
};