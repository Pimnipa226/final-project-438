import React from 'react';
//import { useAuth } from "../../contexts/AuthContext";
//import { logoutUser } from "../../services/auth";
import { Link } from 'react-router-dom';
import './NavBar.css';
import { auth } from "../../services/firebase.js";
import { signOut } from "firebase/auth";

function NavBar ({user}) {
    const handleSignOut = () => {
        signOut(auth);
    };

//     return (
//         <p>NavBar</p>
//     )
// }

    // const { currentUser } = useAuth();
    // const navigate = useNavigate();
    //
    // const handleLogout = async () => {
    //     await logoutUser();
    //     navigate('/login');
    // };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                {/*<Link to="/">Goalify</Link>*/}
                <p>Goalify</p>
            </div>
            <div className="navbar-menu">
                {/*{currentUser ? (*/}
                {/*    <>*/}
                        <Link to="/homepage" className="navbar-item">Home</Link>
                        <Link to="/profile" className="navbar-item">Profile</Link>
                        <button onClick={handleSignOut} className="navbar-button">Logout</button>
                    {/*</>*/}
                {/*) : (*/}
                {/*    <>*/}
                {/*        <Link to="/login" className="navbar-item">Login</Link>*/}
                {/*        <Link to="/sign-up" className="navbar-item">SignUp</Link>*/}
                {/*    </>*/}
                {/*)}*/}
            </div>
        </nav>
    );
}

export default NavBar;