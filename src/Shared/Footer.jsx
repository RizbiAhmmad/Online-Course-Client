import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaYoutube,
  FaTiktok,
  FaInstagram,
} from "react-icons/fa";
import { motion } from "framer-motion";
import useAxiosPublic from "@/Hooks/useAxiosPublic";

export default function Footer() {
  const [footerInfo, setFooterInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const axiosPublic = useAxiosPublic();

  useEffect(() => {
    const fetchFooterInfo = async () => {
      try {
        const res = await axiosPublic.get("/footer");
        const data = res.data;
        if (data.length > 0) {
          setFooterInfo(data[0]);
        }
      } catch (err) {
        console.error("Error fetching footer info:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFooterInfo();
  }, [axiosPublic]);

  if (loading)
    return <p className="text-center text-gray-400">Loading footer...</p>;
  if (!footerInfo || Object.keys(footerInfo).length === 0)
    return <p className="text-center text-gray-400">No footer data found.</p>;

  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-sky-900 via-blue-950 to-gray-950 text-white py-20 px-6 md:px-12">
      {/* Decorative Gradients */}
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-sky-500 opacity-20 blur-3xl rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600 opacity-20 blur-3xl rounded-full"></div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
        {/* Logo & Info */}
        <motion.div
          className="space-y-5"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3">
            <img
              src={footerInfo.logo}
              alt={footerInfo.name}
              className="h-14 w-14 rounded-full border-2 border-sky-400 shadow-xl"
            />
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-400">
              {footerInfo.name}
            </h1>
          </div>
          <p className="text-gray-300 leading-relaxed">
            {footerInfo.description}
          </p>

          {/* Social Links */}
          <div className="flex gap-4 mt-4">
            {[
              { link: footerInfo.facebook, icon: <FaFacebookF /> },
              { link: footerInfo.youtube, icon: <FaYoutube /> },
              { link: footerInfo.instagram, icon: <FaInstagram /> },
              { link: footerInfo.tiktok, icon: <FaTiktok /> },
              { link: footerInfo.linkedin, icon: <FaLinkedinIn /> },
              {
                link: footerInfo.email ? `mailto:${footerInfo.email}` : null,
                icon: <FaEnvelope />,
              },
            ]
              .filter((s) => s.link)
              .map((social, i) => (
                <motion.a
                  key={i}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  className="p-2 bg-white/10 rounded-full hover:bg-gradient-to-r hover:from-sky-400 hover:to-emerald-400 hover:text-gray-900 transition-all duration-300"
                >
                  {social.icon}
                </motion.a>
              ))}
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="text-xl font-semibold border-l-4 border-sky-400 pl-3">
            Quick Links
          </h3>
          <ul className="space-y-3 text-gray-300">
            {[
              { name: "Home", path: "/" },
              { name: "About Us", path: "/about" },
              { name: "Contact", path: "/contact" },
              { name: "Privacy Policy", path: "/privacyPolicy" },
              { name: "Return & Refund", path: "/ReturnAndRefundPolicy" },
              { name: "Terms & Conditions", path: "/TermsAndConditions" },
            ].map((item, i) => (
              <li key={i}>
                <Link
                  to={item.path}
                  className="group inline-flex items-center gap-2 hover:text-sky-400 transition"
                >
                  <span className="h-[2px] w-0 bg-sky-400 group-hover:w-3 transition-all"></span>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <h3 className="text-xl font-semibold border-l-4 border-emerald-400 pl-3">
            Contact Info
          </h3>
          <ul className="space-y-3 text-gray-300">
            {footerInfo.phone && (
              <li className="flex items-center gap-3 hover:text-sky-400 transition">
                <FaPhone className="text-sky-400" /> {footerInfo.phone}
              </li>
            )}
            {footerInfo.email && (
              <li className="flex items-center gap-3 hover:text-sky-400 transition">
                <FaEnvelope className="text-sky-400" /> {footerInfo.email}
              </li>
            )}
            {footerInfo.address && (
              <li className="flex items-center gap-3 hover:text-sky-400 transition">
                <FaMapMarkerAlt className="text-sky-400" />{" "}
                {footerInfo.address}
              </li>
            )}
          </ul>
        </motion.div>
      </div>

      {/* Bottom Line */}
      <motion.div
        className="border-t border-white/20 mt-14 pt-6 text-center text-sm text-gray-400"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <p>
          © {new Date().getFullYear()} {footerInfo.name}. All Rights Reserved.
        </p>
        <p className="text-xs mt-1">
          Crafted with 💙 by{" "}
          <span className="text-sky-400 font-semibold">BangladeshiIT</span>
        </p>
      </motion.div>
    </footer>
  );
}
