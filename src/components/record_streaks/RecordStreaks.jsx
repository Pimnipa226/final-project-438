import React, { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../../services/firebase.js";
import "./RecordStreaks.css";

// Cycles through the three accent colors as goals are rendered, so each
// goal's streak block gets a distinct, consistent color.
const ACCENTS = ["blue", "amber", "mint"];

// Local "YYYY-MM-DD" key, consistent regardless of stored time-of-day —
// matches the same local-date approach TaskGoalList uses for dueDate compares.
function dayKey(date) {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function startOfDay(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
}

// Returns the 7 dates (Mon -> Sun) of the week containing `date`.
function getWeekDays(date) {
    const start = startOfDay(date);
    const dow = start.getDay(); // 0 = Sun ... 6 = Sat
    const mondayOffset = dow === 0 ? -6 : 1 - dow;
    const monday = new Date(start);
    monday.setDate(monday.getDate() + mondayOffset);

    return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        return d;
    });
}

// Consecutive-day streak for a single goal, counting backward from today.
// If today doesn't have a completed task yet, today is skipped (grace
// period) rather than zeroing the streak out before the day is even done.
function computeStreak(goalId, completedDayKeys) {
    let cursor = startOfDay(new Date());

    if (!completedDayKeys.has(dayKey(cursor))) {
        cursor.setDate(cursor.getDate() - 1);
    }

    let streak = 0;
    while (completedDayKeys.has(dayKey(cursor))) {
        streak++;
        cursor.setDate(cursor.getDate() - 1);
    }
    return streak;
}

function RecordStreaks({ user }) {
    const [goals, setGoals] = useState([]);
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        if (!user) return;

        const goalRef = collection(db, "users", user.uid, "goals");
        const goalQuery = query(goalRef, orderBy("dueDate", "asc"));
        const unsubGoals = onSnapshot(goalQuery, (snap) => {
            setGoals(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        });

        const taskRef = collection(db, "users", user.uid, "tasks");
        const taskQuery = query(taskRef, orderBy("date", "asc"));
        const unsubTasks = onSnapshot(taskQuery, (snap) => {
            setTasks(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        });

        return () => {
            unsubGoals();
            unsubTasks();
        };
    }, [user]);

    const todayStr = (() => {
        const t = new Date();
        return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
    })();

    // Only show goals that aren't past due — matches TaskGoalList's "current" split.
    const currentGoals = goals.filter((g) => g.dueDate >= todayStr);

    const weekDays = getWeekDays(new Date());
    const weekLabels = ["M", "T", "W", "T", "F", "S", "S"];
    const todayKey = dayKey(new Date());

    return (
        <div className="record-streaks" aria-label="Goal Streak Tracker">
            <div className="record-head">
                <h2>Record</h2>
                <span className="record-count">
                    {currentGoals.length} active {currentGoals.length === 1 ? "streak" : "streaks"}
                </span>
            </div>

            {currentGoals.length === 0 ? (
                <p className="record-empty">No goals yet — add one to start a streak.</p>
            ) : (
                <div className="streak-list">
                    {currentGoals.map((g, i) => {
                        const completedDayKeys = new Set(
                            tasks
                                .filter((t) => t.goalId === g.id && t.completed)
                                .map((t) => dayKey(new Date(t.date)))
                        );
                        const streak = computeStreak(g.id, completedDayKeys);
                        const accent = ACCENTS[i % ACCENTS.length];

                        return (
                            <div className="streak-block" key={g.id}>
                                <div className="streak-block-head">{g.goalInput}</div>
                                <div className="streak-row">
                                    <div className={`streak-num ${accent}`}>{streak}</div>
                                    <div className="streak-label">
                                        day streak
                                        <br />
                                        {streak === 0 ? "log a task today to start one" : "keep it going"}
                                    </div>
                                </div>
                                <div className="week-grid">
                                    {weekDays.map((d, idx) => {
                                        const key = dayKey(d);
                                        const isToday = key === todayKey;
                                        const isHit = completedDayKeys.has(key);

                                        let markClass = "mark";
                                        if (isHit) markClass += ` hit ${accent}`;
                                        else if (isToday) markClass += " today";

                                        return (
                                            <div className="day-pill" key={key}>
                                                <div className="d">{weekLabels[idx]}</div>
                                                <div className={markClass}>
                                                    {isHit ? "✓" : ""}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default RecordStreaks;
