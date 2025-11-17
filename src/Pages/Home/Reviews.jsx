import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";
import useAxiosPublic from "@/Hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import "./ReviewStyle.css"; // Custom CSS

const Reviews = () => {
  const axiosPublic = useAxiosPublic();

  const { data: reviews = [] } = useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      const res = await axiosPublic.get("/reviews");
      return res.data;
    },
  });

  return (
    <section className="py-12 bg-white relative">
      <div className="max-w-7xl px-4 mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-sky-600 mb-8"
        >
          What Our Students Say
        </motion.h2>

        <Swiper
          spaceBetween={30}
          centeredSlides={false}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
          }}
          pagination={{ clickable: true }}
          navigation={false}
          modules={[Autoplay, Pagination, Navigation]}
          className="mySwiper"
          breakpoints={{
            0: { slidesPerView: 1 },
            768: { slidesPerView: 3 },
          }}
        >
          {reviews.map((review, idx) => (
            <SwiperSlide key={idx}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="max-w-xl mx-auto bg-sky-50 rounded-2xl shadow-md p-8 border border-sky-100 h-full"
              >
                <div className="flex flex-col items-center">
                  <img
                    src={review.image}
                    alt={review.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-sky-200 mb-4"
                  />
                  <h3 className="text-lg font-semibold text-gray-800">
                    {review.name}
                  </h3>
                  <p className="text-sm text-sky-600 mb-3">{review.batch}</p>
                  <div className="flex justify-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        size={20}
                        color={i < review.rating ? "#facc15" : "#d1d5db"}
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 italic leading-relaxed max-w-md">
                    “{review.feedback}”
                  </p>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Reviews;
