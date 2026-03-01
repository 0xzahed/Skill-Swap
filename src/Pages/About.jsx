import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FaHandshake, FaGlobe, FaLightbulb, FaShieldAlt, FaHeart, FaBolt } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";

// Animated count-up hook
const useCountUp = (target, duration = 2000) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = Date.now();
          const tick = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return [count, ref];
};

const StatCard = ({ value, suffix = "", label, color }) => {
  const numVal = parseInt(value.replace(/\D/g, ""), 10);
  const [count, ref] = useCountUp(numVal, 1800);
  return (
    <div ref={ref} className={`text-center p-8 rounded-2xl border border-base-300 bg-base-100 card-lift`}>
      <p className={`stat-number ${color} mb-1`}>{count}{suffix}</p>
      <p className="text-base-content/55 text-sm font-semibold uppercase tracking-wider">{label}</p>
    </div>
  );
};

const features = [
  {
    icon: FaGlobe,
    title: "Global Community",
    description:
      "Connect with learners and tutors from 18+ countries in our diverse skill-sharing ecosystem.",
    color: "text-blue-500 bg-blue-50",
  },
  {
    icon: FaLightbulb,
    title: "Learn Anything",
    description:
      "From coding and design to cooking and music — find experts in virtually any skill you want to learn.",
    color: "text-yellow-500 bg-yellow-50",
  },
  {
    icon: FaShieldAlt,
    title: "Trusted Platform",
    description:
      "Secure payments, verified tutors, and a robust rating system ensure quality experiences.",
    color: "text-green-500 bg-green-50",
  },
  {
    icon: FaHandshake,
    title: "Peer-to-Peer",
    description:
      "Real people teaching real skills. Our community-driven model keeps pricing fair and transparent.",
    color: "text-purple-500 bg-purple-50",
  },
  {
    icon: FaHeart,
    title: "Passion-Driven",
    description:
      "Our tutors are hand-picked enthusiasts who genuinely love what they teach.",
    color: "text-red-500 bg-red-50",
  },
  {
    icon: FaBolt,
    title: "Instant Booking",
    description:
      "Find, book, and attend sessions with one click — no back-and-forth emails required.",
    color: "text-orange-500 bg-orange-50",
  },
];

const team = [
  {
    name: "Sarah Johnson",
    role: "Co-Founder & CEO",
    img: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Ahmed Karim",
    role: "CTO & Lead Engineer",
    img: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Priya Sharma",
    role: "Head of Community",
    img: "https://randomuser.me/api/portraits/women/65.jpg",
  },
  {
    name: "Marcus Lee",
    role: "Head of Growth",
    img: "https://randomuser.me/api/portraits/men/75.jpg",
  },
];

const About = () => {
  return (
    <div className="min-h-screen bg-base-100">
      {/* Hero */}
      <motion.section
        className="relative overflow-hidden bg-primary text-white py-24 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="absolute inset-0 hero-grid opacity-20" />
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/70 text-sm font-semibold uppercase tracking-widest mb-4"
          >
            Our story
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="text-4xl md:text-6xl font-black mb-6 leading-tight"
          >
            About SkillSwap
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.6 }}
            className="text-xl text-white/75 max-w-2xl mx-auto leading-relaxed"
          >
            Empowering people to learn, grow, and share knowledge through our
            innovative skill-sharing platform — connecting passion with purpose.
          </motion.p>
        </div>
      </motion.section>

      {/* Stats */}
      <section className="py-16 px-4 bg-base-200">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-5">
          <StatCard value="1000" suffix="+" label="Active Learners" color="text-primary" />
          <StatCard value="50" suffix="+" label="Expert Tutors" color="text-purple-600" />
          <StatCard value="18" suffix="+" label="Countries" color="text-blue-600" />
          <StatCard value="4" suffix=".8★" label="Avg. Rating" color="text-yellow-500" />
        </div>
      </section>

      {/* Mission */}
      <motion.section
        className="py-20 px-4"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-14 items-center">
            <div>
              <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">
                Why we exist
              </p>
              <h2 className="text-3xl md:text-4xl font-black text-base-content mb-6">
                Our <span className="text-primary">Mission</span>
              </h2>
              <p className="text-base-content/65 text-lg mb-5 leading-relaxed">
                At SkillSwap, we believe everyone has something valuable to
                teach and something new to learn. Our mission is to create a
                world where knowledge flows freely, connecting passionate
                learners with expert tutors across all disciplines.
              </p>
              <p className="text-base-content/65 text-lg leading-relaxed mb-8">
                We're breaking down barriers to education by making
                high-quality learning accessible, affordable, and flexible for
                everyone, everywhere.
              </p>
              <Link
                to="/service"
                className="btn btn-primary rounded-full px-8 text-white gap-2 group"
              >
                Explore Skills <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-0 rounded-3xl bg-primary/10 blur-2xl scale-110 pointer-events-none" />
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=700&h=480&fit=crop"
                alt="Team collaboration"
                className="relative rounded-3xl shadow-2xl object-cover w-full"
              />
            </div>
          </div>
        </div>
      </motion.section>

      {/* Why SkillSwap */}
      <motion.section
        className="py-20 px-4 bg-base-200"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">
              The difference
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-base-content mb-4">
              Why Choose <span className="text-primary">SkillSwap?</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: i * 0.07 }}
                viewport={{ once: true }}
                className="bg-base-100 border border-base-300 p-7 rounded-2xl card-lift"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${f.color}`}>
                  <f.icon size={22} />
                </div>
                <h3 className="text-lg font-bold text-base-content mb-2">{f.title}</h3>
                <p className="text-base-content/60 text-sm leading-relaxed">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Team */}
      <motion.section
        className="py-20 px-4"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">
              The people
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-base-content mb-4">
              Meet Our <span className="text-primary">Team</span>
            </h2>
            <p className="text-base-content/60 text-lg max-w-xl mx-auto">
              Passionate builders on a mission to democratize education
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                viewport={{ once: true }}
                className="text-center bg-base-100 border border-base-300 rounded-2xl p-6 card-lift group"
              >
                <div className="w-20 h-20 rounded-full mx-auto mb-4 ring-4 ring-primary/20 group-hover:ring-primary/60 transition-all overflow-hidden">
                  <img src={member.img} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-bold text-base-content text-base">{member.name}</h3>
                <p className="text-primary text-xs font-semibold mt-1">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Banner */}
      <section className="py-16 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto bg-primary rounded-3xl text-white text-center px-8 py-14"
        >
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            Ready to start learning?
          </h2>
          <p className="text-white/75 text-lg mb-8 max-w-xl mx-auto">
            Join over 1,000 learners already leveling up their skills today.
          </p>
          <Link
            to="/auth/register"
            className="btn bg-white text-primary hover:bg-white/90 border-0 rounded-full px-10 text-base font-bold"
          >
            Join SkillSwap Free
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default About;
