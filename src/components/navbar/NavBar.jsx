import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';
import { auth } from "../../services/firebase.js";
import { signOut } from "firebase/auth";

function NavBar ({user}) {
    const handleSignOut = () => {
        signOut(auth);
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand" aria-label="app name">
                <p>Goalify</p>
            </div>
            {/*Nav Bar contains Home, profile, and sign out buttons*/}
            <div className="navbar-menu" aria-label="navbar menu">
                <Link to="/">
                    <button className="home-button">Home</button>
                </Link>

                <Link to="/profile">
                    <button className="profile-button">Profile</button>
                </Link>
                        <button onClick={handleSignOut} className="log-out-button">Logout</button>
            </div>
        </nav>
    );
}

export default NavBar;