//profile & edit profile button,  progress?
import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import {doc, setDoc, getDoc, getDocs, deleteDoc, serverTimestamp, query, collection, orderBy} from 'firebase/firestore';
import { db, auth, app } from "../../services/firebase.js";
import { useState, useEffect } from "react";
import TaskGoalList from "../../components/task_goal_list/TaskGoalList.jsx";
import "./Profile.css";

const Profile = ( {user} ) => {
    //const { currentUser } = useAuth();
    // const [currentUser, setCurrentUser] = useState([]);
    const [allGoals, setAllGoals] = useState([]);
    const [currentGoal, setCurrentGoal] = useState([]);
    const [pastGoal, setPastGoal] = useState([]);

        useEffect (() => {
            const fetchGoals = async () => {

                if (user) {
                    try {
                        const readAllGoal = collection(db, "users",user.uid, "goals");
                        const q = query(readAllGoal, orderBy('dueDate', 'desc'));
                        const querySnapshot = await getDocs(q);
                        const userGoals = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
                        // const querySnapshot = await getDocs(readAllGoal);
                        // const userGoals = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));

                        setAllGoals(userGoals);

                        const {beforeToday, afterToday} = splitGoals(userGoals);
                        console.log("before today:", beforeToday, "after today:", afterToday);
                        setPastGoal(beforeToday);
                        setCurrentGoal(afterToday);

                        console.log(userGoals);
                    } catch (error) {
                        console.error("Error reading goal: ", error);
                    }

                }
            }
            fetchGoals();
        }, [user])

   function splitGoals(goals) {
            const today = new Date();
            today.setDate(today.getDate() - 2); // consider goals due today as past goals
            today.setHours(0, 0, 0, 0);
            const beforeToday = goals.filter(goal => {
                const day = new Date(goal.dueDate);
                day.setHours(0, 0, 0, 0);
                return day <= today;
            });

            const afterToday = goals.filter(goal => {
                const day = new Date(goal.dueDate);
                day.setHours(0, 0, 0, 0);
                return day > today;
            });
            return {beforeToday, afterToday};
   }

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
                    <div className="user-info">
                        <h2>User Name</h2>
                        <p>jane@gmail.com</p>
                    </div>

                    <div className="total-goals">
                        <div className="current-goal">
                            <span>Current Goals</span>
                            <div className="goal-list">
                                {currentGoal.length > 0 ? (
                                    <ol>
                                        {currentGoal.map(goal => (
                                            // Each favorite rendered with key, title, and image
                                            <li key={goal.id}>
                                                <p>{goal.goalInput}</p>
                                                <p>{goal.dueDate}</p>
                                            </li>
                                        ))}
                                    </ol>
                                ) : (
                                    // Shown when the user has no favorites
                                    <p>No current goal.</p>
                                )}
                            </div>
                        </div>
                        <div className="past-goal">
                            <span>Past Goals</span>
                            <div className="goal-list">
                                {pastGoal.length > 0 ? (
                                    <ol>
                                        {pastGoal.map(goal => (
                                            // Each favorite rendered with key, title, and image
                                            <li key={goal.id}>
                                                <p>{goal.goalInput}</p>
                                                <p>{goal.dueDate}</p>
                                            </li>
                                        ))}
                                    </ol>
                                ) : (
                                    // Shown when the user has no favorites
                                    <p>No past goal.</p>
                                )}
                            </div>
                        </div>
                    </div>
        </div>


    )
};

export default Profile;

