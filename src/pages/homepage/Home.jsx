import React from "react";
import NavBar from "../../components/navbar/NavBar.jsx";
import TaskGoalList from "../../components/task_goal_list/TaskGoalList.jsx";
import ChatBot from "../../components/chatbot/ChatBot.jsx";
import "./Home.css"


const Home = () => {
    return (
        <div className="home">

            <div className="home-main">
                <div className="tasks-section">
                    <TaskGoalList />
                </div>

                <div className="chat-section">
                    <ChatBot />
                </div>
            </div>
        </div>
    );
};


export default Home;