export interface BirthdayData {
  id: string;
  name: string;
  age: number;
  message: string;
  photoDataUri: string;
  birthdayDate: string; // Stored as ISO string in localStorage
  template: 'Modern' | 'Classic' | 'Funky';
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
