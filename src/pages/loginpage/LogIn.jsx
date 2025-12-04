import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./login.css";
import {signInWithEmailAndPassword} from "firebase/auth";
import {auth} from "../../services/firebase.js";

const Login = () => {
    const [email, setEmail] = useState(""); // Stores user input for email
    const [password, setPassword] = useState(""); // Stores user input for password
    const [error, setError] = useState(""); // Stores error messages
    //const [loading, setLoading] = useState(false); // Indicates loading state
    const navigate = useNavigate(); // Hook for navigation

    // Handles the sign-in process
    const handleSignIn = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/");
        } catch (err) {
            setError(err.message);
        }
    }
    // Renders the login form
    return (
    <div>
        <div className="login-content">

        {/*<div className="auth-container">*/}
            <div className="welcome" aria-label='Welcome section'>
                <h1>Welcome!</h1>

                <div className="web-app-description" aria-label="Web App description">
                        Goalify is a web app designed to help UW students manage their goals more effectively.
                        Powered by AI, the app guides students by helping them break big goals into daily actionable tasks, stay organized, and build consistent habits.
                </div>
            </div>
            <div className="auth-form-container" aria-label="log in section">
                <h2>Log In</h2>
                {/*Display error message if any*/}
                {error && <div className="auth-error">{error}</div>}
                {/*Submit form for login*/}
                <form onSubmit={handleSignIn} className="auth-form">
                    <div className="form-group" aria-label="enter email">
                        <label htmlFor="email">Email</label>
                        <input className="email-input-field"
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group" aria-label="enter password">
                        <label htmlFor="password">Password</label>
                        <input className="password-input-field"
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="log-in-button-container" aria-label="log in button">
                    <button
                        type="submit"
                        className="auth-button"
                    >
                        Log In
                    </button>
                    </div>
                </form>

                <div className="auth-link" aria-label="sign up link">
                    Don't have Goalify account?&nbsp;
                    <Link to="/sign-up">Sign Up</Link>
                </div>
            </div>
        </div>
        {/*</div>*/}
    </div>
    );
};


export default Login;
