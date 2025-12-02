import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
// Import Firestore functions for creating documents and generating a server timestamp.
import {doc, addDoc, setDoc, getDoc, getDocs, deleteDoc, serverTimestamp, query, collection, orderBy} from 'firebase/firestore';
// Import the initialized Firestore database instance from your configuration file.
import { db, auth, app } from "../../services/firebase.js";

import "./TaskGoalList.css";

function TaskGoalCalendar( {user} ) {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState("");

    const [goals, setGoals] = useState([]);
    const [goalName, setGoalName] = useState("");
    const [goalDueDate, setGoalDueDate] = useState("");

    const isSameDay = (date1, date2) =>
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate();

    // Add a new task (cannot add to past dates)
    const addTask = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const selectDate = new Date(selectedDate);
        selectDate.setHours(0, 0, 0, 0);

        if (selectDate < today) {
            alert("Cannot add task to past days!");
            return;
        }

        if (!newTask.trim()) return;
        setTasks([...tasks, { id: Date.now(), text: newTask, date: selectedDate }]);
        setNewTask("");
    };

    const completeTask = (taskId) => {
        setTasks(tasks.filter((t) => t.id !== taskId));
    };

    // Add a new goal
    const addGoal = () => {
        if (!goalName.trim() || !goalDueDate) return;
        const parts = goalDueDate.split("-");
        const dueDate = new Date(parts[0], parts[1] - 1, parts[2]);
        const createdDate = new Date();
        createdDate.setHours(0, 0, 0, 0);

        setGoals([
            ...goals,
            { id: Date.now(), name: goalName, due: dueDate, createdDate },
        ]);

        setGoalName("");
        setGoalDueDate("");
    };

    // Tasks for the selected day
    const selectedDayTasks = tasks.filter((t) => isSameDay(t.date, selectedDate));

    // Goals that are on or after creation date and before/including due date
    const filteredGoals = goals.filter((g) => g.due >= selectedDate &&
        g.createdDate <= selectedDate
    );


    // const saveTask = async () => {
    //     if (newTask && user) {
    //         try {
    //             const taskRef = doc(collection(db, "tasks-goals", user.uid, "tasks"));
    //                 await setDoc(taskRef, {
    //                     userId: auth.currentUser.uid,
    //                     text: newTask,
    //                     date: selectedDate.toISOString(),
    //                     createdAt: serverTimestamp(),
    //                 });
    //
    //                 console.log("Task saved!");
    //             } catch (error) {
    //                 console.error("Error saving task:", error);
    //             }
    //         }
    //     }
    // }

    const saveGoal = async () => {

        if (goalName && goalDueDate && user) {
            try {
                const goalRef = collection(db, "users",user.uid, "goals");

                await addDoc(goalRef, {
                    goalInput: goalName,
                    dueDate: goalDueDate,
                    createdAt: serverTimestamp(),

                });
                console.log("Goal saved!");
            } catch (error) {
                console.error("Error saving goal: ", error);
            }
        }
    };

    return (
        < div className="task-goal-container">
            <h1>Welcome back + Username!</h1>
            <Calendar className="calendar-styling" onChange={setSelectedDate} value={selectedDate}/>
            <h2>{selectedDate.toDateString()}</h2>
            <div className="add-task-text">
                <p>Add Tasks</p>
            </div>

            <div className="add-section">
                <input className="input-field"
                       value={newTask}
                       placeholder="Add task..."
                       onChange={(e) => setNewTask(e.target.value)}
                />
                <button className="plus-button" onClick={addTask}>+</button>
            </div>

            <h4>Tasks</h4>
            {selectedDayTasks.length === 0 ? (
                <p>No tasks</p>
            ) : (
                selectedDayTasks.map((t) => (
                    <div key={t.id} className="task-item">
                        <input className="check-box" type="checkbox" onChange={() => completeTask(t.id)}/>
                        <span>{t.text}</span>
                    </div>
                ))
            )
            }

            <hr/>


            <h3>Add Goal</h3>
            <div className="add-goal-section">
                <input className="input-field2"
                       value={goalName}
                       placeholder="Add goal..."
                       onChange={(e) => setGoalName(e.target.value)}
                />
                <input className="input-field3"
                       type="date"
                       value={goalDueDate}
                       onChange={(e) => setGoalDueDate(e.target.value)}
                />
                <button className="plus-button" onClick={() => {
                    addGoal();
                    saveGoal();
                }}>+</button>
            </div>

            <h4>Goals</h4>
            {filteredGoals.length === 0 ? (
                <p>No goals for today!</p>
            ) : (
                filteredGoals.map((g) => (
                    <div key={g.id} className="goal-item">
                        <span>{g.name}</span>{" "}
                        <small>
                            Due: {g.due.toDateString()} | Set on: {g.createdDate.toDateString()}
                        </small>
                    </div>
                ))
            )
            }
        </div>
    );
}


export default TaskGoalCalendar;
