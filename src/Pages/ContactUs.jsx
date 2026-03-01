import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock, FaWhatsapp } from "react-icons/fa";
import { FiSend, FiUser, FiMessageSquare } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";

const contactCards = [
  {
    icon: FaEnvelope,
    title: "Email",
    lines: ["support@skillswap.com", "info@skillswap.com"],
    color: "text-blue-600 bg-blue-50",
    href: "mailto:support@skillswap.com",
  },
  {
    icon: FaPhone,
    title: "Phone",
    lines: ["+880 1744546898"],
    color: "text-green-600 bg-green-50",
    href: "tel:+8801744546898",
  },
  {
    icon: FaWhatsapp,
    title: "WhatsApp",
    lines: ["+880 1744546898", "Available 9AM – 9PM"],
    color: "text-emerald-600 bg-emerald-50",
    href: "https://wa.me/8801744546898",
  },
  {
    icon: FaMapMarkerAlt,
    title: "Office",
    lines: ["Mirpur 10, Dhaka", "Bangladesh"],
    color: "text-red-500 bg-red-50",
  },
  {
    icon: FaClock,
    title: "Working Hours",
    lines: ["Mon – Fri: 9AM – 6PM", "Sat – Sun: 10AM – 4PM"],
    color: "text-purple-600 bg-purple-50",
  },
];

const ContactUs = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate async submission
    setTimeout(() => {
      toast.success("Message sent! We'll get back to you soon. ✉️");
      setForm({ name: "", email: "", subject: "", message: "" });
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="bg-base-100 min-h-screen">
      <Toaster position="top-right" />

      {/* Hero */}
      <motion.section
        className="relative bg-primary text-white py-20 px-4 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="absolute inset-0 hero-grid opacity-20" />
        <div className="relative max-w-3xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/70 text-sm font-semibold uppercase tracking-widest mb-3"
          >
            Let's talk
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-4xl md:text-5xl font-black mb-4"
          >
            Contact Us
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="text-white/75 text-lg"
          >
            Questions, feedback, or partnership inquiries — we&apos;d love to hear from you.
          </motion.p>
        </div>
      </motion.section>

      {/* Contact cards */}
      <section className="py-14 px-4 bg-base-200">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {contactCards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              viewport={{ once: true }}
              className="bg-base-100 border border-base-300 rounded-2xl p-5 card-lift text-center"
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 ${card.color}`}>
                <card.icon size={20} />
              </div>
              <h3 className="font-bold text-base-content text-sm mb-2">{card.title}</h3>
              {card.lines.map((line, j) => (
                <p key={j} className="text-base-content/55 text-xs">{line}</p>
              ))}
              {card.href && (
                <a
                  href={card.href}
                  target={card.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex text-xs font-semibold text-primary hover:underline"
                >
                  Reach out →
                </a>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Form + map */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-start">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55 }}
            viewport={{ once: true }}
          >
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-2">
              Send a message
            </p>
            <h2 className="text-3xl font-black text-base-content mb-6">
              We read every <span className="text-primary">message</span>
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold text-base-content/60 flex items-center gap-1.5">
                    <FiUser size={12} /> Full Name
                  </span>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Jane Smith"
                    className="input input-bordered w-full bg-base-100 border-base-300 focus:border-primary text-sm"
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold text-base-content/60 flex items-center gap-1.5">
                    <FaEnvelope size={12} /> Email
                  </span>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="jane@example.com"
                    className="input input-bordered w-full bg-base-100 border-base-300 focus:border-primary text-sm"
                  />
                </label>
              </div>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-base-content/60">Subject</span>
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  required
                  placeholder="How can we help?"
                  className="input input-bordered w-full bg-base-100 border-base-300 focus:border-primary text-sm"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-base-content/60 flex items-center gap-1.5">
                  <FiMessageSquare size={12} /> Message
                </span>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="Write your message here..."
                  className="textarea textarea-bordered w-full bg-base-100 border-base-300 focus:border-primary text-sm resize-none"
                />
              </label>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary rounded-full px-8 text-white gap-2 w-full sm:w-auto"
              >
                {loading ? (
                  <span className="loading loading-spinner loading-sm" />
                ) : (
                  <>
                    <FiSend size={14} /> Send Message
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Right side — decorative */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="rounded-3xl overflow-hidden border border-base-300 shadow-lg h-64">
              <iframe
                title="SkillSwap Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.0213789394!2d90.35869!3d23.80529!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c132e6c13bdb%3A0x5b56cab3e9b5c4e3!2sMirpur%2010%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1700000000000"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* FAQ teaser */}
            <div className="bg-base-200 rounded-2xl border border-base-300 p-6">
              <h3 className="font-black text-base-content text-lg mb-3">Quick Answers</h3>
              {[
                { q: "How long until I get a reply?", a: "We reply within 24 hours on business days." },
                { q: "Can I request a refund?", a: "Yes — our 7-day satisfaction guarantee applies to all bookings." },
                { q: "Do you offer group sessions?", a: "Yes! Message us and we'll set up a custom group plan." },
              ].map(({ q, a }, i) => (
                <div key={i} className="py-3 border-b border-base-300 last:border-0">
                  <p className="text-sm font-bold text-base-content mb-1">{q}</p>
                  <p className="text-xs text-base-content/55">{a}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;
