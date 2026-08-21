import React, { useState, useEffect, useMemo } from "react";
import { collection, query, orderBy, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { db } from "../../services/firebase.js";
import "./Profile.css";

// Local "YYYY-MM-DD" for today, safe to compare directly against goal.dueDate
// strings (avoids the UTC-parsing pitfalls of `new Date(dueDate)`).
function todayDateString() {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
}

// Split all goals into 2 groups -- past goals and current goals. goal.dueDate
// is a plain "YYYY-MM-DD" string, so we compare it against today's local date
// as a string too (ISO-format date strings compare correctly as plain strings).
function splitGoals(goals) {
    const todayStr = todayDateString();
    const beforeToday = goals.filter((goal) => goal.dueDate < todayStr);
    const afterToday = goals.filter((goal) => goal.dueDate >= todayStr);
    return { beforeToday, afterToday };
}

// ---- Editable goal list item (used for both current and past goals) ----

function GoalListItem({ user, goal }) {
    const [editing, setEditing] = useState(false);
    const [editingDueDate, setEditingDueDate] = useState(goal.dueDate);

    const startEditing = () => {
        setEditingDueDate(goal.dueDate);
        setEditing(true);
    };

    const cancelEditing = () => setEditing(false);

    const saveDueDate = async () => {
        if (!user || !editingDueDate) {
            cancelEditing();
            return;
        }
        try {
            const goalRef = doc(db, "users", user.uid, "goals", goal.id);
            await updateDoc(goalRef, { dueDate: editingDueDate });
        } catch (error) {
            console.error("Error editing goal due date:", error);
        } finally {
            setEditing(false);
        }
    };

    return (
        <li>
            <p>{goal.goalInput}</p>
            {editing ? (
                <p className="goal-due-edit-row">
                    <input
                        type="date"
                        className="goal-due-edit-input"
                        value={editingDueDate}
                        autoFocus
                        onChange={(e) => setEditingDueDate(e.target.value)}
                    />
                    <button className="task-edit-save" onClick={saveDueDate}>
                        Save
                    </button>
                    <button className="task-edit-cancel" onClick={cancelEditing}>
                        Cancel
                    </button>
                </p>
            ) : (
                <p className="goal-due-display">
                    Due: {goal.dueDate}
                    <button
                        className="task-edit-button"
                        onClick={startEditing}
                        title="Edit due date"
                        aria-label="Edit due date"
                    >
                        ✎
                    </button>
                </p>
            )}
        </li>
    );
}

// ---- Profile page ----

const Profile = ({ user }) => {
    const [dashboardGoals, setDashboardGoals] = useState([]);

    useEffect(() => {
        if (!user) return;

        const goalRef = collection(db, "users", user.uid, "goals");
        const goalQuery = query(goalRef, orderBy("dueDate", "desc"));
        const unsubGoals = onSnapshot(goalQuery, (snap) => {
            setDashboardGoals(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        });

        return () => unsubGoals();
    }, [user]);

    const { beforeToday: pastGoal, afterToday: currentGoal } = useMemo(
        () => splitGoals(dashboardGoals),
        [dashboardGoals]
    );

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
                                    {currentGoal.map((goal) => (
                                        <GoalListItem key={goal.id} user={user} goal={goal} />
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
                                {pastGoal.map((goal) => (
                                    <GoalListItem key={goal.id} user={user} goal={goal} />
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
