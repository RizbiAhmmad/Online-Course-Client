import React from "react";
import CountUp from "react-countup";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FaUserGraduate, FaBookOpen, FaUsers, FaChalkboardTeacher } from "react-icons/fa";

const stats = [
  {
    icon: <FaUserGraduate className="text-sky-500 text-5xl mb-4" />,
    label: "Students",
    value: 1500,
  },
  {
    icon: <FaBookOpen className="text-sky-500 text-5xl mb-4" />,
    label: "Courses",
    value: 120,
  },
  {
    icon: <FaUsers className="text-sky-500 text-5xl mb-4" />,
    label: "Enrollments",
    value: 3000,
  },
  {
    icon: <FaChalkboardTeacher className="text-sky-500 text-5xl mb-4" />,
    label: "Instructors",
    value: 25,
  },
];

const StatsSection = () => {
  const { ref, inView } = useInView({
    triggerOnce: true, // only trigger once
    threshold: 0.3, // 30% visible
  });

  return (
    <section ref={ref} className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: idx * 0.2 }}
            className="bg-sky-50 rounded-2xl shadow-md p-8 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex justify-center">{stat.icon}</div>
            <h3 className="text-4xl font-bold text-gray-800 mb-2">
              {inView && (
                <CountUp end={stat.value} duration={2.5} separator="," />
              )}
              +
            </h3>
            <p className="text-gray-500 font-medium">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default StatsSection;
