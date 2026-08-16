import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
    addDoc,
    query,
    collection,
    orderBy,
    onSnapshot,
    updateDoc,
    doc,
    serverTimestamp,
} from "firebase/firestore";
import { db } from "../../services/firebase.js";
import "./TaskGoalList.css";

// Local "YYYY-MM-DD" for today, safe to compare directly against goal.dueDate
// strings (avoids the UTC-parsing pitfalls of `new Date(dueDate)`).
function todayDateString() {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
}

const DEFAULT_TARGET_DAYS = 30;

function TaskGoalCalendar({ user }) {
    const [selectedDate, setSelectedDate] = useState(new Date());

    // Task input
    const [newTask, setNewTask] = useState("");
    // Tasks from Firebase
    const [tasks, setTasks] = useState([]);
    // Which goal (if any) the next added task should link to
    const [selectedGoalId, setSelectedGoalId] = useState("");

    // Editing an already-saved task
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editingText, setEditingText] = useState("");

    // Goals input and current goals
    const [goalName, setGoalName] = useState("");
    const [goalDueDate, setGoalDueDate] = useState("");
    const [goalTargetDays, setGoalTargetDays] = useState(String(DEFAULT_TARGET_DAYS));
    const [currentGoal, setCurrentGoal] = useState([]);
    const [pastGoal, setPastGoal] = useState([]);

    // Editing an already-saved goal's due date
    const [editingGoalId, setEditingGoalId] = useState(null);
    const [editingDueDate, setEditingDueDate] = useState("");

    // Fetch tasks from Firebase
    useEffect(() => {
        if (!user) return;

        const taskRef = collection(db, "users", user.uid, "tasks");
        const q = query(taskRef, orderBy("date", "asc"));

        const unsubscribe = onSnapshot(q, (snap) => {
            const userTasks = snap.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setTasks(userTasks);
        });

        return () => unsubscribe();
    }, [user]);

    // Save task to Firestore with no past dates, optionally linked to a goal
    const saveTask = async () => {
        if (!newTask.trim() || !user) return;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const selected = new Date(selectedDate);
        selected.setHours(0, 0, 0, 0);

        if (selected < today) {
            alert("Cannot add task to past days!");
            return;
        }

        try {
            const taskRef = collection(db, "users", user.uid, "tasks");
            await addDoc(taskRef, {
                text: newTask,
                date: selected.toISOString(),
                completed: false,
                createdAt: serverTimestamp(),
                goalId: selectedGoalId || null,
            });

            setNewTask("");
        } catch (error) {
            console.error("Error saving task:", error);
        }
    };

    // Task completion toggle
    const toggleComplete = async (task) => {
        if (!user) return;

        try {
            const taskRef = doc(db, "users", user.uid, "tasks", task.id);
            const nowCompleted = !task.completed;
            await updateDoc(taskRef, { completed: nowCompleted });
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    // ---- Editing an already-saved task's text ----

    const startEditingTask = (task) => {
        setEditingTaskId(task.id);
        setEditingText(task.text);
    };

    const cancelEditingTask = () => {
        setEditingTaskId(null);
        setEditingText("");
    };

    const saveEditedTask = async (taskId) => {
        if (!user) return;
        const trimmed = editingText.trim();
        if (!trimmed) {
            cancelEditingTask();
            return;
        }
        try {
            const taskRef = doc(db, "users", user.uid, "tasks", taskId);
            await updateDoc(taskRef, { text: trimmed });
        } catch (error) {
            console.error("Error editing task:", error);
        } finally {
            cancelEditingTask();
        }
    };

    // Filter tasks for selected date and sort by most recent
    const isSameDay = (date1, date2) =>
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate();

    const selectedDayTasks = tasks
        .filter((t) => isSameDay(new Date(t.date), selectedDate))
        .sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);

    // Fetch goals from Firebase, live, so the goal picker and due-date edits stay current
    useEffect(() => {
        if (!user) return;

        const goalRef = collection(db, "users", user.uid, "goals");
        const q = query(goalRef, orderBy("dueDate", "asc"));

        const unsubscribe = onSnapshot(q, (snap) => {
            const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
            const { beforeToday, afterToday } = splitGoals(data);
            setPastGoal(beforeToday);
            setCurrentGoal(afterToday);
        });

        return () => unsubscribe();
    }, [user]);

    // Split all goals into 2 groups -- past goals and current goals
    function splitGoals(goals) {
        const todayStr = todayDateString();
        const beforeToday = goals.filter((g) => g.dueDate < todayStr);
        const afterToday = goals.filter((g) => g.dueDate >= todayStr);
        return { beforeToday, afterToday };
    }

    // Save goal to Firebase, including how many days the user wants to work
    // toward it (used as the streak target, e.g. "5/21")
    const saveGoal = async () => {
        if (!goalName.trim() || !goalDueDate || !user) return;

        const targetDays = Math.max(1, parseInt(goalTargetDays, 10) || DEFAULT_TARGET_DAYS);

        try {
            const goalRef = collection(db, "users", user.uid, "goals");
            await addDoc(goalRef, {
                goalInput: goalName,
                dueDate: goalDueDate,
                targetDays,
                createdAt: serverTimestamp(),
            });

            setGoalName("");
            setGoalDueDate("");
            setGoalTargetDays(String(DEFAULT_TARGET_DAYS));
        } catch (error) {
            console.error("Error saving goal: ", error);
        }
    };

    // ---- Editing an already-saved goal's due date ----

    const startEditingGoal = (goal) => {
        setEditingGoalId(goal.id);
        setEditingDueDate(goal.dueDate);
    };

    const cancelEditingGoal = () => {
        setEditingGoalId(null);
        setEditingDueDate("");
    };

    const saveEditedGoalDueDate = async (goalId) => {
        if (!user || !editingDueDate) {
            cancelEditingGoal();
            return;
        }
        try {
            const goalRef = doc(db, "users", user.uid, "goals", goalId);
            await updateDoc(goalRef, { dueDate: editingDueDate });
        } catch (error) {
            console.error("Error editing goal due date:", error);
        } finally {
            cancelEditingGoal();
        }
    };

    const tileClassName = ({ date, view }) => {
        if (view === "month") {
            const hasTask = tasks.some((t) => isSameDay(new Date(t.date), date));
            return hasTask ? "task-day" : null;
        }
        return null;
    };

    return (
        <div className="task-goal-container" aria-label="Task and Goal Management">
            <div className="welcome-back-container" aria-label="Welcome Back">
                <h1>Welcome back!</h1>
            </div>

            <Calendar
                className="calendar-styling"
                onChange={setSelectedDate}
                value={selectedDate}
                tileClassName={tileClassName}
                aria-label="Calendar to select date for tasks"
            />

            {/* Add tasks */}
            <h4>Task</h4>
            <div className="add-section" aria-label="Add Task Section">
                <input
                    className="input-field"
                    value={newTask}
                    placeholder="Add task..."
                    onChange={(e) => setNewTask(e.target.value)}
                />
                <select
                    className="task-goal-select"
                    value={selectedGoalId}
                    onChange={(e) => setSelectedGoalId(e.target.value)}
                    aria-label="Link task to a goal (optional)"
                >
                    <option value="">No goal</option>
                    {currentGoal.map((g) => (
                        <option key={g.id} value={g.id}>
                            {g.goalInput}
                        </option>
                    ))}
                </select>
                <button
                    className="plus-button"
                    onClick={saveTask}
                    disabled={new Date(selectedDate).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)}
                >
                    +
                </button>
            </div>

            {selectedDayTasks.length === 0 ? (
                <p>No tasks</p>
            ) : (
                selectedDayTasks.map((t) => (
                    <div key={t.id} className="task-item" aria-label="Task Item">
                        <input
                            className="check-box"
                            type="checkbox"
                            checked={t.completed || false}
                            onChange={() => toggleComplete(t)}
                        />

                        {editingTaskId === t.id ? (
                            <>
                                <input
                                    className="task-edit-input"
                                    type="text"
                                    value={editingText}
                                    autoFocus
                                    onChange={(e) => setEditingText(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") saveEditedTask(t.id);
                                        if (e.key === "Escape") cancelEditingTask();
                                    }}
                                />
                                <button className="task-edit-save" onClick={() => saveEditedTask(t.id)}>
                                    Save
                                </button>
                                <button className="task-edit-cancel" onClick={cancelEditingTask}>
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <>
                                <span
                                    className="task-text"
                                    style={{ textDecoration: t.completed ? "line-through" : "none" }}
                                >
                                    {t.text}
                                </span>
                                <button
                                    className="task-edit-button"
                                    onClick={() => startEditingTask(t)}
                                    title="Edit task"
                                    aria-label="Edit task"
                                >
                                    ✎
                                </button>
                            </>
                        )}
                    </div>
                ))
            )}

            <hr className="section-divider" />

            {/* Add goals */}
            <h3>Goal</h3>
            <div className="add-goal-section" aria-label="Add Goal Section">
                <input
                    className="input-field2"
                    value={goalName}
                    placeholder="Add goal..."
                    onChange={(e) => setGoalName(e.target.value)}
                    aria-label="Add goal name"
                />
                <input
                    className="input-field3"
                    type="date"
                    value={goalDueDate}
                    onChange={(e) => setGoalDueDate(e.target.value)}
                    aria-label="Select goal due date"
                />
                <input
                    className="input-field4"
                    type="number"
                    min="1"
                    value={goalTargetDays}
                    onChange={(e) => setGoalTargetDays(e.target.value)}
                    placeholder="Target days"
                    aria-label="How many days do you want to complete this goal in"
                    title="How many days do you want to complete this goal in?"
                />
                <button className="plus-button" onClick={saveGoal}>
                    +
                </button>
            </div>

            <h5>Current Goals</h5>
            {currentGoal.length === 0 ? (
                <p>No current goals</p>
            ) : (
                currentGoal.map((g) => (
                    <div className="goal-item-container" aria-label="Current Goal Item" key={g.id}>
                        <div className="goal-item">
                            <span>{g.goalInput}</span>

                            {editingGoalId === g.id ? (
                                <span className="goal-due-edit-row">
                                    <input
                                        type="date"
                                        className="goal-due-edit-input"
                                        value={editingDueDate}
                                        autoFocus
                                        onChange={(e) => setEditingDueDate(e.target.value)}
                                    />
                                    <button className="task-edit-save" onClick={() => saveEditedGoalDueDate(g.id)}>
                                        Save
                                    </button>
                                    <button className="task-edit-cancel" onClick={cancelEditingGoal}>
                                        Cancel
                                    </button>
                                </span>
                            ) : (
                                <span className="goal-due-display">
                                    <small>Due: {g.dueDate}</small>
                                    <button
                                        className="task-edit-button"
                                        onClick={() => startEditingGoal(g)}
                                        title="Edit due date"
                                        aria-label="Edit due date"
                                    >
                                        ✎
                                    </button>
                                </span>
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default TaskGoalCalendar;
