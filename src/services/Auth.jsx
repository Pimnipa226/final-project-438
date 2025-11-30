// import {
//     createUserWithEmailAndPassword,
//     signInWithEmailAndPassword,
//     signOut,} from "firebase/auth";
// import { auth } from "./firebase";
// import React, {useState} from "react";
// import {Link} from "react-router-dom";
//
//
// const Auth = () => {
//
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [error, setError] = useState("");
//
//     const handleSignIn = async (e) => {
//         e.preventDefault();
//         try {
//             await signInWithEmailAndPassword(auth, email, password);
//         } catch (err) {
//             setError(err.message);
//         }
// }
//     return (
//         <div className="auth-form-container">
//             <h2>Log In</h2>
//             <form className="auth-form">
//                 <div className="form-group">
//                     <label htmlFor="email">Email</label>
//                     <input className="email-input-field"
//                            type="email"
//                            id="email"
//                            value={email}
//                            onChange={(e) => setEmail(e.target.value)}
//                            required
//                     />
//                 </div>
//
//                 <div className="form-group">
//                     <label htmlFor="password">Password</label>
//                     <input className="password-input-field"
//                            type="password"
//                            id="password"
//                            value={password}
//                            onChange={(e) => setPassword(e.target.value)}
//                            required
//                     />
//                 </div>
//
//                 <button onClick={handleSignIn}>Sign In
//                     type="submit"
//                     className="auth-button"
//                 >
//                     Sign In
//                 </button>
//                 <p>Don't have Goalify account yet?</p>
//                 <Link to="/signup">Sign Up</Link>
//             </form>
//             {error && <p style={{ color : 'red' }}>{error}</p>}
//         </div>
//     )
// }
//
//
// export default Auth;