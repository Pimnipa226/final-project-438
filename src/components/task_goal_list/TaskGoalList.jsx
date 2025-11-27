import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./TaskGoalList.css";

function TaskGoalCalendar() {
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
    const filteredGoals = goals.filter(
        (g) => g.due >= selectedDate && g.createdDate <= selectedDate
    );

    return (
        <div className="task-goal-container">
            <Calendar onChange={setSelectedDate} value={selectedDate} />

            <h3>Tasks on {selectedDate.toDateString()}</h3>
            <div className="add-section">
                <input
                    value={newTask}
                    placeholder="Add task..."
                    onChange={(e) => setNewTask(e.target.value)}
                />
                <button onClick={addTask}>+</button>
            </div>

            {selectedDayTasks.length === 0 ? (
                <p>No tasks</p>
            ) : (
                selectedDayTasks.map((t) => (
                    <div key={t.id} className="task-item">
                        <input type="checkbox" onChange={() => completeTask(t.id)} />
                        <span>{t.text}</span>
                    </div>
                ))
            )}

            <hr />

            <h3>Add Goal (with due date)</h3>
            <div className="add-section">
                <input
                    value={goalName}
                    placeholder="Goal name..."
                    onChange={(e) => setGoalName(e.target.value)}
                />
                <input
                    type="date"
                    value={goalDueDate}
                    onChange={(e) => setGoalDueDate(e.target.value)}
                />
                <button onClick={addGoal}>+</button>
            </div>

            <h4>Goals</h4>
            {filteredGoals.length === 0 ? (
                <p>No goals for this date</p>
            ) : (
                filteredGoals.map((g) => (
                    <div key={g.id} className="goal-item">
                        <span>{g.name}</span>{" "}
                        <small>
                            Due: {g.due.toDateString()} | Set on: {g.createdDate.toDateString()}
                        </small>
                    </div>
                ))
            )}
        </div>
    );
}

export default TaskGoalCalendar;
