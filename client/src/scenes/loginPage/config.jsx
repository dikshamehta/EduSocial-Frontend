import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDiIXq0oxIy5nQ7W8yuYc5yPmSVkCHWGG4",
  authDomain: "edusocial-11ccd.firebaseapp.com",
  projectId: "edusocial-11ccd",
  storageBucket: "edusocial-11ccd.appspot.com",
  messagingSenderId: "524521458522",
  appId: "1:524521458522:web:a3bb343db0b59139590163",
  measurementId: "G-0C3B2S8MJT",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { auth, provider };
