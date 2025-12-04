# Complete Booking System Implementation

**Document Version:** 1.0  
**Date:** November 26, 2025  
**Phase:** 2 - Core Features

---

## Table of Contents

1. [Booking Flow](#booking-flow)
2. [Calendar Integration](#calendar-integration)
3. [Availability Management](#availability-management)
4. [Email Notifications](#email-notifications)
5. [Implementation](#implementation)

---

## Booking Flow

### **Complete User Journey**

```
1. Browse Skills
   ↓
2. Select Skill → View Details
   ↓
3. Check Provider Availability
   ↓
4. Select Date & Time Slot
   ↓
5. Fill Booking Form
   ↓
6. Review & Confirm
   ↓
7. Payment Processing
   ↓
8. Booking Confirmed
   ↓
9. Email Confirmation Sent
   ↓
10. Calendar Invite Sent
```

---

## Implementation

### **Enhanced Booking Page**

**File:** `src/Pages/EnhancedSkillDetails.jsx`

```jsx
import React, { useState, useEffect, use } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../providers/AuthProvider";
import Calendar from "../Components/Booking/Calendar";
import TimeSlotSelector from "../Components/Booking/TimeSlotSelector";
import BookingForm from "../Components/Booking/BookingForm";
import toast from "react-hot-toast";
import api from "../services/api";

const EnhancedSkillDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = use(AuthContext);

  const [skill, setSkill] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [availability, setAvailability] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/auth/login", { state: { from: `/skill/${id}` } });
      return;
    }

    loadSkillData();
  }, [id, user]);

  const loadSkillData = async () => {
    try {
      const [skillRes, availRes] = await Promise.all([
        api.get(`/skills/${id}`),
        api.get(`/skills/${id}/availability`),
      ]);

      setSkill(skillRes.data);
      setAvailability(availRes.data);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to load skill details");
      navigate("/");
    }
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
  };

  const handleBooking = async (bookingData) => {
    try {
      const response = await api.post("/bookings", {
        skillId: skill.skillId,
        providerId: skill.providerId,
        date: selectedDate,
        slot: selectedSlot,
        ...bookingData,
      });

      // Redirect to payment
      navigate("/checkout", {
        state: {
          bookingData: {
            bookingId: response.data.bookingId,
            skillId: skill.skillId,
            skillName: skill.skillName,
            providerName: skill.providerName,
            date: selectedDate,
            time: `${selectedSlot.startTime} - ${selectedSlot.endTime}`,
            amount: skill.price,
          },
        },
      });
    } catch (error) {
      toast.error("Booking failed. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Skill Info Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <img
                src={skill.image}
                alt={skill.skillName}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-4">{skill.skillName}</h1>
              <p className="text-gray-600 mb-4">{skill.description}</p>
              <div className="space-y-2">
                <p>
                  <strong>Provider:</strong> {skill.providerName}
                </p>
                <p>
                  <strong>Price:</strong> ${skill.price}/session
                </p>
                <p>
                  <strong>Duration:</strong> {skill.duration.perSession} minutes
                </p>
                <p>
                  <strong>Rating:</strong> ⭐ {skill.rating}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6">Book a Session</h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Calendar */}
            <div>
              <h3 className="font-semibold mb-4">Select Date</h3>
              <Calendar
                availability={availability}
                selectedDate={selectedDate}
                onSelectDate={handleDateSelect}
              />
            </div>

            {/* Time Slots */}
            <div>
              <h3 className="font-semibold mb-4">
                {selectedDate ? "Select Time Slot" : "Choose a date first"}
              </h3>
              {selectedDate && (
                <TimeSlotSelector
                  date={selectedDate}
                  slots={availability[selectedDate] || []}
                  selectedSlot={selectedSlot}
                  onSelectSlot={handleSlotSelect}
                />
              )}
            </div>
          </div>

          {/* Booking Form */}
          {selectedDate && selectedSlot && (
            <div className="mt-8 border-t pt-6">
              <h3 className="font-semibold mb-4">Confirm Booking</h3>
              <BookingForm
                skill={skill}
                date={selectedDate}
                slot={selectedSlot}
                onSubmit={handleBooking}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedSkillDetails;
```

### **Calendar Component**

**File:** `src/Components/Booking/Calendar.jsx`

```jsx
import React, { useState } from "react";
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  isSameMonth,
  isToday,
  isBefore,
  startOfToday,
} from "date-fns";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Calendar = ({ availability, selectedDate, onSelectDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const today = startOfToday();

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const previousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
  };

  const hasAvailability = (date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return availability[dateStr]?.some((slot) => slot.available);
  };

  const isSelectable = (date) => {
    return !isBefore(date, today) && hasAvailability(date);
  };

  return (
    <div className="bg-white rounded-lg border p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={previousMonth}
          className="p-2 hover:bg-gray-100 rounded"
        >
          <FaChevronLeft />
        </button>
        <h3 className="text-lg font-semibold">
          {format(currentMonth, "MMMM yyyy")}
        </h3>
        <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded">
          <FaChevronRight />
        </button>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-gray-600 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const selectable = isSelectable(day);
          const selected =
            selectedDate &&
            format(day, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");
          const todayDate = isToday(day);
          const currentMonthDay = isSameMonth(day, currentMonth);

          return (
            <button
              key={day.toString()}
              onClick={() => selectable && onSelectDate(day)}
              disabled={!selectable}
              className={`
                aspect-square p-2 text-sm rounded-lg transition
                ${!currentMonthDay ? "text-gray-300" : ""}
                ${todayDate ? "font-bold" : ""}
                ${selected ? "bg-[#422AD5] text-white" : ""}
                ${
                  selectable && !selected
                    ? "hover:bg-purple-50 cursor-pointer"
                    : ""
                }
                ${!selectable ? "text-gray-300 cursor-not-allowed" : ""}
              `}
            >
              {format(day, "d")}
              {selectable && !selected && (
                <div className="w-1 h-1 bg-green-500 rounded-full mx-auto mt-1" />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex items-center gap-4 text-xs text-gray-600">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-gray-300 rounded-full" />
          <span>Unavailable</span>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
```

### **Time Slot Selector**

**File:** `src/Components/Booking/TimeSlotSelector.jsx`

```jsx
import React from "react";
import { FaClock } from "react-icons/fa";

const TimeSlotSelector = ({ date, slots, selectedSlot, onSelectSlot }) => {
  if (!slots || slots.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No available slots for this date
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {slots.map((slot, index) => {
        const isSelected = selectedSlot?.startTime === slot.startTime;
        const isAvailable = slot.available;

        return (
          <button
            key={index}
            onClick={() => isAvailable && onSelectSlot(slot)}
            disabled={!isAvailable}
            className={`
              p-4 rounded-lg border-2 transition
              ${
                isSelected ? "border-[#422AD5] bg-purple-50" : "border-gray-200"
              }
              ${
                isAvailable
                  ? "hover:border-[#422AD5] cursor-pointer"
                  : "opacity-50 cursor-not-allowed"
              }
            `}
          >
            <div className="flex items-center gap-2 justify-center">
              <FaClock
                className={isSelected ? "text-[#422AD5]" : "text-gray-500"}
              />
              <span
                className={`font-semibold ${
                  isSelected ? "text-[#422AD5]" : ""
                }`}
              >
                {slot.startTime}
              </span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {slot.duration} min
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default TimeSlotSelector;
```

### **Booking Form Component**

**File:** `src/Components/Booking/BookingForm.jsx`

```jsx
import React, { useState, use } from "react";
import { AuthContext } from "../../providers/AuthProvider";
import { format } from "date-fns";

const BookingForm = ({ skill, date, slot, onSubmit }) => {
  const { user } = use(AuthContext);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    await onSubmit({
      studentMessage: message,
    });

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      {/* Summary */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="font-semibold mb-4">Booking Summary</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Skill:</span>
            <span className="font-medium">{skill.skillName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Provider:</span>
            <span className="font-medium">{skill.providerName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Date:</span>
            <span className="font-medium">{format(date, "MMMM dd, yyyy")}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Time:</span>
            <span className="font-medium">
              {slot.startTime} - {slot.endTime}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Duration:</span>
            <span className="font-medium">{slot.duration} minutes</span>
          </div>
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between text-lg">
              <span className="font-semibold">Total:</span>
              <span className="font-bold text-[#422AD5]">${skill.price}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Message to Provider */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Message to Provider (Optional)
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Any special requirements or questions?"
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#422AD5]"
          rows="4"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#422AD5] text-white py-3 rounded-lg font-semibold hover:bg-[#3319B0] disabled:opacity-50 transition"
      >
        {loading ? "Processing..." : "Proceed to Payment"}
      </button>

      <p className="text-xs text-gray-500 text-center">
        By proceeding, you agree to our Terms of Service and Cancellation Policy
      </p>
    </form>
  );
};

export default BookingForm;
```

---

## Calendar Integration

### **Google Calendar API**

**Add to Calendar Feature:**

```javascript
// Generate Google Calendar link
const generateCalendarLink = (booking) => {
  const startDateTime = new Date(`${booking.date} ${booking.slot.startTime}`);
  const endDateTime = new Date(
    startDateTime.getTime() + booking.duration * 60000
  );

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `${booking.skillName} Session`,
    dates: `${formatGoogleDate(startDateTime)}/${formatGoogleDate(
      endDateTime
    )}`,
    details: `Session with ${booking.providerName}\n\nMeeting Link: ${booking.meetingLink}`,
    location: booking.meetingLink || "Online",
  });

  return `https://calendar.google.com/calendar/render?${params}`;
};

const formatGoogleDate = (date) => {
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
};
```

---

## Email Notifications

### **Email Templates**

**File:** `backend/functions/src/services/email.service.js`

```javascript
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

class EmailService {
  async sendBookingConfirmation(booking) {
    const msg = {
      to: booking.studentEmail,
      from: "noreply@skillswap.com",
      subject: `Booking Confirmed: ${booking.skillName}`,
      html: `
        <h2>Your booking is confirmed!</h2>
        <p>Hi ${booking.studentName},</p>
        <p>Your session with ${booking.providerName} has been confirmed.</p>
        
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>${booking.skillName}</h3>
          <p><strong>Date:</strong> ${booking.date}</p>
          <p><strong>Time:</strong> ${booking.time}</p>
          <p><strong>Duration:</strong> ${booking.duration} minutes</p>
          <p><strong>Meeting Link:</strong> <a href="${booking.meetingLink}">${booking.meetingLink}</a></p>
        </div>
        
        <p><a href="${booking.calendarLink}" style="background: #422AD5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Add to Calendar</a></p>
        
        <p>See you soon!</p>
      `,
    };

    await sgMail.send(msg);
  }

  async sendBookingReminder(booking) {
    const msg = {
      to: booking.studentEmail,
      from: "noreply@skillswap.com",
      subject: `Reminder: Session in 24 hours`,
      html: `
        <h2>Session Reminder</h2>
        <p>Hi ${booking.studentName},</p>
        <p>This is a reminder that you have a session with ${booking.providerName} tomorrow.</p>
        <p><strong>Time:</strong> ${booking.time}</p>
        <p><a href="${booking.meetingLink}">Join Meeting</a></p>
      `,
    };

    await sgMail.send(msg);
  }

  async sendCancellationEmail(booking) {
    // Email to both student and provider
  }
}

module.exports = new EmailService();
```

---

## My Bookings Page

**File:** `src/Pages/MyBookings.jsx`

```jsx
import React, { useState, useEffect, use } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { FaClock, FaCheckCircle, FaTimes } from "react-icons/fa";
import api from "../services/api";
import toast from "react-hot-toast";

const MyBookings = () => {
  const { user } = use(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadBookings();
    }
  }, [user, filter]);

  const loadBookings = async () => {
    try {
      const response = await api.get(`/bookings?status=${filter}`);
      setBookings(response.data);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to load bookings");
    }
  };

  const handleCancel = async (bookingId) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    try {
      await api.delete(`/bookings/${bookingId}`);
      toast.success("Booking cancelled successfully");
      loadBookings();
    } catch (error) {
      toast.error("Cancellation failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">My Bookings</h1>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {["all", "upcoming", "completed", "cancelled"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === status
                  ? "bg-[#422AD5] text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  <img
                    src={booking.skillImage}
                    alt={booking.skillName}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="text-xl font-bold">{booking.skillName}</h3>
                    <p className="text-gray-600">with {booking.providerName}</p>
                    <div className="mt-2 space-y-1 text-sm">
                      <p>
                        <FaClock className="inline mr-2" />
                        {booking.date} at {booking.time}
                      </p>
                      <p>
                        Status:{" "}
                        <span
                          className={`font-semibold ${
                            booking.status === "confirmed"
                              ? "text-green-600"
                              : booking.status === "cancelled"
                              ? "text-red-600"
                              : "text-yellow-600"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-bold text-[#422AD5]">
                    ${booking.amount}
                  </p>
                  {booking.status === "confirmed" && (
                    <button
                      onClick={() => handleCancel(booking.id)}
                      className="mt-2 text-red-600 hover:text-red-700 text-sm"
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {bookings.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No bookings found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBookings;
```

---

**Next Document:** Proceed to `ADMIN_DASHBOARD.md` for admin panel features.
