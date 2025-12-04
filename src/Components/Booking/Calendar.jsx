import { useState } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  isToday,
  isPast,
} from "date-fns";

const Calendar = ({ selectedDate, onDateSelect, disabledDates = [] }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="btn btn-sm btn-circle btn-ghost"
        >
          ❮
        </button>
        <h2 className="text-lg font-semibold">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="btn btn-sm btn-circle btn-ghost"
        >
          ❯
        </button>
      </div>
    );
  };

  const renderDays = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return (
      <div className="grid grid-cols-7 gap-2 mb-2">
        {days.map((day, index) => (
          <div
            key={index}
            className="text-center text-sm font-medium text-gray-500"
          >
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const isDisabled =
          isPast(cloneDay) || disabledDates.some((d) => isSameDay(d, cloneDay));
        const isSelected = selectedDate && isSameDay(day, selectedDate);
        const isCurrentMonth = isSameMonth(day, monthStart);
        const isTodayDate = isToday(day);

        days.push(
          <button
            key={day}
            onClick={() => !isDisabled && onDateSelect(cloneDay)}
            disabled={isDisabled}
            className={`
              aspect-square p-2 text-sm rounded-lg transition-all
              ${!isCurrentMonth ? "text-gray-300" : ""}
              ${isSelected ? "bg-primary text-white font-bold" : ""}
              ${isTodayDate && !isSelected ? "bg-primary/10 font-semibold" : ""}
              ${
                isDisabled
                  ? "cursor-not-allowed opacity-40"
                  : "hover:bg-primary/20 cursor-pointer"
              }
            `}
          >
            {format(day, "d")}
          </button>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day} className="grid grid-cols-7 gap-2">
          {days}
        </div>
      );
      days = [];
    }
    return <div className="space-y-2">{rows}</div>;
  };

  return (
    <div className="bg-base-100 p-4 rounded-lg shadow-md">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
};

export default Calendar;
