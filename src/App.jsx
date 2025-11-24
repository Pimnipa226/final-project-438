import React from 'react';
//import { useState } from 'react';
import './App.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
//import NavBar from './components/navbar/NavBar.jsx';
import Home from './pages/homepage/Home.jsx';
import Login from './pages/loginpage/LogIn.jsx';
//import Profile from './pages/profilepage/Profile.jsx';
//import ChatBot from './components/chatbot/ChatBot.jsx';


function App() {
    return (
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/homepage" element={<Home />} />
            </Routes>
    );
}

export default App;
