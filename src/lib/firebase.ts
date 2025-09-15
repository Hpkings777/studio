
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "birthday-bliss-xw3le",
  appId: "1:1035181862524:web:555e926b5966db98ffa3f9",
  storageBucket: "birthday-bliss-xw3le.firebasestorage.app",
  apiKey: "AIzaSyBQBWPgCNLqzmBzT37v1FcQ6eJ1fEVno04",
  authDomain: "birthday-bliss-xw3le.firebaseapp.com",
  measurementId: "",
  messagingSenderId: "1035181862524"
};

function getDb() {
    const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    return getFirestore(app);
}


export { getDb };
