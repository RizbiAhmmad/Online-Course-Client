import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "@/Hooks/useAxiosPublic";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CourseCard() {
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await axiosPublic.get("/categories");
      return res.data.filter((cat) => cat.status === "active");
    },
  });

  // Fetch courses
  const { data: courses = [] } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const res = await axiosPublic.get("/courses");
      return res.data.filter((c) => c.status === "active");
    },
  });

  // Filter courses by category
  const filteredCourses =
    selectedCategory === "all"
      ? courses
      : courses.filter((course) => course.categoryId === selectedCategory);

  return (
    <div className="p-6 bg-white min-h-screen max-w-7xl mx-auto">
      <h2 className="text-4xl font-extrabold text-center mb-10 bg-linear-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent leading-tight">
        Our Popular Courses
      </h2>

      {/* Tabs Section */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`px-4 py-2 rounded-full font-medium transition ${
            selectedCategory === "all"
              ? "bg-sky-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-sky-100"
          }`}
        >
          All Batches
        </button>
        {categories.map((cat) => (
          <button
            key={cat._id}
            onClick={() => setSelectedCategory(cat._id)}
            className={`px-4 py-2 rounded-full font-medium transition ${
              selectedCategory === cat._id
                ? "bg-sky-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-sky-100"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Course Cards */}
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        <AnimatePresence>
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => {
              const features = course.shortdescription
                ? course.shortdescription
                    .split("\n")
                    .map((line) => line.trim())
                    .filter((line) => line.length > 0)
                : [];

              return (
                <motion.div
                  key={course._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ scale: 1.03 }}
                  className="relative bg-white rounded-2xl overflow-visible shadow-xl border border-gray-700 text-black"
                >
                  {/* Category Tag - OUTSIDE Image */}
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-sky-600 px-5 py-1.5 text-sm rounded-full font-semibold shadow-md z-20">
                    {categories.find((c) => c._id === course.categoryId)
                      ?.name || "Course"}
                  </div>

                  {/* Header Image */}
                  <div className="relative rounded-t-2xl overflow-hidden">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full aspect-3/2 object-cover"
                    />
                  </div>

                  {/* Course Info */}
                  <div className="p-5 text-center">
                    <h3 className="text-lg font-semibold mb-1">
                      {course.title}
                    </h3>
                    {/* Price Section */}
                    <div className="flex items-center justify-center gap-3 mb-2">
                      {course.discountPrice > 0 && (
                        <p className="text-xl font-semibold text-red-500 line-through">
                          ৳ {course.price}
                        </p>
                      )}
                      <p className="text-2xl font-bold text-sky-400">
                        ৳{" "}
                        {course.discountPrice > 0
                          ? course.discountPrice
                          : course.price}
                      </p>
                    </div>

                    <p className="text-lg font-semibold text-sky-500 mb-3">
                      এই কোর্সে থাকছে
                    </p>

                    {features.length > 0 ? (
                      <ul className="text-left text-gray-900 space-y-2 mb-5">
                        {features.map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle
                              size={18}
                              className="text-sky-400 mt-0.5 shrink-0"
                            />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-400 mb-5">
                        বিস্তারিত তথ্য শীঘ্রই আসছে...
                      </p>
                    )}

                    <button
                      onClick={() => navigate(`/course/${course._id}`)}
                      className="bg-sky-500 hover:bg-sky-600 px-5 py-2 rounded-lg font-medium shadow transition-all"
                    >
                      Details →
                    </button>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <p className="text-center col-span-full text-gray-400">
              No courses found in this category.
            </p>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
