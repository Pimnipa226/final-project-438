import React, { useState } from 'react';

function TaskGoalList() {
    const [activeTab, setActiveTab] = useState("All");
    const [items, setItems] = useState([
        {id: 1, name: "Task 1", category: "Task", completed: false},
        {id: 2, name: "Task 2", category: "Task", completed: false},
        {id: 3, name: "Goal 1", category: "Goal", completed: false},
        {id: 4, name: "Goal 2", category: "Goal", completed: false},
    ]);

    const getFilteredItems = () => {
        if (activeTab === "All") {
            return items;
        }
        return items.filter((item) => item.category === activeTab);
        }

        return (
            <div className="task-goal-list">
                <div className="task-goal-list-tabs">
                <button onClick={() => setActiveTab("All")}>All</button>
                <button onClick={() => setActiveTab("Task")}>Tasks</button>
                <button onClick={() => setActiveTab("Goal")}>Goals</button>
                </div>
                <ul>
                    {getFilteredItems().map((item) => (
                        <li key={item.id}>
                            {item.name} <span>{item.category}</span>
                        </li>
                    ))}
                </ul>
            </div>

            );
    }


export default TaskGoalList;