
import { initializeApp, getApps, getApp, type FirebaseOptions } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig: FirebaseOptions = {
  projectId: "birthday-bliss-xw3le",
  appId: "1:1035181862524:web:555e926b5966db98ffa3f9",
  storageBucket: "birthday-bliss-xw3le.appspot.com",
  apiKey: "AIzaSyBQBWPgCNLqzmBzT37v1FcQ6eJ1fEVno04",
  authDomain: "birthday-bliss-xw3le.firebaseapp.com",
  messagingSenderId: "1035181862524"
};

function getDb() {
    const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    return getFirestore(app);
}


export { getDb };
