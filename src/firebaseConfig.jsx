// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDhB915KXjXc4zG-vOxrRXbmXanzro4jkE",
  authDomain: "fanasty-faceoff.firebaseapp.com",
  projectId: "fanasty-faceoff",
  storageBucket: "fanasty-faceoff.firebasestorage.app",
  messagingSenderId: "1053527790144",
  appId: "1:1053527790144:web:ff5f388d4f5f34e355c5a5"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)