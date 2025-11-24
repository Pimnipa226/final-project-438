import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyB3iQLT-hQ7Fw8DgCyxo65ZISA7DjyZANY",
    authDomain: "goalify-e2043.firebaseapp.com",
    projectId: "goalify-e2043",
    storageBucket: "goalify-e2043.firebasestorage.app",
    messagingSenderId: "1003307506744",
    appId: "1:1003307506744:web:d861603315e535496f5acd",
    measurementId: "G-PRENFQQMVJ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };