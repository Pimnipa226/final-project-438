//profile & edit profile button,  progress?
import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import "./Profile.css"

const Profile = () => {
    const { currentUser } = useAuth();

    return (
        <div className="profile">
            <div className="user-info">
                <h2>{currentUser?.displayName}</h2>
                <p>{currentUser?.email}</p>
                {currentUser?.photoURL && (
                    <img src={currentUser?.photoURL} alt="Profile" />
                )}
            </div>
            <div className="profile-buttons">
                <button>Edit Profile</button>
                <button>View Progress</button>
            </div>

            <div className="progress-content">
                <p>Achievements and Progress</p>
            </div>

        </div>
    );
};

export default Profile;

