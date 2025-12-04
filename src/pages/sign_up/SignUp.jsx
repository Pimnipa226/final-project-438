import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./sign-up.css";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../services/firebase.js';


const SignUp = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Handles the sign-up form submission.
    const handleSignUp = async (e) => {
        e.preventDefault();
        // Validate password match
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            navigate("/log-in");
        } catch (err) {
            setError(err.message);
        }
    }


    return (
        <div>
        <div className="sign-up-content" aria-label="sign-up-page">
            <div className="welcome" aria-label="welcome-section">
            <h1>Welcome!</h1>
                <div className="web-app-description" aria-label="Web App description">
                    Goalify is a web app designed to help UW students manage their goals more effectively.
                    Powered by AI, the app guides students by helping them break big goals into daily actionable tasks, stay organized, and build consistent habits.
                </div>
            </div>
            <div className="auth-form-container" aria-label="sign up section">
                <h2>Create Account</h2>
                {/*{error && <div className="auth-error">{error}</div>}*/}

                <form onSubmit={handleSignUp} className="auth-form">

                    <div className="form-group" aria-label="enter email">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group" aria-label="enter password">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group" aria-label="enter confirm password">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="sign-up-button-container" aria-label="sign up button">
                        <button className="sign-up-button"
                            type="submit"
                        >
                            Sign Up
                        </button>
                    </div>
                    <div className="auth-link" aria-label="log in link">
                    Already have Goalify account?&nbsp;
                    <Link to="/log-in">Log In</Link>
                    </div>
                </form>

                {/*<div className="auth-link">*/}
                {/*    Already have an account? <Link to="/login">Log In</Link>*/}
                {/*</div>*/}
            </div>
        </div>
        </div>
    );
};

export default SignUp;

