import { StudentRegistration, RegistrationStatus } from '../types';
import { db, isConfigured } from './firebase';
import { collection, addDoc, getDocs, updateDoc, doc, query, orderBy, setDoc, getDoc } from "firebase/firestore";

const COLLECTION_NAME = 'students';
const SETTINGS_COLLECTION = 'settings';
const SCHOOL_DOC_ID = 'school_config';

// Helper untuk mengecek konfigurasi sebelum melakukan operasi
const checkConfig = () => {
  if (!isConfigured || !db) {
    throw new Error(
      "Firebase belum dikonfigurasi! Mohon buka file 'services/firebase.ts' dan isi dengan konfigurasi Project Firebase Anda."
    );
  }
};

export const StorageService = {
  // Mengambil data siswa dari Firestore
  getStudents: async (): Promise<StudentRegistration[]> => {
    try {
      checkConfig();
      // Mengambil data urut berdasarkan tanggal pendaftaran terbaru
      const q = query(collection(db, COLLECTION_NAME), orderBy("registrationDate", "desc"));
      const querySnapshot = await getDocs(q);
      
      const students: StudentRegistration[] = [];
      querySnapshot.forEach((doc) => {
        students.push({ id: doc.id, ...doc.data() } as StudentRegistration);
      });
      
      return students;
    } catch (error: any) {
      console.error("Error getting documents: ", error);
      if (error.message.includes("Firebase belum dikonfigurasi")) {
        return [];
      }
      throw error;
    }
  },

  // Simpan data ke Firestore (Gambar disimpan sebagai Base64 string)
  addStudent: async (student: Omit<StudentRegistration, 'id' | 'status' | 'registrationDate'>): Promise<StudentRegistration> => {
    checkConfig();
    
    const registrationDate = new Date().toISOString();

    try {
      // Kita langsung menyimpan string base64 gambar ke dalam dokumen.
      // Catatan: Gambar sudah dikompresi di frontend (Registration.tsx) agar ukurannya kecil.
      // Firestore memiliki batas 1MB per dokumen.
      
      const newStudentData = {
        ...student,
        // Pastikan kita menyimpan string base64 yang diterima dari form
        kkImage: student.kkImage, 
        akteImage: student.akteImage,
        status: RegistrationStatus.PENDING,
        registrationDate: registrationDate
      };

      const docRef = await addDoc(collection(db, COLLECTION_NAME), newStudentData);

      return {
        id: docRef.id,
        ...newStudentData
      } as StudentRegistration;

    } catch (error) {
      console.error("Error adding student: ", error);
      throw new Error("Gagal menyimpan data. Pastikan koneksi internet lancar.");
    }
  },

  // Update status di Firestore
  updateStatus: async (id: string, status: RegistrationStatus): Promise<void> => {
    checkConfig();
    try {
      const studentRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(studentRef, {
        status: status
      });
    } catch (error) {
      console.error("Error updating status: ", error);
      throw error;
    }
  },

  // Mengambil Logo Sekolah
  getSchoolLogo: async (): Promise<string | null> => {
    try {
        if (!isConfigured) return null;
        const docRef = doc(db, SETTINGS_COLLECTION, SCHOOL_DOC_ID);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            return docSnap.data().logoUrl;
        }
        return null;
    } catch (error) {
        console.error("Error getting logo:", error);
        return null;
    }
  },

  // Menyimpan Logo Sekolah
  saveSchoolLogo: async (base64Image: string): Promise<void> => {
      checkConfig();
      try {
          const docRef = doc(db, SETTINGS_COLLECTION, SCHOOL_DOC_ID);
          await setDoc(docRef, { logoUrl: base64Image }, { merge: true });
      } catch (error: any) {
          console.error("Error saving logo:", error);
          throw new Error(error.message || "Gagal menyimpan logo.");
      }
  },

  clearData: async () => {
    alert("Fitur 'Reset Data' dinonaktifkan saat menggunakan Firebase untuk keamanan data.");
  }
};