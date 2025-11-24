import React, {useState} from "react";
//import NavBar from "../../components/navbar/NavBar.jsx";
//import WeeklyCalendar from "../../components/calendar/WeeklyCalendar.jsx";
//import MonthlyCalendar from "../../components/calendar/MonthlyCalendar.jsx";
//import TaskGoalList from "../../components/task_goal_list/TaskGoalList.jsx";
//import ChatBot from "../../components/chatbot/ChatBot.jsx";
import { useAuth } from "../../contexts/AuthContext";
import "./Home.css"


const Home = () => {
    // const { currentUser } = useAuth();
    //
    // const [weekValue, setWeekValue] = useState(new Date());
    // const [monthValue, setMonthValue] = useState(new Date());

    return (
        <div className="homepage">
            {/*<NavBar />*/}
            <div className="home-content">
                <h1>Welcome back!</h1>
                {/*<div className="weekly-calendar-section">*/}
                {/*    <WeeklyCalendar weekValue={weekValue} setWeekValue={setWeekValue} setMonthValue={setMonthValue} />*/}
                {/*</div>*/}
                {/*    <div className="tasks-section">*/}
                {/*    <TaskGoalList />*/}
                {/*    </div>*/}
                {/*    <div className="monthly-calendar-section">*/}
                {/*        <MonthlyCalendar monthValue={monthValue} setMonthValue={setMonthValue} setWeekValue={setWeekValue} />*/}
                {/*    </div>*/}
                {/*    <div className="chat-section">*/}
                {/*    < ChatBot />*/}
                {/*    </div>*/}
            </div>
        </div>
    )
}

export default Home;