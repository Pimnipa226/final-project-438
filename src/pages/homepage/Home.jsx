import React from "react";
import TaskGoalList from "../../components/task_goal_list/TaskGoalList.jsx";
import AIChatAssistant from "../../components/AIChatAssistant/AIChatAssistant.jsx";
import RecordStreaks from "../../components/record_streaks/RecordStreaks.jsx";
import { GoogleCalendarProvider } from "../../contexts/GoogleCalendarContext.jsx";
import "./Home.css";

// A user is "first time" if their account was just created in this same
// sign-in — Firebase sets creationTime and lastSignInTime to (essentially)
// the same instant right after sign-up, and they diverge on every login
// after that. A small tolerance handles the few-ms gap between the two
// timestamps being recorded.
const isFirstTimeUser = (user) => {
    const created = user?.metadata?.creationTime;
    const lastSignIn = user?.metadata?.lastSignInTime;
    if (!created || !lastSignIn) return false;
    return Math.abs(new Date(lastSignIn).getTime() - new Date(created).getTime()) < 5000;
};

const Home = ({ user }) => {
    const firstTime = isFirstTimeUser(user);
    // Show only the first name, even though displayName stores the full
    // name entered at sign-up (e.g. "Jane Doe" -> "Jane").
    const firstName = user?.displayName?.trim().split(/\s+/)[0];
    const greeting = firstName
        ? `${firstTime ? "Welcome" : "Welcome back"}, ${firstName}!`
        : `${firstTime ? "Welcome" : "Welcome back"}!`;

    return (
        <GoogleCalendarProvider>
            <div className="home">
                <h1 className="home-greeting" aria-label="Greeting">
                    {greeting}
                </h1>

                <div className="home-main">
                    <div className="tasks-section">
                        <TaskGoalList user={user} />
                    </div>

                    <div className="record-section">
                        <RecordStreaks user={user} />
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
