export enum RegistrationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED'
}

export interface StudentRegistration {
  id: string;
  fullName: string;
  nik: string;
  birthPlace: string;
  birthDate: string;
  gender: 'Laki-laki' | 'Perempuan';
  address: string;
  parentName: string;
  parentPhone: string;
  kkImage: string | null; // Base64 string for demo storage
  akteImage: string | null; // Base64 string for demo storage
  status: RegistrationStatus;
  registrationDate: string;
}

export interface AnnouncementProps {
  students: StudentRegistration[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}