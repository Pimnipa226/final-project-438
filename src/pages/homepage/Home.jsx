import React from "react";
import TaskGoalList from "../../components/task_goal_list/TaskGoalList.jsx";
import AIChatAssistant from "../../components/AIChatAssistant/AIChatAssistant.jsx";
import { GoogleCalendarProvider } from "../../contexts/GoogleCalendarContext.jsx";
import "./Home.css";

const Home = ({ user }) => {
    return (
        <GoogleCalendarProvider>
            <div className="home">
                <div className="home-main">
                    <div className="tasks-section">
                        <TaskGoalList user={user} />
                    </div>

                    <div className="chat-section">
                        <AIChatAssistant user={user} />
                    </div>
                </div>
            </div>
        </GoogleCalendarProvider>
    );
};

export default Home;
