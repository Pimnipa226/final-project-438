import React, { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../../services/firebase.js";
import "./Profile.css";

const Profile = ({ user }) => {
    const [allGoals, setAllGoals] = useState([]);
    const [currentGoal, setCurrentGoal] = useState([]);
    const [pastGoal, setPastGoal] = useState([]);


    // Fetch user goals from Firebase
    useEffect(() => {
        const fetchGoals = async () => {
            if (!user) return;
    // Reference to user's goals collection
            try {
                const goalsRef = collection(db, "users", user.uid, "goals");
                const q = query(goalsRef, orderBy("dueDate", "desc"));
                const querySnapshot = await getDocs(q);
                // Map documents to goal objects
                const userGoals = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setAllGoals(userGoals);
                const { beforeToday, afterToday } = splitGoals(userGoals);
                setPastGoal(beforeToday);
                setCurrentGoal(afterToday);
            } catch (error) {
                console.error("Error fetching goals:", error);
            }
        };

        fetchGoals();
    }, [user]);


    // Split all goals into 2 groups -- past goals and current goals
    function splitGoals(goals) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const beforeToday = goals.filter(goal => new Date(goal.dueDate) < today);
        const afterToday = goals.filter(goal => new Date(goal.dueDate) >= today);

        return { beforeToday, afterToday };
    }

    // Render profile page
    return (
        <div className="profile-content" aria-label="User Profile Page">
            {/* User Info */}
            <div className="user-info" aria-label="User Information Section">
                <h2 className="user-info-line">User Information</h2>
                <p className="email">Email: {user.email}</p>
            </div>

            {/* Current goals */}
            <div className="total-goals" aria-label="User Goals Records Section">
                <div className="current-goal" aria-label="Current Goal Information">
                    <h1>My Current Goals</h1>
                    <div className="goal-list-container">
                    <div className="goal-list">
                        {currentGoal.length > 0 ? (
                            <ol>
                                {currentGoal.map(goal => (
                                    <li key={goal.id}>
                                        <p>{goal.goalInput}</p>
                                        <p>Due: {goal.dueDate}</p>
                                    </li>
                                ))}
                            </ol>
                        ) : (
                            <p>No current goal.</p>
                        )}
                    </div>
                    </div>
                </div>

                <hr className="current-and-past-divider" />

                {/* Past goals */}
                <div className="past-goal" aria-label="Past Goal Information">
                    <h2>My Past Goals</h2>
                    <div className="goal-list">

                        {pastGoal.length > 0 ? (
                            <ol>
                                {pastGoal.map(goal => (
                                    <li key={goal.id}>
                                        <p>{goal.goalInput}</p>
                                        <p>Due: {goal.dueDate}</p>
                                    </li>
                                ))}
                            </ol>
                        ) : (
                            <p>No past goal.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
