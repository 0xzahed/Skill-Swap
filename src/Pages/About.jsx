import React from "react";
import { motion } from "framer-motion";
import {
  FaHandshake,
  FaGlobe,
  FaLightbulb,
} from "react-icons/fa";

const About = () => {

  const features = [
    {
      icon: <FaGlobe className="text-4xl text-[#422AD5] mb-4" />,
      title: "Global Community",
      description:
        "Connect with learners and tutors from around the world in our diverse skill-sharing community.",
    },
    {
      icon: <FaLightbulb className="text-4xl text-[#422AD5] mb-4" />,
      title: "Learn Anything",
      description:
        "From coding and design to cooking and music - find experts in virtually any skill you want to learn.",
    },
    {
      icon: <FaHandshake className="text-4xl text-[#422AD5] mb-4" />,
      title: "Trusted Platform",
      description:
        "Secure payments, verified tutors, and a rating system ensure quality learning experiences.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <motion.section
        className="bg-gradient-to-r from-[#422AD5] to-[#3319B0] text-white py-20 px-4"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: false }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            About SkillSwap
          </h1>
          <p className="text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto leading-relaxed">
            Empowering people to learn, grow, and share knowledge through our
            innovative skill-sharing platform
          </p>
        </div>
      </motion.section>

      {/* Mission Section */}
      <motion.section
        className="py-16 px-4"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: false }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                At SkillSwap, we believe that everyone has something valuable to
                teach and something new to learn. Our mission is to create a
                world where knowledge flows freely, connecting passionate
                learners with expert tutors across all disciplines.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                We're breaking down barriers to education by making high-quality
                learning accessible, affordable, and flexible for everyone,
                everywhere.
              </p>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop"
                alt="Team collaboration"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        className="py-16 px-4"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: false }}
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
            Why Choose SkillSwap?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center bg-white p-8 rounded-xl shadow-lg hover:shadow-xl "
              >
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

    </div>
  );
};

export default About;
