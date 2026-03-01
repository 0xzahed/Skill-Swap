import React from "react";
import { motion as Motion } from "framer-motion";
import { FaUserPlus, FaSearch, FaHandshake, FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";

const steps = [
  {
    id: 1,
    icon: FaUserPlus,
    title: "Sign Up Free",
    description:
      "Create your free account in seconds and set up your profile with your skills and learning goals.",
    badgeClass: "badge-step-1",
    iconBg: "bg-violet-50 text-violet-600",
  },
  {
    id: 2,
    icon: FaSearch,
    title: "Browse Skills",
    description:
      "Explore thousands of skills offered by vetted experts. Filter by category, price, and rating.",
    badgeClass: "badge-step-2",
    iconBg: "bg-purple-50 text-purple-600",
  },
  {
    id: 3,
    icon: FaHandshake,
    title: "Book a Session",
    description:
      "Pick your preferred tutor, check real-time availability, and confirm your booking in minutes.",
    badgeClass: "badge-step-3",
    iconBg: "bg-pink-50 text-pink-600",
  },
  {
    id: 4,
    icon: FaStar,
    title: "Learn & Grow",
    description:
      "Attend your live session, master new skills, and share your experience with an honest rating.",
    badgeClass: "badge-step-4",
    iconBg: "bg-orange-50 text-orange-600",
  },
];

const HowItWork = () => {
  return (
    <section className="relative bg-base-200 py-20 overflow-hidden">
      {/* bg decoration */}
      <div className="absolute inset-0 hero-grid opacity-40 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            className="text-primary font-semibold text-sm uppercase tracking-widest mb-3"
          >
            Simple process
          </Motion.p>
          <Motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            viewport={{ once: true }}
            className="text-4xl lg:text-5xl font-black text-base-content mb-4"
          >
            How It <span className="text-primary">Works</span>
          </Motion.h2>
          <Motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-base-content/60 text-lg max-w-xl mx-auto"
          >
            Start your learning journey in just four simple steps
          </Motion.p>
        </div>

        {/* Steps */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Connector line (desktop) */}
          <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-0.5 bg-primary/30 pointer-events-none" />

          {steps.map((step, index) => (
            <Motion.div
              key={step.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative flex flex-col items-center text-center"
            >
              {/* Step number badge */}
              <div
                className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center text-white font-black text-lg shadow-lg ${step.badgeClass} mb-6`}
              >
                {step.id}
              </div>

              {/* Card */}
              <div className="bg-base-100 rounded-2xl border border-base-300 p-6 w-full card-lift">
                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 ${step.iconBg}`}>
                  <step.icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-base-content mb-2">{step.title}</h3>
                <p className="text-base-content/60 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </Motion.div>
          ))}
        </div>

        {/* CTA */}
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center mt-14"
        >
          <Link
            to="/auth/register"
            className="btn btn-primary rounded-full px-10 text-white text-base gap-2"
          >
            Get Started Free
          </Link>
        </Motion.div>
      </div>
    </section>
  );
};

export default HowItWork;
