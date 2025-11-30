import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import NavBar from "../../components/navbar/NavBar.jsx";
import "./login.css";
import {signInWithEmailAndPassword} from "firebase/auth";
import {auth} from "../../services/firebase.js";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignIn = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/");
        } catch (err) {
            setError(err.message);
        }
    }

    return (
    <div>
        <div className="login-content">

        <div className="auth-container">
            <div className="welcome">
                <h1>Welcome!</h1>
            </div>
            <div className="web-app-description">
                    Goalify is an app designed to help UW students manage their goals more effectively.
                    Powered by AI, Goalify guides students by helping them break big goals into daily actionable tasks, stay organized, and build consistent habits.
                    The app provides personalized recommendations, progress tracking, and reminders to keep students motivated throughout the quarter.
            </div>

            <div className="auth-form-container">
                <h2>Log In</h2>
                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={handleSignIn} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input className="email-input-field"
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input className="password-input-field"
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="auth-button"
                    >
                        Log In
                    </button>
                </form>

                <div className="auth-link">
                    Don't have an account? <Link to="/sign-up">Sign Up</Link>
                </div>
            </div>
        </div>
        </div>
    </div>
    );
};


export default Login;
