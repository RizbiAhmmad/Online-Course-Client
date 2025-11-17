import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import useAxiosPublic from "@/Hooks/useAxiosPublic";
import { motion } from "framer-motion";
import Marquee from "./Marquee";

export default function ReviewSection() {
  const axiosPublic = useAxiosPublic();
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axiosPublic.get("/reviews");
        setReviews(res.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
    fetchReviews();
  }, [axiosPublic]);

  return (
    <section className="py-16 bg-white text-black relative overflow-hidden">
  {/* Optional background decorations — remove if you don’t want colored glows */}
  <div className="absolute top-0 left-0 w-72 h-72 bg-gray-200/40 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
  <div className="absolute bottom-0 right-0 w-96 h-96 bg-gray-200/40 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

  <div className="max-w-7xl mx-auto text-center mb-12 relative z-10">
    <h2 className="text-4xl font-extrabold text-black mb-3">
      What Our Students Say
    </h2>
    <p className="text-gray-700 max-w-2xl mx-auto">
      Hear from learners who’ve enrolled in EduVerse courses and transformed
      their skills!
    </p>
  </div>

  {/* Marquee Animation */}
  <Marquee pauseOnHover speed={60} className="relative z-10">
    {reviews.map((review) => (
      <motion.div
        key={review._id}
        whileHover={{ scale: 1.05 }}
        className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-gray-200 w-80 shrink-0"
      >
        <div className="flex items-center gap-3 mb-3">
          <img
            src={review.image || "https://i.ibb.co/yX0yXCN/user.png"}
            alt={review.name}
            className="w-12 h-12 rounded-full object-cover border-2 border-gray-300"
          />
          <div>
            <h4 className="text-black font-semibold">{review.name}</h4>
            <p className="text-gray-600 text-sm">{review.batch}</p>
          </div>
        </div>

        <p className="text-gray-800 text-sm mb-3">"{review.feedback}"</p>

        <div className="flex justify-center gap-1 text-yellow-500">
          {Array.from({ length: review.rating || 5 }).map((_, i) => (
            <FaStar key={i} />
          ))}
        </div>
      </motion.div>
    ))}
  </Marquee>
</section>

  );
}
