import React, { useState, useEffect, use } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaUser,
  FaEnvelope,
  FaClock,
  FaDollarSign,
  FaCalendarAlt,
  FaShoppingCart,
  FaPlayCircle,
  FaSignal,
  FaUsers,
  FaCheckCircle,
} from "react-icons/fa";
import { AuthContext } from "../providers/AuthProvider";
import toast, { Toaster } from "react-hot-toast";

const SkillDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = use(AuthContext);
  const [skill, setSkill] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkill = () => {
      fetch("/skills.json")
        .then((response) => response.json())
        .then((skills) => {
          const foundSkill = skills.find((s) => s.skillId === parseInt(id));
          if (foundSkill) {
            setSkill(foundSkill);
          } else {
            toast.error("Course not found!");
            navigate("/");
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching skill:", error);
          toast.error("Error loading skill details!");
          setLoading(false);
        });
    };

    fetchSkill();
  }, [id, user, navigate]);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-yellow-400" />);
    }
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-yellow-400" />);
    }
    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-yellow-400" />);
    }
    return stars;
  };

  const handleBuyCourse = () => {
    if (!user) {
      toast.error("Please login to purchase this course!");
      navigate("/auth/login", { state: { from: `/skill/${id}` } });
      return;
    }

    // Simple purchase logic
    const purchase = {
      courseId: skill.skillId,
      courseName: skill.skillName,
      price: skill.price,
      provider: skill.providerName,
      purchaseDate: new Date().toISOString(),
      userName: user.displayName || user.email,
    };

    // Save to localStorage (simple approach)
    const existingPurchases = JSON.parse(
      localStorage.getItem("myCourses") || "[]"
    );

    // Check if already purchased
    const alreadyPurchased = existingPurchases.some(
      (p) => p.courseId === skill.skillId
    );
    if (alreadyPurchased) {
      toast.success("You already own this course!");
      navigate("/my-bookings");
      return;
    }

    existingPurchases.push(purchase);
    localStorage.setItem("myCourses", JSON.stringify(existingPurchases));

    toast.success("Course purchased successfully! 🎉");
    navigate("/my-bookings");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="loading loading-spinner loading-lg text-[#422AD5]"></div>
      </div>
    );
  }

  if (!skill) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-base-content mb-4">
            Skill not found
          </h2>
          <button
            onClick={() => navigate("/")}
            className="btn bg-[#422AD5] text-white hover:bg-[#3a1fb8]"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 py-8">
      <Toaster position="top-right" />

      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-base-100 rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="md:flex">
            <div className="md:w-1/2">
              <img
                src={skill.image}
                alt={skill.skillName}
                className="w-full h-64 md:h-full object-cover"
              />
            </div>
            <div className="md:w-1/2 p-8">
              <div className="uppercase tracking-wide text-sm text-[#422AD5] font-semibold mb-2">
                {skill.category}
              </div>

              <h1 className="text-3xl font-bold text-base-content mb-4">
                {skill.skillName}
              </h1>

              <div className="text-base-content/70 mb-6 leading-relaxed text-justify">
                {skill.description}
              </div>

              <div className="bg-base-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-base-content mb-3 flex items-center gap-2">
                  <FaUser className="text-[#422AD5]" />
                  Provider Information
                </h3>
                <div className="space-y-2">
                  <p className="text-base-content/80">
                    <span className="font-medium">Name:</span>{" "}
                    {skill.providerName}
                  </p>
                  <p className="text-base-content/80 flex items-center gap-2">
                    <FaEnvelope className="text-base-content/60" />
                    {skill.providerEmail}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-4xl font-bold text-green-600">
                    ${skill.price}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex gap-1">{renderStars(skill.rating)}</div>
                  <span className="text-base-content/80 font-medium">
                    {skill.rating} ({skill.students?.toLocaleString()} students)
                  </span>
                </div>
              </div>

              {/* Course Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-3 bg-base-200 rounded-lg">
                  <FaClock className="text-[#422AD5] mx-auto mb-2" />
                  <p className="text-sm font-semibold text-base-content">
                    {skill.duration}
                  </p>
                  <p className="text-xs text-base-content/60">Duration</p>
                </div>
                <div className="text-center p-3 bg-base-200 rounded-lg">
                  <FaPlayCircle className="text-[#422AD5] mx-auto mb-2" />
                  <p className="text-sm font-semibold text-base-content">
                    {skill.lectures} lectures
                  </p>
                  <p className="text-xs text-base-content/60">Lessons</p>
                </div>
                <div className="text-center p-3 bg-base-200 rounded-lg">
                  <FaSignal className="text-[#422AD5] mx-auto mb-2" />
                  <p className="text-sm font-semibold text-base-content">
                    {skill.level}
                  </p>
                  <p className="text-xs text-base-content/60">Level</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Buy Course Section */}
        <div className="bg-base-100 rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-base-content mb-6 text-center">
            What you'll learn
          </h2>

          <div className="max-w-4xl mx-auto">
            {/* Course Includes */}
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <div className="flex items-start gap-3">
                <FaCheckCircle className="text-green-500 mt-1 shrink-0" />
                <p className="text-base-content/80">
                  Lifetime access to course materials
                </p>
              </div>
              <div className="flex items-start gap-3">
                <FaCheckCircle className="text-green-500 mt-1 shrink-0" />
                <p className="text-base-content/80">
                  {skill.lectures} downloadable lectures
                </p>
              </div>
              <div className="flex items-start gap-3">
                <FaCheckCircle className="text-green-500 mt-1 shrink-0" />
                <p className="text-base-content/80">
                  Certificate of completion
                </p>
              </div>
              <div className="flex items-start gap-3">
                <FaCheckCircle className="text-green-500 mt-1 shrink-0" />
                <p className="text-base-content/80">
                  Access on mobile and desktop
                </p>
              </div>
            </div>

            {/* Price and Buy Button */}
            <div className="bg-base-200 rounded-lg p-6 border-2 border-[#422AD5]/20">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-base-content/70 mb-1">Course Price</p>
                  <p className="text-4xl font-bold text-green-600">
                    ${skill.price}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-base-content/70">
                    {skill.students?.toLocaleString()} students
                  </p>
                  <div className="flex items-center gap-1 justify-end">
                    {renderStars(skill.rating)}
                    <span className="text-sm text-base-content/70 ml-2">
                      ({skill.rating})
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleBuyCourse}
                className="w-full bg-[#422AD5] text-white py-4 px-6 rounded-lg font-bold text-lg hover:bg-[#3a1fb8] transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <FaShoppingCart />
                Buy Now
              </button>

              <p className="text-center text-sm text-base-content/70 mt-4">
                30-Day Money-Back Guarantee
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillDetails;
