import { useContext, useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import useAxiosPublic from "@/Hooks/useAxiosPublic";
import { AuthContext } from "@/provider/AuthProvider";
import LoadingPage from "@/Shared/LoadingPage";

export default function CheckoutPage() {
  const { id } = useParams();
  const location = useLocation();
  const axiosPublic = useAxiosPublic();
  const { user } = useContext(AuthContext);

  const passedCourse = location.state?.course;
  const [course, setCourse] = useState(passedCourse || null);

  useEffect(() => {
    if (!course && id) {
      axiosPublic.get(`/courses/${id}`).then((res) => setCourse(res.data));
    }
  }, [id, course, axiosPublic]);

  const [formData, setFormData] = useState({
    name: user?.displayName || "",
    email: user?.email || "",
    division: "",
    phone: "",
    address: "",
    agree: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.agree) {
      Swal.fire(
        "Please Agree",
        "You must agree to the terms & conditions.",
        "info"
      );
      return;
    }

    try {
      await axiosPublic.post("/enrollments", {
        ...formData,
        courseId: id,
        courseTitle: course?.title,
        coursePrice:
          course?.discountPrice > 0 ? course.discountPrice : course?.price,
        date: new Date(),
      });
      Swal.fire("Success!", "Enrollment successful!", "success");
    } catch {
      Swal.fire("Error", "Something went wrong!", "error");
    }
  };

  // Loading state
  if (!course) return <LoadingPage></LoadingPage>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-20 px-6 flex justify-center">
      <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-10 items-start">
        {/* Left Side: Form */}
        <motion.form
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700"
        >
          <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
            Complete Your Enrollment
          </h2>

          {/* Name */}
          <div className="mb-5">
            <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">
              Your Name*
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your name"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-sky-400 outline-none"
            />
          </div>

          {/* Division */}
          <div className="mb-5">
            <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">
              Division*
            </label>
            <select
              name="division"
              value={formData.division}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-sky-400 outline-none"
            >
              <option value="">Select your division</option>
              <option value="Dhaka">Dhaka</option>
              <option value="Chattogram">Chattogram</option>
              <option value="Rajshahi">Rajshahi</option>
              <option value="Khulna">Khulna</option>
              <option value="Sylhet">Sylhet</option>
              <option value="Barishal">Barishal</option>
              <option value="Rangpur">Rangpur</option>
              <option value="Mymensingh">Mymensingh</option>
            </select>
          </div>

          {/* Phone */}
          <div className="mb-5">
            <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">
              Phone Number* (11 Digits)
            </label>
            <div className="flex">
              <span className="flex items-center justify-center px-3 bg-gray-100 dark:bg-gray-700 border border-r-0 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded-l-lg">
                +88
              </span>
              <input
                type="number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="01700-000000"
                required
                maxLength={11}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-r-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-sky-400 outline-none"
              />
            </div>
          </div>

          {/* Address */}
          <div className="mb-5">
            <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">
              Address*
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Write your address"
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-sky-400 outline-none"
            />
          </div>

          {/* Terms checkbox */}
          <div className="mt-6">
            <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300 text-sm">
              <input
                type="checkbox"
                name="agree"
                checked={formData.agree}
                onChange={handleChange}
                className="w-4 h-4 accent-sky-600"
              />
              <span>
                I agree to the{" "}
                <a
                  href="/TermsAndConditions"
                  className="text-sky-500 hover:underline"
                >
                  terms & conditions
                </a>
                ,{" "}
                <a
                  href="/ReturnAndRefundPolicy"
                  className="text-sky-500 hover:underline"
                >
                  refund policy
                </a>{" "}
                and{" "}
                <a
                  href="/privacyPolicy"
                  className="text-sky-500 hover:underline"
                >
                  privacy policy
                </a>
                .
              </span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full mt-6 bg-sky-700 hover:bg-sky-800 text-white font-semibold py-3 rounded-xl transition-all shadow-md"
          >
            💳 Proceed to Payment
          </button>
        </motion.form>

        {/* Right Side: Summary */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gray-100 dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-xl font-semibold text-sky-600 mb-4">
            {course?.title || "Course Title"}
          </h3>

          <div className="text-gray-700 dark:text-gray-300 space-y-2">
            <div className="flex justify-between">
              <span>Course Fee</span>
              <span>{course?.price ? `${course.price} BDT` : "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span>Discount</span>
              <span>
                {course?.discountPrice
                  ? course.price - course.discountPrice
                  : 0}{" "}
                BDT
              </span>
            </div>
            <hr className="my-2 border-gray-300 dark:border-gray-700" />
            <div className="flex justify-between font-semibold text-gray-900 dark:text-gray-100">
              <span>Total</span>
              <span className="text-sky-600">
                {course?.discountPrice > 0
                  ? course.discountPrice
                  : course?.price}{" "}
                BDT
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
