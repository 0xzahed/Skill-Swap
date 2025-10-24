import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaRegCopyright } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">SkillSwap</h3>
            <p className="text-gray-400 mb-4">
              Learn and share skills with talented people in your community.
              Join thousands of learners today!
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-gray-400 hover:text-[#422AD5] transition-colors"
              >
                <FaFacebook size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-[#422AD5] transition-colors"
              >
                <FaTwitter size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-[#422AD5] transition-colors"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-[#422AD5] transition-colors"
              >
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>

          <div>
            <h6 className="text-white font-semibold text-lg mb-4">
              Quick Links
            </h6>
            <ul className="space-y-2">
              <li>
                <a href="/" className="hover:text-[#422AD5] transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="hover:text-[#422AD5] transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/#services"
                  className="hover:text-[#422AD5] transition-colors"
                >
                  Services
                </a>
              </li>
              <li>
                <a
                  href="/contact_us"
                  className="hover:text-[#422AD5] transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h6 className="text-white font-semibold text-lg mb-4">
              Popular Skills
            </h6>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-[#422AD5] transition-colors">
                  Guitar Lessons
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#422AD5] transition-colors">
                  English Speaking
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#422AD5] transition-colors">
                  Yoga Classes
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#422AD5] transition-colors">
                  Digital Marketing
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h6 className="text-white font-semibold text-lg mb-4">
              Contact Us
            </h6>
            <ul className="space-y-2 text-gray-400">
              <li>Email: info@skillswap.com</li>
              <li>Phone: +880 1744546898</li>
              <li>Address: Dhaka, Bangladesh</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 flex justify-center items-center gap-1">
            <FaRegCopyright></FaRegCopyright> {new Date().getFullYear()} SkillSwap. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
