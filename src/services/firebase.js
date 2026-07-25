import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBL-YQ8YmeSQuGTehWRUIwiPxy0oQprAII",              // ← changed
    authDomain: "goalify-ea70e.firebaseapp.com",                     // ← changed
    projectId: "goalify-ea70e",                                      // ← changed
    storageBucket: "goalify-ea70e.firebasestorage.app",              // ← changed
    messagingSenderId: "8816315204",                                 // ← changed
    appId: "1:8816315204:web:bff87901994e10e87ea511",                // ← changed
    measurementId: "G-5BV87D59SD"                                    // ← changed
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };