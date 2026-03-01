import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaRegCopyright,
  FaYoutube,
} from "react-icons/fa";
import { FiSend, FiMail, FiPhone, FiMapPin } from "react-icons/fi";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  const quickLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About Us" },
    { to: "/service", label: "Services" },
    { to: "/contact_us", label: "Contact" },
  ];

  const popularSkills = [
    "Guitar Lessons",
    "English Speaking",
    "Yoga Classes",
    "Digital Marketing",
    "Python Programming",
    "Graphic Design",
  ];

  const socials = [
    { href: "https://facebook.com", Icon: FaFacebook, label: "Facebook" },
    { href: "https://twitter.com", Icon: FaTwitter, label: "Twitter" },
    { href: "https://instagram.com", Icon: FaInstagram, label: "Instagram" },
    { href: "https://linkedin.com", Icon: FaLinkedin, label: "LinkedIn" },
    { href: "https://youtube.com", Icon: FaYoutube, label: "YouTube" },
  ];

  return (
    <footer className="bg-base-300 text-base-content">
      {/* Newsletter strip */}
      <div className="bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-black mb-1">Stay in the loop 📬</h3>
            <p className="text-white/75 text-sm">
              Get new courses, tips, and exclusive deals delivered to your inbox.
            </p>
          </div>
          {subscribed ? (
            <div className="bg-white/20 rounded-2xl px-6 py-3 text-white font-semibold text-sm">
              ✅ You&apos;re subscribed! Thanks.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex w-full md:w-auto max-w-sm gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="newsletter-input flex-1 min-w-0 px-4 py-2.5 rounded-xl text-gray-800 text-sm font-medium bg-white focus:outline-none"
              />
              <button
                type="submit"
                className="btn bg-white/20 hover:bg-white/30 border-white/30 text-white rounded-xl px-4 gap-2 flex-shrink-0"
              >
                <FiSend size={14} /> Subscribe
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Main footer body */}
      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-black text-sm">
                S
              </div>
              <span className="text-2xl font-black text-primary">SkillSwap</span>
            </div>
            <p className="text-base-content/55 text-sm leading-relaxed mb-5">
              Learn and share skills with talented people in your community.
              Join thousands of learners growing every day.
            </p>
            {/* Socials */}
            <div className="flex gap-3">
              {socials.map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="social-icon w-9 h-9 rounded-xl bg-base-200 flex items-center justify-center text-base-content/50 hover:text-primary hover:bg-primary/10 transition-colors"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h6 className="text-base-content font-bold text-sm uppercase tracking-widest mb-5">
              Quick Links
            </h6>
            <ul className="space-y-2.5">
              {quickLinks.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm text-base-content/55 hover:text-primary transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular skills */}
          <div>
            <h6 className="text-base-content font-bold text-sm uppercase tracking-widest mb-5">
              Popular Skills
            </h6>
            <ul className="space-y-2.5">
              {popularSkills.map((skill) => (
                <li key={skill}>
                  <Link
                    to="/service"
                    className="text-sm text-base-content/55 hover:text-primary transition-colors"
                  >
                    {skill}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h6 className="text-base-content font-bold text-sm uppercase tracking-widest mb-5">
              Contact Us
            </h6>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-base-content/55">
                <FiMail size={15} className="mt-0.5 shrink-0 text-primary" />
                info@skillswap.com
              </li>
              <li className="flex items-start gap-2.5 text-sm text-base-content/55">
                <FiPhone size={15} className="mt-0.5 shrink-0 text-primary" />
                +880 1744546898
              </li>
              <li className="flex items-start gap-2.5 text-sm text-base-content/55">
                <FiMapPin size={15} className="mt-0.5 shrink-0 text-primary" />
                Mirpur 10, Dhaka, Bangladesh
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-base-content/10">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-base-content/40">
          <p className="flex items-center gap-1">
            <FaRegCopyright size={11} /> {new Date().getFullYear()} SkillSwap. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
