const TimeSlotSelector = ({
  availableSlots = [],
  selectedSlot,
  onSlotSelect,
  date,
}) => {
  // Default time slots if none provided
  const defaultSlots = [
    { time: "09:00 AM", available: true },
    { time: "10:00 AM", available: true },
    { time: "11:00 AM", available: true },
    { time: "12:00 PM", available: false },
    { time: "01:00 PM", available: true },
    { time: "02:00 PM", available: true },
    { time: "03:00 PM", available: true },
    { time: "04:00 PM", available: true },
    { time: "05:00 PM", available: true },
    { time: "06:00 PM", available: false },
    { time: "07:00 PM", available: true },
    { time: "08:00 PM", available: true },
  ];

  const slots = availableSlots.length > 0 ? availableSlots : defaultSlots;

  return (
    <div className="bg-base-100 p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">
        Select Time Slot
        {date && <span className="text-sm text-gray-500 ml-2">({date})</span>}
      </h3>

      {!date && (
        <p className="text-gray-500 text-sm mb-4">Please select a date first</p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {slots.map((slot, index) => (
          <button
            key={index}
            onClick={() => slot.available && onSlotSelect(slot.time)}
            disabled={!slot.available || !date}
            className={`
              p-3 rounded-lg border-2 transition-all text-sm font-medium
              ${
                selectedSlot === slot.time
                  ? "border-primary bg-primary text-white"
                  : "border-gray-200 hover:border-primary"
              }
              ${
                !slot.available || !date
                  ? "opacity-40 cursor-not-allowed"
                  : "cursor-pointer hover:shadow-md"
              }
            `}
          >
            {slot.time}
            {!slot.available && (
              <span className="block text-xs mt-1">Booked</span>
            )}
          </button>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded border-2 border-primary bg-primary"></div>
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded border-2 border-gray-200"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded border-2 border-gray-200 opacity-40"></div>
          <span>Booked</span>
        </div>
      </div>
    </div>
  );
};

export default TimeSlotSelector;
