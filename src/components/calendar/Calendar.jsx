// import React from 'react';
// import Calendar from 'react-calendar';
// import 'react-calendar/dist/Calendar.css';
// import './Calendar.css';
//
//
// function CalendarComponent () {
//     const [ value, onChange ] = React.useState(new Date());
//     //value: the current state
//     //onChange: function to update the state
//     //new Date() initializes the state with the current date and time
//
//     return (
//         <div>
//             <Calendar
//                 onChange={onChange}
//                 // passes the function onChange as a prop to the Calendar
//                 value={value}
//                 //passes the current date value as a prop
//             />
//             <p>Selected date: {value.toDateString()}</p>
//             {/*converts a Date object to a readable string*/}
//         </div>
//     );
// }
//
// export default CalendarComponent;
//
