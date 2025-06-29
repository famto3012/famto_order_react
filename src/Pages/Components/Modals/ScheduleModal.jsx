// // ScheduleModal.js
// import React from "react";
// import DatePicker from "react-datepicker";
// import TimePicker from "react-time-picker";
// import "react-datepicker/dist/react-datepicker.css";
// import "react-time-picker/dist/TimePicker.css";
// import "react-clock/dist/Clock.css";
// import "../../../styles/Common/scheduleSelector.css";

// const ScheduleModal = ({
//   show,
//   onClose,
//   startDate,
//   endDate,
//   setDateRange,
//   selectedTime,
//   setSelectedTime,
//   preOrderType,
//   onConfirmSchedule,
// }) => {
//   if (!show) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//       <div className="bg-white p-6 rounded-lg max-w-md w-full space-y-4">
//         <h2 className="text-xl font-semibold text-center">
//           Schedule Your Order
//         </h2>

//         <div>
//           <label className="schedule-label">Select Date Range:</label>
//           <DatePicker
//             selectsRange={true}
//             startDate={startDate}
//             endDate={endDate}
//             onChange={(update) => {
//               // Validate for Next-day restriction
//               if (preOrderType === "Next-day") {
//                 const today = new Date();
//                 const tomorrow = new Date();
//                 tomorrow.setDate(today.getDate() + 1);

//                 const selectedStart = update[0];
//                 if (
//                   selectedStart &&
//                   selectedStart.toDateString() === today.toDateString()
//                 ) {
//                   alert(
//                     "For this merchant, you can only schedule from tomorrow."
//                   );
//                   return; // Prevent selecting today's date
//                 }
//               }
//               setDateRange(update);
//             }}
//             isClearable={true}
//             minDate={
//               preOrderType === "Next-day"
//                 ? new Date(new Date().setDate(new Date().getDate() + 1))
//                 : null
//             } // ✅ Force minimum date
//             className="schedule-input"
//             calendarClassName="rounded-lg p-2"
//             dateFormat="dd/MM/yyyy"
//           />
//         </div>

//         <div>
//           <label className="schedule-label">Select Time:</label>
//           <TimePicker
//             onChange={setSelectedTime}
//             value={selectedTime}
//             className="schedule-input"
//             disableClock={true}
//             clearIcon={null}
//           />
//         </div>

//         <div className="flex justify-between mt-4">
//           <button className="bg-gray-300 px-4 py-2 rounded" onClick={onClose}>
//             Cancel
//           </button>
//           <button
//             className="bg-teal-500 text-white px-4 py-2 rounded"
//             onClick={onConfirmSchedule}
//           >
//             Confirm Schedule
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ScheduleModal;


// ScheduleModal.js
import React from "react";
import "../../../styles/Common/scheduleSelector.css";

const ScheduleModal = ({
  show,
  onClose,
  startDate,
  endDate,
  setDateRange,
  selectedTime,
  setSelectedTime,
  preOrderType,
  onConfirmSchedule,
}) => {
  if (!show) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const minDate =
    preOrderType === "Next-day"
      ? tomorrow.toISOString().split("T")[0]
      : today.toISOString().split("T")[0];

  const handleStartDateChange = (e) => {
    const selectedStart = new Date(e.target.value);

    if (preOrderType === "Next-day" && selectedStart <= today) {
      alert("For this merchant, you can only schedule from tomorrow.");
      return;
    }

    setDateRange([selectedStart, endDate]);
  };

  const handleEndDateChange = (e) => {
    const selectedEnd = new Date(e.target.value);

    if (preOrderType === "Next-day" && selectedEnd <= today) {
      alert("For this merchant, you can only schedule from tomorrow.");
      return;
    }

    if (startDate && selectedEnd < startDate) {
      alert("End date cannot be before start date.");
      return;
    }

    setDateRange([startDate, selectedEnd]);
  };

  return (
    <div className="fixed inset-0 bg-zinc-100 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full space-y-4">
        <h2 className="text-xl font-semibold text-center">
          Schedule Your Order
        </h2>

        <p className="text-gray-300">Select start date and end date as same for single day schedule</p>

        {/* Start Date */}
        <div>
          <label className="schedule-label">Select Start Date:</label>
          <input
            type="date"
            className="schedule-input"
            min={minDate}
            value={startDate ? startDate.toISOString().split("T")[0] : ""}
            onChange={handleStartDateChange}
          />
        </div>

        {/* End Date */}
        <div>
          <label className="schedule-label">Select End Date:</label>
          <input
            type="date"
            className="schedule-input"
            min={startDate ? startDate.toISOString().split("T")[0] : minDate}
            value={endDate ? endDate.toISOString().split("T")[0] : ""}
            onChange={handleEndDateChange}
          />
        </div>

        {/* Time */}
        <div>
          <label className="schedule-label">Select Time:</label>
          <input
            type="time"
            className="schedule-input"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-4">
          <button className="bg-gray-300 px-4 py-2 rounded" onClick={onClose}>
            Cancel
          </button>
          <button
            className="bg-teal-500 text-white px-4 py-2 rounded"
            onClick={onConfirmSchedule}
          >
            Confirm Schedule
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleModal;
