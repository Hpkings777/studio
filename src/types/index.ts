import type { Timestamp } from "firebase/firestore";

export interface BirthdayData {
  id: string;
  name: string;
  age: number;
  message: string;
  photoDataUri: string;
  dateOfBirth: string; // Stored as ISO string in app, but Timestamp in Firestore
  birthdayDate: string; // Stored as ISO string in app, but Timestamp in Firestore
  template: 'Modern' | 'Classic' | 'Funky';
  musicUrl: string;
}

export interface Memory {
    id: string;
    author: string;
    message: string;
    timestamp: string; // ISO string
}

export interface MemoryData {
    author: string;
    message: string;
    timestamp: Timestamp;
}

export interface LayoutConfig {
  header: {
    element: string;
    position: string;
    size: string;
  };
  photo: {
    element: string;
    position: string;
    size: string;
  };
  message: {
    element: string;
    position: string;
    size: string;
  };
  countdown: {
    element: string;
    position: string;
    size: string;
  };
  [key: string]: {
    element: string;
    position: string;
    size: string;
  };
}
