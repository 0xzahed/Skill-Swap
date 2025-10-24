import React from "react";
import { motion as Motion} from "framer-motion";
import { FaUserPlus, FaSearch, FaHandshake, FaStar } from "react-icons/fa";

const HowItWork = () => {
  const steps = [
    {
      id: 1,
      icon: <FaUserPlus className="text-5xl text-[#422AD5]" />,
      title: "Sign Up",
      description:
        "Create your free account and set up your profile with your skills and interests.",
    },
    {
      id: 2,
      icon: <FaSearch className="text-5xl text-[#422AD5]" />,
      title: "Browse Skills",
      description:
        "Explore a wide variety of skills offered by talented providers in your area.",
    },
    {
      id: 3,
      icon: <FaHandshake className="text-5xl text-[#422AD5]" />,
      title: "Book Session",
      description:
        "Choose your preferred skill, check availability, and book a session easily.",
    },
    {
      id: 4,
      icon: <FaStar className="text-5xl text-[#422AD5]" />,
      title: "Learn & Grow",
      description:
        "Attend your session, learn new skills, and share your experience with ratings.",
    },
  ];

  return (
    <div className="bg-gradient-to-b from-white to-[#F5F3FF] py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get started with SkillSwap in just four simple steps and begin your
            learning journey today!
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <Motion.div
              key={step.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: false }}
              className="relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 text-center hover:-translate-y-1"
            >
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-[#422AD5] text-white rounded-full flex items-center justify-center text-xl font-bold shadow-lg">
                {step.id}
              </div>

              <div className="mb-6 flex justify-center mt-4">{step.icon}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                {step.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {step.description}
              </p>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute -right-4 top-1/2 transform -translate-y-1/2 text-[#422AD5] text-3xl">
                  →
                </div>
              )}
            </Motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="bg-[#422AD5] text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#3319B0] transition-colors duration-300">
            Get Started Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default HowItWork;
