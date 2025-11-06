import React, { useContext, useState } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../../../provider/AuthProvider";
import useAxiosPublic from "@/Hooks/useAxiosPublic";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";

const AddReview = () => {
  const { user } = useContext(AuthContext);
  const axiosPublic = useAxiosPublic();
  const [formData, setFormData] = useState({
    name: "",
    batch: "",
    feedback: "",
  });
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle text input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageFile) {
      return Swal.fire("Error", "Please upload an image", "error");
    }
    if (rating === 0) {
      return Swal.fire("Error", "Please give a star rating!", "error");
    }

    setLoading(true);

    try {
      // Upload image to Cloudinary
      const imageData = new FormData();
      imageData.append("file", imageFile);
      imageData.append("upload_preset", "eCommerce");

      const imageRes = await axiosPublic.post(
        "https://api.cloudinary.com/v1_1/dt3bgis04/image/upload",
        imageData
      );
      const imageUrl = imageRes.data.secure_url;

      // Combine all data
      const reviewData = {
        ...formData,
        image: imageUrl,
        rating,
        email: user?.email,
        createdAt: new Date(),
      };

      // Send to backend
      const res = await axiosPublic.post("/reviews", reviewData);

      if (res.data.insertedId) {
        Swal.fire("Success", "Review submitted successfully!", "success");
        setFormData({ name: "", batch: "", feedback: "" });
        setImageFile(null);
        setRating(0);
      } else {
        Swal.fire("Error", "Failed to submit review", "error");
      }
    } catch (error) {
      console.error("❌ Error uploading review:", error);
      Swal.fire("Error", "Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-xl p-6 mx-auto mt-6 bg-white rounded-lg shadow-md">
      <h2 className="mb-6 text-2xl font-bold text-center">
        Add a Review
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <input
          type="text"
          name="name"
          required
          value={formData.name}
          onChange={handleChange}
          placeholder="Your Name"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
        />

        {/* Batch */}
        <input
          type="text"
          name="batch"
          required
          value={formData.batch}
          onChange={handleChange}
          placeholder="Batch (e.g. HSC 2026)"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
        />

        {/* Student Image Upload */}
        <div>
          <label className="block mb-1 font-semibold text-sky-600">
            Upload Student Image
          </label>
          <div className="flex items-center gap-4">
            <label
              htmlFor="studentImage"
              className="px-4 py-2 text-white bg-sky-500 rounded-lg shadow cursor-pointer hover:bg-sky-600"
            >
              Choose File
            </label>
            <span className="text-sm text-gray-600">
              {imageFile ? imageFile.name : "No file chosen"}
            </span>
          </div>
          <input
            type="file"
            id="studentImage"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            required
          />
        </div>

        {/* ⭐ Star Rating */}
        <div className="text-center">
          <p className="mb-2 font-semibold text-sky-600">Give a Rating:</p>
          <div className="flex justify-center gap-2">
            {[...Array(5)].map((_, index) => {
              const currentRating = index + 1;
              return (
                <motion.label
                  key={index}
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.1 }}
                  className="cursor-pointer"
                >
                  <input
                    type="radio"
                    name="rating"
                    value={currentRating}
                    onClick={() => setRating(currentRating)}
                    className="hidden"
                  />
                  <FaStar
                    size={28}
                    color={
                      currentRating <= (hover || rating)
                        ? "#facc15"
                        : "#d1d5db"
                    }
                    onMouseEnter={() => setHover(currentRating)}
                    onMouseLeave={() => setHover(null)}
                  />
                </motion.label>
              );
            })}
          </div>
          {rating > 0 && (
            <p className="mt-2 text-sky-600 font-medium">
              You rated this {rating} out of 5
            </p>
          )}
        </div>

        {/* Feedback */}
        <textarea
          name="feedback"
          required
          value={formData.feedback}
          onChange={handleChange}
          placeholder="Write your feedback..."
          rows={4}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
        />

        {/* Submit */}
        <div className="text-center">
          <motion.button
            type="submit"
            disabled={loading}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2 text-white bg-sky-500 rounded-lg shadow-md hover:bg-sky-600"
          >
            {loading ? "Uploading..." : "Submit Review"}
          </motion.button>
        </div>
      </form>
    </section>
  );
};

export default AddReview;
