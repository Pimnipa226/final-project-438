import React from 'react';
import { useAuth } from "../../contexts/AuthContext";
import { logoutUser } from "../../services/auth";
import { Link, useNavigate } from 'react-router-dom';
import './NavBar.css';

function NavBar () {
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logoutUser();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/">Goalify</Link>
            </div>
            <div className="navbar-menu">
                {currentUser ? (
                    <>
                        <Link to="/" className="navbar-item">Home</Link>
                        <Link to="/profile" className="navbar-item">Profile</Link>
                        <button onClick={handleLogout} className="navbar-button">Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="navbar-item">Login</Link>
                        <Link to="/sign-up" className="navbar-item">SignUp</Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default NavBar;