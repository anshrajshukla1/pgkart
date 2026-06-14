import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAPAXKoH-4MCp4cU4O-AsQJLBDg6V9flkg",
  authDomain: "pgkart-c539c.firebaseapp.com",
  projectId: "pgkart-c539c",
  storageBucket: "pgkart-c539c.firebasestorage.app",
  messagingSenderId: "915687704203",
  appId: "1:915687704203:web:78f7d6e8922a3bc7d9368e",
  measurementId: "G-0KN0WBY858"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
