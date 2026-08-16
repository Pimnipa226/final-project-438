import React, { useState, useEffect, useMemo } from "react";
import { GoogleGenAI } from "@google/genai";
import { collection, getDocs, query, orderBy, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { db } from "../../services/firebase.js";
import "./Profile.css";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GOOGLE_API_KEY });

// ---- Shared date helpers ----

const dayKey = (d) => {
    const date = new Date(d);
    date.setHours(0, 0, 0, 0);
    return date.toISOString().split("T")[0];
};

const isSameDay = (a, b) => dayKey(a) === dayKey(b);

// Local "YYYY-MM-DD" for today, safe to compare directly against goal.dueDate
// strings (avoids the UTC-parsing pitfalls of `new Date(dueDate)`).
function todayDateString() {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
}

// ---- Progress dashboard helpers ----

// Counts consecutive days with at least one completed task in the given list,
// walking back from today. If nothing is completed today yet, today doesn't
// break the streak — it just isn't counted until it has a completion of its own.
function computeStreak(tasks) {
    const completedDays = new Set(
        tasks.filter((t) => t.completed).map((t) => dayKey(t.date))
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let cursor = new Date(today);
    if (!completedDays.has(dayKey(cursor))) {
        cursor.setDate(cursor.getDate() - 1);
    }

    let streak = 0;
    while (completedDays.has(dayKey(cursor))) {
        streak += 1;
        cursor.setDate(cursor.getDate() - 1);
    }
    return streak;
}

const STREAK_TARGET = 30;

// Per-goal progress + per-goal streak, only for goals not yet past their due date.
function computeGoalProgress(tasks, goals) {
    const todayStr = todayDateString();
    return goals
        .filter((goal) => goal.dueDate >= todayStr)
        .map((goal) => {
            const goalTasks = tasks.filter((t) => t.goalId === goal.id);
            const streak = computeStreak(goalTasks);
            if (goalTasks.length === 0) return { ...goal, percent: 0, completed: 0, total: 0, streak };
            const completed = goalTasks.filter((t) => t.completed).length;
            return {
                ...goal,
                percent: Math.round((completed / goalTasks.length) * 100),
                completed,
                total: goalTasks.length,
                streak,
            };
        })
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
}

// ---- Progress dashboard section (per-goal streak + progress, AI encouragement) ----

function ProgressDashboard({ tasks, goals, loaded }) {
    const [encouragement, setEncouragement] = useState("");
    const [encouragementLoading, setEncouragementLoading] = useState(false);

    const goalProgress = useMemo(() => computeGoalProgress(tasks, goals), [tasks, goals]);
    const goalProgressKey = goalProgress.map((g) => `${g.id}:${g.streak}:${g.percent}`).join("|");

    // Regenerate the encouragement line whenever goal stats change, grounded
    // only in the real numbers so it never invents specifics.
    useEffect(() => {
        if (!loaded || tasks.length === 0) return;

        const statsSummary =
            goalProgress.length === 0
                ? "no active goals yet"
                : goalProgress
                    .map(
                        (g) =>
                            `"${g.goalInput}": streak ${g.streak} day${g.streak === 1 ? "" : "s"}, ${g.completed}/${g.total} tasks done (${g.percent}%), due ${g.dueDate}`
                    )
                    .join("; ");

        let cancelled = false;
        setEncouragementLoading(true);

        ai.models
            .generateContent({
                model: "gemini-2.5-flash",
                contents: [{ role: "user", parts: [{ text: statsSummary }] }],
                config: {
                    systemInstruction: `You write a single short encouragement line for a goal-tracking app, based only on the stats given to you (one or more goals, each with its own streak and completion numbers). Rules:
- One sentence, maybe two at most. Warm, genuine, specific to the numbers given — never generic filler like "keep up the great work."
- Never invent details not present in the stats (no task names, categories, or events you weren't told about).
- If multiple goals are given, you may focus on whichever is most notable (highest streak, closest to done, or most at risk given its due date) rather than trying to mention all of them.
- If all streaks are 0 and completion is low, be encouraging about starting or restarting, not falsely celebratory.
- If a goal is close to its due date with low completion, you may gently note the timeline without being alarming.
- Plain text only, no markdown, no emoji (the app adds its own icons).`,
                },
            })
            .then((response) => {
                if (!cancelled) setEncouragement(response.text.trim());
            })
            .catch((err) => {
                console.error("Error generating encouragement:", err);
            })
            .finally(() => {
                if (!cancelled) setEncouragementLoading(false);
            });

        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loaded, goalProgressKey]);

    if (!loaded) {
        return <div className="progress-dashboard progress-dashboard--loading" aria-label="Progress Dashboard" />;
    }

    return (
        <div className="progress-dashboard" aria-label="Progress Dashboard">
            <div className="encouragement-banner" aria-live="polite">
                <span className="progress-stat-icon" aria-hidden="true">
                    💬
                </span>
                <p className="encouragement-text">
                    {encouragementLoading && !encouragement
                        ? "Thinking of something encouraging to say..."
                        : encouragement || "Complete a few tasks to see your progress here."}
                </p>
            </div>

            <div className="goal-progress-section">
                <h4 className="goal-progress-heading">
                    <span aria-hidden="true">🎯</span> Goal progress
                </h4>

                {goalProgress.length === 0 ? (
                    <p className="progress-empty-note">
                        No goals yet — ask the AI assistant to break one down to get started.
                    </p>
                ) : (
                    goalProgress.map((goal) => (
                        <div className="goal-progress-item" key={goal.id}>
                            <div className="goal-progress-header">
                                <span className="goal-progress-name">{goal.goalInput}</span>
                                <span
                                    className="goal-streak-badge"
                                    title={`${goal.streak}-day streak on this goal`}
                                >
                                    <span className="goal-streak-icon" aria-hidden="true">
                                        🔥
                                    </span>
                                    <span className="goal-streak-count">
                                        {goal.streak}/{STREAK_TARGET}
                                    </span>
                                </span>
                                <span className="goal-progress-percent">{goal.percent}%</span>
                            </div>
                            <div
                                className="goal-progress-bar-track"
                                role="progressbar"
                                aria-valuenow={goal.percent}
                                aria-valuemin="0"
                                aria-valuemax="100"
                            >
                                <div className="goal-progress-bar-fill" style={{ width: `${goal.percent}%` }} />
                            </div>
                            <div className="goal-progress-meta">
                                {goal.completed}/{goal.total} tasks · due {goal.dueDate}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

// ---- Today's Tasks checklist (lets users mark tasks done right from Profile) ----

function TodaysTasks({ user, tasks, loaded }) {
    const [togglingId, setTogglingId] = useState(null);

    const todaysTasks = useMemo(() => {
        const today = new Date();
        return tasks
            .filter((t) => isSameDay(t.date, today))
            .sort((a, b) => (a.completed === b.completed ? 0 : a.completed ? 1 : -1));
    }, [tasks]);

    const toggleComplete = async (task) => {
        if (!user) return;
        setTogglingId(task.id);
        try {
            const taskRef = doc(db, "users", user.uid, "tasks", task.id);
            await updateDoc(taskRef, { completed: !task.completed });
        } catch (error) {
            console.error("Error updating task:", error);
        } finally {
            setTogglingId(null);
        }
    };

    if (!loaded) return null;

    return (
        <div className="todays-tasks-section" aria-label="Today's Tasks">
            <h4 className="todays-tasks-heading">Today's Tasks</h4>

            {todaysTasks.length === 0 ? (
                <p className="progress-empty-note">Nothing scheduled for today.</p>
            ) : (
                <ul className="todays-tasks-list">
                    {todaysTasks.map((task) => (
                        <li className="todays-task-item" key={task.id}>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={task.completed || false}
                                    disabled={togglingId === task.id}
                                    onChange={() => toggleComplete(task)}
                                />
                                <span
                                    className="todays-task-text"
                                    style={{ textDecoration: task.completed ? "line-through" : "none" }}
                                >
                                    {task.text}
                                </span>
                            </label>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

// ---- Profile page ----

const Profile = ({ user }) => {
    const [allGoals, setAllGoals] = useState([]);
    const [currentGoal, setCurrentGoal] = useState([]);
    const [pastGoal, setPastGoal] = useState([]);

    // Live task/goal data shared by the progress dashboard and today's checklist
    const [dashboardTasks, setDashboardTasks] = useState([]);
    const [dashboardGoals, setDashboardGoals] = useState([]);
    const [dashboardLoaded, setDashboardLoaded] = useState(false);

    // Fetch user goals from Firebase (existing current/past goal lists)
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

    // Live listeners for the progress dashboard + today's checklist (updates in real time)
    useEffect(() => {
        if (!user) return;

        const taskRef = collection(db, "users", user.uid, "tasks");
        const taskQuery = query(taskRef, orderBy("date", "asc"));
        const unsubTasks = onSnapshot(taskQuery, (snap) => {
            setDashboardTasks(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
            setDashboardLoaded(true);
        });

        const goalRef = collection(db, "users", user.uid, "goals");
        const goalQuery = query(goalRef, orderBy("dueDate", "asc"));
        const unsubGoals = onSnapshot(goalQuery, (snap) => {
            setDashboardGoals(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        });

        return () => {
            unsubTasks();
            unsubGoals();
        };
    }, [user]);

    // Split all goals into 2 groups -- past goals and current goals.
    // goal.dueDate is stored as a plain "YYYY-MM-DD" string, so we compare it
    // against today's local date as a string too (rather than via `new Date(...)`,
    // which parses "YYYY-MM-DD" as UTC midnight and can misfile a goal by a day
    // in timezones ahead of UTC). ISO-format date strings compare correctly
    // with plain string comparison.
    function splitGoals(goals) {
        const todayStr = todayDateString();
        const beforeToday = goals.filter(goal => goal.dueDate < todayStr);
        const afterToday = goals.filter(goal => goal.dueDate >= todayStr);

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

            {/* Mark today's tasks done right here — feeds straight into the progress overview below */}
            <TodaysTasks user={user} tasks={dashboardTasks} loaded={dashboardLoaded} />

            {/* Progress overview: encouragement, per-goal progress + streak */}
            <ProgressDashboard
                tasks={dashboardTasks}
                goals={dashboardGoals}
                loaded={dashboardLoaded}
            />

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
