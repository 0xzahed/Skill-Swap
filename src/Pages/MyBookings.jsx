import { useState, use, useEffect } from "react";
import { AuthContext } from "../providers/AuthProvider";
import {
  FaCalendarAlt,
  FaClock,
  FaDollarSign,
  FaUser,
  FaTimes,
  FaCheckCircle,
  FaPlayCircle,
} from "react-icons/fa";
import { format } from "date-fns";
import toast from "react-hot-toast";

const MyBookings = () => {
  const { user } = use(AuthContext);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    // Load purchased courses from localStorage
    const myCourses = JSON.parse(localStorage.getItem("myCourses") || "[]");
    setCourses(myCourses);
  }, []);

  const handleRemoveCourse = (courseId) => {
    if (window.confirm("Are you sure you want to remove this course?")) {
      const updatedCourses = courses.filter((c) => c.courseId !== courseId);
      setCourses(updatedCourses);
      localStorage.setItem("myCourses", JSON.stringify(updatedCourses));
      toast.success("Course removed successfully!");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F5F3FF] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Please login to view your courses
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F3FF] py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Courses</h1>
          <p className="text-gray-600">
            Access your purchased courses and continue learning
          </p>
        </div>

        {/* Courses List */}
        {courses.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg mb-4">
              You haven't purchased any courses yet
            </p>
            <a
              href="/service"
              className="inline-block bg-[#422AD5] text-white px-6 py-3 rounded-lg hover:bg-[#3a1fb8] transition-colors"
            >
              Browse Courses
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {courses.map((course) => (
              <div
                key={course.courseId}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <FaCheckCircle className="text-green-500" />
                      <span className="text-sm text-green-600 font-medium">
                        Purchased
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {course.courseName}
                    </h3>

                    <div className="flex items-center gap-2 text-gray-600 mb-3">
                      <FaUser className="text-[#422AD5]" />
                      <span>{course.provider}</span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <FaCalendarAlt className="text-[#422AD5]" />
                        <span>
                          Purchased:{" "}
                          {format(
                            new Date(course.purchaseDate),
                            "MMM dd, yyyy"
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FaDollarSign className="text-green-600" />
                        <span className="font-semibold">${course.price}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3">
                      <button className="px-6 py-2 bg-[#422AD5] text-white rounded-lg hover:bg-[#3a1fb8] transition-colors flex items-center gap-2">
                        <FaPlayCircle />
                        Start Learning
                      </button>
                      <button
                        onClick={() => handleRemoveCourse(course.courseId)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
