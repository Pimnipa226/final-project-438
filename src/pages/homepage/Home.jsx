import React, {useState} from "react";
import NavBar from "../../components/navbar/NavBar.jsx";
//import WeeklyCalendar from "../../components/calendar/WeeklyCalendar.jsx";
//import MonthlyCalendar from "../../components/calendar/MonthlyCalendar.jsx";
import TaskGoalList from "../../components/task_goal_list/TaskGoalList.jsx";
import ChatBot from "../../components/chatbot/ChatBot.jsx";
//import { useAuth } from "../../contexts/AuthContext";
import "./Home.css"
import CalendarComponent from "../../components/calendar/Calendar.jsx";


const Home = () => {
    // const { currentUser } = useAuth();


    return (
        <div className="home">
            <NavBar />
            <div className="homepage">
                <h1>Welcome back + Username!</h1>
                <div className="home-content">

                    <div className="weekly-calendar-section">
                        {/*<WeeklyCalendar weekValue={weekValue} setWeekValue={setWeekValue} setMonthValue={setMonthValue} />*/}
                        < CalendarComponent/>
                    </div>
                    </div>
                        <div className="tasks-section">
                            <TaskGoalList />
                        </div>
                </div>

                <div className="chat-section">
                    <p>Chat with AI Assistant</p>
                        < ChatBot />
                </div>
        </div>
    );
}

export default Home;