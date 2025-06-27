// ScheduleModal.js
import React from "react";
import DatePicker from "react-datepicker";
import TimePicker from "react-time-picker";
import "react-datepicker/dist/react-datepicker.css";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full space-y-4">
        <h2 className="text-xl font-semibold text-center">
          Schedule Your Order
        </h2>

        <div>
          <label className="schedule-label">Select Date Range:</label>
          <DatePicker
            selectsRange={true}
            startDate={startDate}
            endDate={endDate}
            onChange={(update) => {
              // Validate for Next-day restriction
              if (preOrderType === "Next-day") {
                const today = new Date();
                const tomorrow = new Date();
                tomorrow.setDate(today.getDate() + 1);

                const selectedStart = update[0];
                if (
                  selectedStart &&
                  selectedStart.toDateString() === today.toDateString()
                ) {
                  alert(
                    "For this merchant, you can only schedule from tomorrow."
                  );
                  return; // Prevent selecting today's date
                }
              }
              setDateRange(update);
            }}
            isClearable={true}
            minDate={
              preOrderType === "Next-day"
                ? new Date(new Date().setDate(new Date().getDate() + 1))
                : null
            } // ✅ Force minimum date
            className="schedule-input"
            calendarClassName="rounded-lg p-2"
            dateFormat="dd/MM/yyyy"
          />
        </div>

        <div>
          <label className="schedule-label">Select Time:</label>
          <TimePicker
            onChange={setSelectedTime}
            value={selectedTime}
            className="schedule-input"
            disableClock={true}
            clearIcon={null}
          />
        </div>

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
