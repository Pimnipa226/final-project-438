import React from 'react';
import './App.css'
import {Route, Routes, Router} from "react-router-dom";
import Home from './pages/homepage/Home.jsx';
import Login from './pages/loginpage/LogIn.jsx';
import Profile from './pages/profilepage/Profile.jsx';
import SignUp from "./pages/sign_up/SignUp.jsx";


function App() {
    return (
        // <Router><div className="app">
        //     <Navbar />
        //     <main className="main-content">
                <Routes>
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/" element={<Login />} />
                    <Route path="/homepage" element={<Home />} />
                    <Route path="/profile" element={<Profile />} />
                </Routes>
        // </div>
        // </Router>
    );
}

export default App;
