import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebook,
  FaLinkedin,
  FaYoutube,
  FaTiktok,
  FaInstagram,
} from "react-icons/fa";
import useAxiosPublic from "@/Hooks/useAxiosPublic";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

const Contact = () => {
  const [footerInfo, setFooterInfo] = useState(null);
  const axiosPublic = useAxiosPublic();

  useEffect(() => {
    const fetchFooterInfo = async () => {
      try {
        const res = await axiosPublic.get("/footer");
        setFooterInfo(res.data[0]);
      } catch (err) {
        console.error("❌ Footer Info Fetch Error:", err.message);
      }
    };
    fetchFooterInfo();
  }, []);

  if (!footerInfo) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg font-semibold">Loading Contact Info...</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-sky-50 via-white to-sky-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 text-gray-800 dark:text-gray-200">
      {/* Hero Section */}
      <section className="relative text-center py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-sky-500/30 to-emerald-400/30 blur-3xl"></div>

        <motion.img
          src={footerInfo.logo}
          alt="EduVerse Logo"
          className="w-28 h-28 mx-auto mb-6 rounded-full shadow-2xl border-4 border-white/40 backdrop-blur-sm"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        />

        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="text-5xl md:text-6xl font-extrabold text-sky-700 dark:text-sky-400 mb-4"
        >
          {footerInfo.name}
        </motion.h1>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300 text-lg md:text-xl leading-relaxed"
        >
          {footerInfo.description}
        </motion.p>
      </section>

      {/* Contact Info Section */}
      <section className="max-w-6xl mx-auto px-6 py-20 grid gap-10 sm:grid-cols-2 md:grid-cols-3">
        {[
          {
            icon: <FaPhoneAlt className="text-cyan-500 text-4xl" />,
            title: "Phone",
            info: footerInfo.phone,
          },
          {
            icon: <FaEnvelope className="text-emerald-500 text-4xl" />,
            title: "Email",
            info: footerInfo.email,
          },
          {
            icon: <FaMapMarkerAlt className="text-orange-500 text-4xl" />,
            title: "Address",
            info: footerInfo.address,
          },
        ].map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="relative bg-white/70 dark:bg-gray-800/60 backdrop-blur-lg border border-white/40 dark:border-gray-700 rounded-2xl shadow-lg p-8 flex flex-col items-center group"
          >
            <div className="absolute inset-0 rounded-2xl bg-sky-100 opacity-0 group-hover:opacity-100 blur-md transition duration-500"></div>
            <div className="relative z-10 flex flex-col items-center">
              {item.icon}
              <h3 className="text-xl font-semibold mt-4">{item.title}</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                {item.info}
              </p>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Map Section */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="text-3xl font-bold text-center text-sky-700 dark:text-sky-400 mb-10"
        >
          Find Us on the Map
        </motion.h2>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="overflow-hidden rounded-3xl shadow-xl border border-sky-100 dark:border-gray-800"
        >
          <iframe
            title="EduVerse Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.8430431062523!2d90.37425557450427!3d23.750885988671!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755bf57a540c4a1%3A0xabd58adf33a9d8c1!2sDhaka!5e0!3m2!1sen!2sbd!4v1693669144491!5m2!1sen!2sbd"
            width="100%"
            height="420"
            loading="lazy"
            allowFullScreen=""
          ></iframe>
        </motion.div>
      </section>

      {/* Social Section */}
      <section className="text-center pb-16">
        <motion.h3
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-6"
        >
          Connect with Us
        </motion.h3>
        <div className="flex justify-center gap-8 text-3xl">
          {footerInfo.facebook && (
            <a
              href={footerInfo.facebook}
              target="_blank"
              rel="noreferrer"
              className="text-gray-600 dark:text-gray-300 hover:text-sky-500 transition duration-300"
            >
              <FaFacebook />
            </a>
          )}
          {footerInfo.youtube && (
            <a
              href={footerInfo.youtube}
              target="_blank"
              rel="noreferrer"
              className="text-gray-600 dark:text-gray-300 hover:text-red-500 transition duration-300"
            >
              <FaYoutube />
            </a>
          )}
          {footerInfo.instagram && (
            <a
              href={footerInfo.instagram}
              target="_blank"
              rel="noreferrer"
              className="text-gray-600 dark:text-gray-300 hover:text-pink-500 transition duration-300"
            >
              <FaInstagram />
            </a>
          )}
          {footerInfo.tiktok && (
            <a
              href={footerInfo.tiktok}
              target="_blank"
              rel="noreferrer"
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition duration-300"
            >
              <FaTiktok />
            </a>
          )}
          {footerInfo.linkedin && (
            <a
              href={footerInfo.linkedin}
              target="_blank"
              rel="noreferrer"
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 transition duration-300"
            >
              <FaLinkedin />
            </a>
          )}
        </div>
      </section>
    </div>
  );
};

export default Contact;
