import React from "react";
import { motion } from "framer-motion";
import {
  FaLaptopCode,
  FaUsers,
  FaCertificate,
  FaLightbulb,
  FaChalkboardTeacher,
  FaUserGraduate,
  FaBookOpen,
} from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "@/Hooks/useAxiosPublic";
import aboutImg from "../../assets/EduVerse_Banner1.png";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

const About = () => {
  const axiosPublic = useAxiosPublic();

  // Fetch instructors from backend
  const { data: instructors = [] } = useQuery({
    queryKey: ["instructors"],
    queryFn: async () => {
      const res = await axiosPublic.get("/instructors");
      return res.data;
    },
  });

  return (
    <div className="bg-gradient-to-b from-white via-sky-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden text-center py-24">
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="text-5xl md:text-6xl font-bold text-sky-600"
        >
          About <span className="text-gray-800">EduVerse</span>
        </motion.h1>
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="max-w-2xl mx-auto mt-6 text-gray-600 text-lg"
        >
          Empowering learners worldwide through high-quality, affordable online
          courses taught by industry experts.
        </motion.p>
      </section>

      {/* Mission Section */}
      <section className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
        <motion.img
          src={aboutImg}
          alt="About EduVerse"
          className="rounded-2xl shadow-lg object-cover"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        />
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-sky-600 mb-4">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            At EduVerse, our mission is to make world-class education accessible
            to everyone. We bridge the gap between learners and experts by
            providing flexible, engaging, and career-focused courses.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Whether you’re upskilling, reskilling, or exploring new interests,
            EduVerse gives you the tools and guidance to achieve your goals.
          </p>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="text-3xl font-bold text-center text-sky-600 mb-12"
        >
          Why Choose EduVerse?
        </motion.h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 px-6">
          {[
            {
              icon: <FaLaptopCode />,
              title: "Expert-Led Courses",
              desc: "Learn directly from professionals with years of real-world experience.",
            },
            {
              icon: <FaLightbulb />,
              title: "Interactive Learning",
              desc: "Engage with hands-on projects and quizzes designed for practical learning.",
            },
            {
              icon: <FaCertificate />,
              title: "Certified Programs",
              desc: "Earn industry-recognized certificates to showcase your expertise.",
            },
            {
              icon: <FaUsers />,
              title: "Global Community",
              desc: "Join thousands of learners worldwide and collaborate on exciting projects.",
            },
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-sky-50 hover:bg-sky-100 transition-all duration-300 p-8 rounded-2xl shadow-md text-center"
            >
              <div className="text-sky-600 text-4xl mb-4 mx-auto">{f.icon}</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {f.title}
              </h3>
              <p className="text-gray-600 text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-16 bg-gradient-to-r from-sky-50 to-sky-100">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="text-3xl font-bold text-center text-sky-600 mb-12"
        >
          Our Achievements
        </motion.h2>
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { icon: <FaUserGraduate />, count: "50K+", label: "Happy Students" },
            { icon: <FaChalkboardTeacher />, count: "200+", label: "Instructors" },
            { icon: <FaBookOpen />, count: "1,000+", label: "Courses" },
            { icon: <FaCertificate />, count: "10K+", label: "Certificates Awarded" },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-2xl shadow-md p-8 hover:shadow-lg transition-all"
            >
              <div className="text-sky-600 text-4xl mb-3 mx-auto">
                {item.icon}
              </div>
              <h3 className="text-3xl font-bold text-gray-800">{item.count}</h3>
              <p className="text-gray-500 font-medium">{item.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Instructors Section (Dynamic from Backend) */}
      <section className="py-16 max-w-6xl mx-auto px-6 text-center">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="text-3xl font-bold text-sky-600 mb-12"
        >
          Meet Our Instructors
        </motion.h2>

        {instructors.length === 0 ? (
          <p className="text-gray-500">No instructors found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
            {instructors.map((instructor, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl shadow-md p-6"
              >
                <img
                  src={instructor.image}
                  alt={instructor.name}
                  className="w-28 h-28 mx-auto mb-4 rounded-full object-cover border-4 border-sky-200"
                />
                <h3 className="font-semibold text-gray-800">
                  {instructor.name}
                </h3>
                <p className="text-sm text-sky-600">{instructor.education}</p>
                <p className="text-gray-500 text-sm mt-1">
                  {instructor.expertise}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default About;
