import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "@/Hooks/useAxiosPublic";
import { motion } from "framer-motion";
import { CheckCircle, Clock, User, GraduationCap } from "lucide-react";
import Swal from "sweetalert2";

export default function CourseDetails() {
  const { id } = useParams();
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();

  // Fetch course details
  const { data: course, isLoading } = useQuery({
    queryKey: ["course", id],
    queryFn: async () => {
      const res = await axiosPublic.get(`/courses/${id}`);
      return res.data;
    },
  });

  // Fetch instructors
  const { data: instructors = [] } = useQuery({
    queryKey: ["instructors"],
    queryFn: async () => {
      const res = await axiosPublic.get("/instructors");
      return res.data.filter((i) => i.status === "active");
    },
  });

  if (isLoading) return <p className="text-center py-10">Loading...</p>;
  if (!course) return <p className="text-center py-10">Course not found.</p>;

  // Filter instructors for this course
  const courseInstructors = instructors.filter((inst) =>
    course.instructorIds?.includes(inst._id)
  );

  const handleEnroll = () => {
    Swal.fire({
      title: "Confirm Enrollment",
      text: `Are you sure you want to enroll in "${course.title}"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#0ea5e9",
      confirmButtonText: "Yes, Enroll Me!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Success", "You have been enrolled successfully!", "success");
        navigate("/my-courses");
      }
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-3 gap-10">
      {/* LEFT: Course Description + Instructors */}
      <div className="lg:col-span-2 space-y-8">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-gray-900 dark:text-white"
        >
          {course.title}
        </motion.h1>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="prose max-w-none text-gray-700 dark:text-gray-300"
        >
          <p className="whitespace-pre-line">{course.description}</p>
        </motion.div>

        {/* Instructor Section */}
        {courseInstructors.length > 0 && (
          <div className="mt-12">
            <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white text-center">
              Meet Your Instructor{courseInstructors.length > 1 ? "s" : ""}
            </h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {courseInstructors.map((inst, i) => (
                <motion.div
                  key={inst._id || i}
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ duration: 0.3 }}
                  className="relative bg-gradient-to-b from-white to-sky-50 dark:from-gray-800 dark:to-gray-900 
                     p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 
                     hover:shadow-sky-200/50 dark:hover:shadow-sky-500/30 
                     text-center overflow-hidden"
                >
                  {/* Subtle overlay accent */}
                  <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-sky-500 via-sky-400 to-sky-600 rounded-t-2xl" />

                  {/* Instructor Image */}
                  <div className="relative w-28 h-28 mx-auto mb-4">
                    <img
                      src={inst.image}
                      alt={inst.name}
                      className="w-full h-full rounded-full object-cover border-4 border-sky-300 shadow-md"
                    />
                  </div>

                  {/* Instructor Info */}
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {inst.name}
                  </h3>
                  <p className="text-sm text-sky-600 font-medium mt-1">
                    {inst.education || "Professional Instructor"}
                  </p>
                  {inst.expertise && (
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 italic">
                      {inst.expertise}
                    </p>
                  )}

                  {/* Optional subtle animation effect */}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-sky-400 to-transparent"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* RIGHT: Course Card + Enroll */}
      <div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gradient-to-b from-[#0e1629] to-[#1b2738] text-white rounded-2xl shadow-xl overflow-hidden border border-gray-700 sticky top-20"
        >
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full aspect-3/2 object-cover"
          />
          <div className="p-6 space-y-4">
            <h3 className="text-2xl font-bold">{course.title}</h3>

            {/* Price */}
            <div className="flex items-center gap-3">
              {course.discountPrice > 0 && (
                <p className="text-lg line-through text-red-400">
                  ৳ {course.price}
                </p>
              )}
              <p className="text-2xl font-bold text-sky-400">
                ৳{" "}
                {course.discountPrice > 0 ? course.discountPrice : course.price}
              </p>
            </div>

            {/* Duration & Level */}
            <div className="flex items-center gap-3 text-gray-300">
              <Clock size={18} /> <span>{course.duration}</span>
              <GraduationCap size={18} /> <span>{course.level}</span>
            </div>

            {/* Features */}
            {course.shortdescription && (
              <ul className="mt-3 text-gray-300 space-y-2 text-sm">
                {course.shortdescription
                  .split("\n")
                  .filter((line) => line.trim().length > 0)
                  .map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle size={16} className="text-sky-400 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
              </ul>
            )}

            <button
              onClick={handleEnroll}
              className="w-full bg-sky-600 hover:bg-sky-700 text-white font-medium py-2.5 rounded-lg mt-4 transition-all"
            >
              Enroll Now
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
