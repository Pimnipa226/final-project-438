import React from "react";
import "./WeeklyCalendar.css"

const getStartOfWeek = (date) => {
    const copy = new Date(date);
    const day = copy.getDay();
    copy.setDate(copy.getDate() - day);
    return copy;
};

const WeeklyCalendar = ({ weekValue, setWeekValue, setMonthValue }) => {
    const start = getStartOfWeek(weekValue);
    const weekDays = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(start);
        date.setDate(start.getDate() + i);
        return date;
    });

    const isToday = (day) => day.toDateString() === new Date().toDateString()

        const handleDayClick = (date) => {
        setWeekValue(date);
        setMonthValue(date);
    };

    return (
        <div className="weekly-calendar">
            <div className="week-row">
                {weekDays.map((date) => (
                    <div
                    key={date.toISOString()}
                    className={`day-box ${isToday(date)} ? "today" : ""}`}
                    onClick={() => handleDayClick(date)}
                    >
                        {date.toLocaleDateString("en-US", {
                        weekday: "short",
                            day: "numeric",
                        })}
                    </div>
                ))}

            </div>
        </div>
    );
};

export default WeeklyCalendar;