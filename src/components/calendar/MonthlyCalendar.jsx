import React from "react";
import Calendar from "react-calendar";
import "./MonthlyCalendar.css"

const MonthlyCalendar = ({monthValue, setMonthValue, setWeekValue}) => {
    const handleDateChange = (selectedDate) => {
        setMonthValue(selectedDate);
        setWeekValue(selectedDate);
    };

    return (
        <div className="monthly-calendar">
            <h2>{monthValue.toLocaleDateString("en-US", {month: "long", year: "numeric" })}</h2>
            <Calendar value={monthValue} onChange={handleDateChange} />
        </div>
    );
};

export default MonthlyCalendar;