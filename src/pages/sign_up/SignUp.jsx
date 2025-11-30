import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./sign-up.css";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../services/firebase.js';


// const SignUp = () => {
//     return (
//         <div className="sign-up">
//             <p>Sign up here!</p>
//         </div>
//     )
// };

const SignUp = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

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
        <div className="signup-content">
            <h1>Welcome!</h1>
            <p className="web-app-description">
                Goalify is an app designed to help UW students manage their goals more effectively.
                Powered by AI, Goalify guides students by helping them break big goals into daily actionable tasks, stay organized, and build consistent habits.
                The app provides personalized recommendations, progress tracking, and reminders to keep students motivated throughout the quarter.
            </p>
        </div>
        <div className="auth-container">
            <div className="auth-form-container">
                <h2>Create Account</h2>
                {/*{error && <div className="auth-error">{error}</div>}*/}

                <form onSubmit={handleSignUp} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="auth-button"
                        // disabled={loading}
                    >
                        {loading ? "Creating account..." : "Sign Up"}
                        Sign Up
                    </button>
                    <p>Already have Goalify account?</p>
                    <Link to="/log-in">Log In</Link>
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

