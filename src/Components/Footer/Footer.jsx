import React from "react";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaRegCopyright,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-base-300 text-base-content/80">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-base-content mb-4">
              SkillSwap
            </h3>
            <p className="text-base-content/60 mb-4">
              Learn and share skills with talented people in your community.
              Join thousands of learners today!
            </p>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-base-content/60 hover:text-primary transition-colors"
              >
                <FaFacebook size={20} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-base-content/60 hover:text-primary transition-colors"
              >
                <FaTwitter size={20} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-base-content/60 hover:text-primary transition-colors"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-base-content/60 hover:text-primary transition-colors"
              >
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>

          <div>
            <h6 className="text-base-content font-semibold text-lg mb-4">
              Quick Links
            </h6>
            <ul className="space-y-2">
              <li>
                <a href="/" className="hover:text-primary transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="hover:text-primary transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/#services"
                  className="hover:text-primary transition-colors"
                >
                  Services
                </a>
              </li>
              <li>
                <a
                  href="/contact_us"
                  className="hover:text-primary transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h6 className="text-base-content font-semibold text-lg mb-4">
              Popular Skills
            </h6>
            <ul className="space-y-2">
              <li>
                <a
                  href="/service"
                  className="hover:text-primary transition-colors"
                >
                  Guitar Lessons
                </a>
              </li>
              <li>
                <a
                  href="/service"
                  className="hover:text-primary transition-colors"
                >
                  English Speaking
                </a>
              </li>
              <li>
                <a
                  href="/service"
                  className="hover:text-primary transition-colors"
                >
                  Yoga Classes
                </a>
              </li>
              <li>
                <a
                  href="/service"
                  className="hover:text-primary transition-colors"
                >
                  Digital Marketing
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h6 className="text-base-content font-semibold text-lg mb-4">
              Contact Us
            </h6>
            <ul className="space-y-2 text-base-content/60">
              <li>Email: info@skillswap.com</li>
              <li>Phone: +880 1744546898</li>
              <li>Address: Dhaka, Bangladesh</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-base-content/10 mt-8 pt-8 text-center">
          <p className="text-base-content/60 flex justify-center items-center gap-1">
            <FaRegCopyright></FaRegCopyright> {new Date().getFullYear()}{" "}
            SkillSwap. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
