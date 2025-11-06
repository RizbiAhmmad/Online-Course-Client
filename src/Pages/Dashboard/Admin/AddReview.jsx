import React, { useContext, useState } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../../../provider/AuthProvider";
import useAxiosPublic from "@/Hooks/useAxiosPublic";

const AddReview = () => {
  const { user } = useContext(AuthContext);
  const axiosPublic = useAxiosPublic();
  const [formData, setFormData] = useState({
    name: "",
    batch: "",
    feedback: "",
  });

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
    setLoading(true);

    try {
      // Upload client image to Cloudinary
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
        email: user?.email,
        createdAt: new Date(),
      };

      // Send to backend
      const res = await axiosPublic.post("/reviews", reviewData);

      if (res.data.insertedId) {
        Swal.fire("Success", "Review submitted successfully!", "success");
        setFormData({ name: "", batch: "", feedback: "" });
        setImageFile(null);
        setLogoFile(null);
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
    <section className="max-w-2xl p-6 mx-auto mt-6 bg-white rounded-lg shadow-md">
      <h2 className="mb-6 text-2xl font-bold text-center">Add a Review</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <input
          type="text"
          name="name"
          required
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          className="w-full px-4 py-2 border rounded"
        />

        {/* Role */}
        <input
          type="text"
          name="batch"
          required
          value={formData.batch}
          onChange={handleChange}
          placeholder="Batch (e.g. HSC 2023)"
          className="w-full px-4 py-2 border rounded"
        />

        {/* Client Image Upload */}
        <div>
          <label className="block mb-1 font-semibold">Student Image</label>
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

        {/* Feedback */}
        <textarea
          name="feedback"
          required
          value={formData.feedback}
          onChange={handleChange}
          placeholder="Feedback"
          rows={4}
          className="w-full px-4 py-2 border rounded"
        />

        {/* Submit */}
        <div className="text-center">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 text-white bg-sky-500 rounded hover:bg-sky-600"
          >
            {loading ? "Uploading..." : "Submit Review"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AddReview;
