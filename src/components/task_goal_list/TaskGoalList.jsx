import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {addDoc, query, collection, orderBy, onSnapshot, updateDoc, doc, serverTimestamp, getDocs} from "firebase/firestore";
import { db } from "../../services/firebase.js";
import "./TaskGoalList.css";

function TaskGoalCalendar({ user }) {
    const [selectedDate, setSelectedDate] = useState(new Date());

    // Task input
    const [newTask, setNewTask] = useState("");
    // Tasks from Firebase
    const [tasks, setTasks] = useState([]);

    // Goals input and current goals
    const [goalName, setGoalName] = useState("");
    const [goalDueDate, setGoalDueDate] = useState("");
    const [currentGoal, setCurrentGoal] = useState([]);
    const [pastGoal, setPastGoal] = useState([]);

    // Fetch tasks from Firebase
    useEffect(() => {
        if (!user) return;

        const taskRef = collection(db, "users", user.uid, "tasks");
        const q = query(taskRef, orderBy("date", "asc"));

        const unsubscribe = onSnapshot(q, (snap) => {
            const userTasks = snap.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setTasks(userTasks);
        });

        return () => unsubscribe();
    }, [user]);


    // Save task to Firestore with no past dates
    const saveTask = async () => {
        if (!newTask.trim() || !user) return;

        const today = new Date();
        today.setHours(0, 0, 0, 0); // remove time
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
                createdAt: serverTimestamp()
            });

            setNewTask("");
        } catch (error) {
            console.error("Error saving task:", error);
        }
    };


    // Task completion
    const toggleComplete = async (task) => {
        if (!user) return;

        try {
            const taskRef = doc(db, "users", user.uid, "tasks", task.id);
            await updateDoc(taskRef, { completed: !task.completed });
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };


    // Filter tasks for selected date and sort by most recent
    const isSameDay = (date1, date2) =>
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate();

    const selectedDayTasks = tasks
        .filter(t => isSameDay(new Date(t.date), selectedDate))
        .sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);


    // Fetch goals from Firebase
    useEffect(() => {
        const fetchGoals = async () => {
            if (!user) return;

            try {
                const goalRef = collection(db, "users", user.uid, "goals");
                const q = query(goalRef, orderBy("dueDate", "asc"));
                const snap = await getDocs(q);

                const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                const { beforeToday, afterToday } = splitGoals(data);
                setPastGoal(beforeToday);
                setCurrentGoal(afterToday);
            } catch (error) {
                console.error("Error reading goals:", error);
            }
        };

        fetchGoals();
    }, [user]);

    function splitGoals(goals) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const beforeToday = goals.filter(g => new Date(g.dueDate) < today);
        const afterToday = goals.filter(g => new Date(g.dueDate) >= today);

        return { beforeToday, afterToday };
    }

    // Save goal to Firebase
    const saveGoal = async () => {
        if (!goalName.trim() || !goalDueDate || !user) return;

        try {
            const goalRef = collection(db, "users", user.uid, "goals");
            await addDoc(goalRef, {
                goalInput: goalName,
                dueDate: goalDueDate,
                createdAt: serverTimestamp()
            });

            setGoalName("");
            setGoalDueDate("");
        } catch (error) {
            console.error("Error saving goal: ", error);
        }
    };

    const tileClassName = ({ date, view }) => {
        if (view === "month") {
            const hasTask = tasks.some(t => isSameDay(new Date(t.date), date));
            return hasTask ? "task-day" : null;
        }
        return null;
    };


    return (
        <div className="task-goal-container">
            <div className="welcome-back-container">
            <h1>Welcome back!</h1>
            </div>

            <Calendar
                className="calendar-styling"
                onChange={setSelectedDate}
                value={selectedDate}
                tileClassName={tileClassName}
            />

            {/*<h2>{selectedDate.toDateString()}</h2>*/}

            {/* Add tasks */}
            <h4>Task</h4>
            <div className="add-section">
                <input
                    className="input-field"
                    value={newTask}
                    placeholder="Add task..."
                    onChange={e => setNewTask(e.target.value)}
                />
                <button
                    className="plus-button"
                    onClick={saveTask}
                    disabled={new Date(selectedDate).setHours(0,0,0,0) < new Date().setHours(0,0,0,0)}
                >
                    +
                </button>
            </div>

            {selectedDayTasks.length === 0 ? (
                <p>No tasks</p>
            ) : (
                selectedDayTasks.map(t => (
                    <div key={t.id} className="task-item">
                        <input
                            className="check-box"
                            type="checkbox"
                            checked={t.completed || false}
                            onChange={() => toggleComplete(t)}
                        />
                        <span style={{ textDecoration: t.completed ? "line-through" : "none" }}>
                            {t.text}
                        </span>
                    </div>
                ))
            )}

            <hr className="section-divider" />

            {/* Add goals */}
            <h3>Goal</h3>
            <div className="add-goal-section">
                <input
                    className="input-field2"
                    value={goalName}
                    placeholder="Add goal..."
                    onChange={e => setGoalName(e.target.value)}
                />
                <input
                    className="input-field3"
                    type="date"
                    value={goalDueDate}
                    onChange={e => setGoalDueDate(e.target.value)}
                />
                <button className="plus-button" onClick={saveGoal}>+</button>
            </div>

            <h5>Current Goals</h5>
            {currentGoal.length === 0 ? (
                <p>No current goals</p>
            ) : (
                currentGoal.map(g => (
                    <div className="goal-item-container">
                    <div key={g.id} className="goal-item">
                        <span>{g.goalInput}</span>
                        <small>Due: {g.dueDate}</small>
                    </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default TaskGoalCalendar;
