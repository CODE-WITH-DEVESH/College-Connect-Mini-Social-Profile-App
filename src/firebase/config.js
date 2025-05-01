import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAoH2Xq4SWbytv5gBnSATLa8YCkf_QuyXI",
  authDomain: "college-connect-5b636.firebaseapp.com",
  projectId: "college-connect-5b636",
  storageBucket: "college-connect-5b636.appspot.com",
  messagingSenderId: "737291202419",
  appId: "1:737291202419:web:4fa11ed12551c0df229f06",
  measurementId: "G-DJLHRW1NS9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize Storage with custom settings
const storage = getStorage(app);
export { storage };

export default app; 