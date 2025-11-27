//profile & edit profile button,  progress?
import React from "react";
//import { useAuth } from "../../contexts/AuthContext";
import "./Profile.css"
import NavBar from "../../components/navbar/NavBar.jsx";

const Profile = () => {
    //const { currentUser } = useAuth();

    return (
        // <div className="profile">
        //     <div className="user-info">
        //         <h2>{currentUser?.displayName}</h2>
        //         <p>{currentUser?.email}</p>
        //         {currentUser?.photoURL && (
        //             <img src={currentUser?.photoURL} alt="Profile" />
        //         )}
        //     </div>
        //     <div className="profile-buttons">
        //         <button>Edit Profile</button>
        //         <button>View Progress</button>
        //     </div>
<div className="profile-content">
    <NavBar/>
            <div className="user-info">
                <img src="https://via.placeholder.com/150" alt="Profile" />
                <h2>User Name</h2>
                <p>jane@gmail.com</p>
                <button className="edit-profile-button">Edit Profile</button>
                <button className="sign-out-button">Sign out</button>
            </div>

            <div className="progress-content">
                <p className="heading">Achievements and Progress</p>
                <div className="progress-bars">
                    <div className="progress-bar">
                        <span>Task Completed</span>
                        <div className="bar">
                            75%
                        </div>
                    </div>
                    <div className="progress-bar">
                        <span>Goal Achievement</span>
                        <div className="bar">
                            75%
                        </div>
                    </div>
                </div>
            </div>
</div>


    )
};

export default Profile;

