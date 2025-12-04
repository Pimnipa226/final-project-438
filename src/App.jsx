import React from 'react';
import { useState, useEffect } from 'react'
import './App.css'
import {Route, Routes, useNavigate} from "react-router-dom";
import Home from './pages/homepage/Home.jsx';
import Login from './pages/loginpage/LogIn.jsx';
import Profile from './pages/profilepage/Profile.jsx';
import SignUp from "./pages/sign_up/SignUp.jsx";
//import Auth from "../../services/Auth.jsx";
import { auth }   from "./services/firebase.js";
import { onAuthStateChanged } from "firebase/auth";
import NavBar from "./components/navbar/NavBar.jsx";


function App() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unSubscribe();
    }, [navigate]);

    return (

        <div>
            <NavBar user={user} />
                <Routes>
                    <Route path="/sign-up" element={<SignUp />} />
                    <Route path="/log-in" element={<Login />} />
                    <Route path="/" element={user ? <Home user={user}/> : <Login />}  />
                    <Route path="/profile" element={user ? <Profile user={user}/> : <Login />} />
                </Routes>
        </div>
    );
}

export default App;
