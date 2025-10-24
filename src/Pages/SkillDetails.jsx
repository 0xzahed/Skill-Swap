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
} from "react-icons/fa";
import { AuthContext } from "../providers/AuthProvider";
import toast, { Toaster } from "react-hot-toast";

const SkillDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = use(AuthContext);
  const [skill, setSkill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    if (!user) {
      navigate("/auth/login", {
        state: { from: `/skill/${id}` },
        replace: true,
      });
      return;
    }

    const fetchSkill = () => {
      fetch("/skills.json")
        .then((response) => response.json())
        .then((skills) => {
          const foundSkill = skills.find((s) => s.skillId === parseInt(id));
          if (foundSkill) {
            setSkill(foundSkill);
            setFormData({
              name: user.displayName || "",
              email: user.email || "",
            });
          } else {
            toast.error("Skill not found!");
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBookSession = (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error("Please fill in all fields!");
      return;
    }

    toast.success("Session booked successfully! We'll contact you soon.");

    setFormData({
      name: user.displayName || "",
      email: user.email || "",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg text-[#422AD5]"></div>
      </div>
    );
  }

  if (!skill) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
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
    <div className="min-h-screen bg-[#F5F3FF] py-8">
      <Toaster position="top-right" />

      <div className="max-w-6xl mx-auto px-4">
        <div className=" rounded-xl shadow-lg overflow-hidden mb-8">
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

              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {skill.skillName}
              </h1>

              <p className="text-gray-600 mb-6 leading-relaxed">
                {skill.description}
              </p>

              <div className=" rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <FaUser className="text-[#422AD5]" />
                  Provider Information
                </h3>
                <div className="space-y-2">
                  <p className="text-gray-700">
                    <span className="font-medium">Name:</span>{" "}
                    {skill.providerName}
                  </p>
                  <p className="text-gray-700 flex items-center gap-2">
                    <FaEnvelope className="text-gray-500" />
                    {skill.providerEmail}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <FaDollarSign className="text-green-600" />
                  <span className="text-3xl font-bold text-gray-900">
                    ${skill.price}
                  </span>
                  <span className="text-gray-600">per session</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex gap-1">{renderStars(skill.rating)}</div>
                  <span className="text-gray-700 font-medium">
                    ({skill.rating})
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-700 mb-6">
                <FaClock className="text-[#422AD5]" />
                <span className="font-medium">Available Slots:</span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                  {skill.slotsAvailable} remaining
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Book Session Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Book a Session
          </h2>

          <form
            onSubmit={handleBookSession}
            className="max-w-md mx-auto space-y-6"
          >
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#422AD5] focus:border-transparent"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#422AD5] focus:border-transparent"
                placeholder="Enter your email address"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#422AD5] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#3a1fb8] transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <FaClock />
              Book Session
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SkillDetails;
