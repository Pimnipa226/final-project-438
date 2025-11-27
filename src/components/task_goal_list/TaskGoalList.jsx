import React from 'react';
import './TaskGoalList.css'

function TaskGoalList() {

    return (
        <div>
        <h2 className="heading">All/Task/Goal Tab</h2>
            <div className="task-goal-list">
                <div className="goal-item">
                    <p>Goal: Finish Design of Everyday Things Book in 14 days</p>
                    <p>Due Date: 12-10-2025</p>
                </div>
                <div className="task-item">
                    <p>Task: Read Chapter 1</p>
                    <p>Due Date: 12-05-2025</p>
                </div>
                <div className="task-item">
                    <p>Task: Read Chapter 2</p>
                    <p>Due Date: 12-07-2025</p>
                </div>
            </div>
        </div>
    )
    // const [activeTab, setActiveTab] = useState("All");
    // const [items, setItems] = useState([
    //     {id: 1, name: "Task 1", category: "Task", completed: false},
    //     {id: 2, name: "Task 2", category: "Task", completed: false},
    //     {id: 3, name: "Goal 1", category: "Goal", completed: false},
    //     {id: 4, name: "Goal 2", category: "Goal", completed: false},
    // ]);

    // const getFilteredItems = () => {
    //     if (activeTab === "All") {
    //         return items;
    //     }
    //     return items.filter((item) => item.category === activeTab);
    //     }
    //
    // function setActiveTab(tab) {
    //
    // }
    //
    // return (
    //         <div className="task-goal-list">
    //             <div className="task-goal-list-tabs">
    //             <button onClick={() => setActiveTab("All")}>All</button>
    //             <button onClick={() => setActiveTab("Task")}>Tasks</button>
    //             <button onClick={() => setActiveTab("Goal")}>Goals</button>
    //             </div>
    //             <ul>
    //                 {getFilteredItems().map((item) => (
    //                     <li key={item.id}>
    //                         {item.name} <span>{item.category}</span>
    //                     </li>
    //                 ))}
    //             </ul>
    //         </div>
    //
    //         );
    }


export default TaskGoalList;