
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyBMIZZmHLlSJyTQP_hvCCfp2dIaIxCgVyw",
  authDomain: "app-334.firebaseapp.com",
  projectId: "app-334",
  storageBucket: "app-334.firebasestorage.app",
  messagingSenderId: "512446977355",
  appId: "1:512446977355:web:4769f6cf58c46b8b2c44ce",
  databaseURL: "https://app-334-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const database = getDatabase(app);

export default app;
