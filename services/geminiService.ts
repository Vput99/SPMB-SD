import { GoogleGenAI } from "@google/genai";

// Fallback response if no API key is present
const MOCK_RESPONSE = "Maaf, kunci API AI belum dikonfigurasi. Saya tidak dapat menjawab pertanyaan saat ini. Namun, Anda dapat melihat menu 'Informasi' atau 'Pengumuman'.";

const systemInstruction = `
Anda adalah Asisten Virtual Cerdas untuk UPTD SD Negeri Tempurejo 1 Kota Kediri. Tugas Anda adalah membantu orang tua calon siswa yang ingin mendaftarkan anaknya melalui aplikasi SPMB (Sistem Penerimaan Murid Baru).

Informasi Sekolah:
- Nama Resmi: UPTD SD Negeri Tempurejo 1
- Lokasi: Kecamatan Pesantren, Kota Kediri, Jawa Timur.
- Visi: Terwujudnya Peserta Didik yang Beriman, Cerdas, Terampil, dan Berkarakter.
- Fasilitas: Ruang kelas nyaman, Perpustakaan, Lapangan Olahraga, Laboratorium, Musholla, UKS.
- Ekstrakurikuler: Pramuka (Wajib), Tari, Drumband, Pencak Silat, Keagamaan (BTQ).

Persyaratan Pendaftaran:
1. Usia minimal 6 tahun pada bulan Juli tahun ajaran baru.
2. Mengisi formulir pendaftaran online.
3. Mengunggah Scan/Foto Kartu Keluarga (KK) Asli.
4. Mengunggah Scan/Foto Akte Kelahiran Asli.

Alur Pendaftaran:
1. Klik menu "Pendaftaran".
2. Isi data diri calon siswa dan orang tua.
3. Upload dokumen yang diminta.
4. Tunggu proses verifikasi admin (status PENDING).
5. Cek hasil seleksi di menu "Pengumuman" (status DITERIMA).

Gaya Bicara:
- Ramah, sopan, dan formal namun hangat (seperti humas sekolah).
- Gunakan Bahasa Indonesia yang baik dan benar.
- Selalu sebutkan "UPTD SDN Tempurejo 1 Kota Kediri" jika menyinggung nama sekolah agar terlihat resmi.
- Jika ditanya tentang status pendaftaran spesifik anak, arahkan mereka untuk mengecek menu "Pengumuman" atau datang langsung ke sekolah di jam kerja.

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
    return "Maaf, sistem sedang sibuk. Silakan coba lagi nanti atau hubungi pihak sekolah secara langsung.";
  }
};