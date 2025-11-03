import React, { useState, useContext } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../../../provider/AuthProvider";
import useAxiosPublic from "@/Hooks/useAxiosPublic";
import { useNavigate } from "react-router-dom";

const AddInstructor = () => {
  const { user } = useContext(AuthContext);
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    education: "",
    email: "",
    expertise: "",
    status: "active",
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageFile) {
      return Swal.fire("Error", "Please select an image", "error");
    }

    setLoading(true);

    try {
      // Upload image to Cloudinary
      const cloudinaryData = new FormData();
      cloudinaryData.append("file", imageFile);
      cloudinaryData.append("upload_preset", "eCommerce"); // তোমার preset নাম

      const cloudinaryRes = await axiosPublic.post(
        "https://api.cloudinary.com/v1_1/dt3bgis04/image/upload",
        cloudinaryData
      );

      const imageUrl = cloudinaryRes.data.secure_url;

      // Prepare instructor data for backend
      const instructorData = {
        ...formData,
        image: imageUrl,
        addedBy: user?.email,
      };

      //Send to backend
      const res = await axiosPublic.post("/instructors", instructorData);

      if (res.data.insertedId) {
        Swal.fire("Success", "Instructor added successfully!", "success");
        setFormData({
          name: "",
          email: "",
          expertise: "",
          status: "active",
        });
        setImageFile(null);
        navigate("/dashboard/allInstructors");
      } else {
        Swal.fire("Error", "Server error. Instructor not added.", "error");
      }
    } catch (err) {
      console.error("❌ Add Instructor Error:", err);
      Swal.fire("Error", "Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl p-6 mx-auto mt-6 bg-white rounded-lg shadow-md">
      <h2 className="mb-6 text-2xl font-bold text-center">Add New Instructor</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <input
          type="text"
          name="name"
          placeholder="Instructor Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
          required
        />

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Instructor Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
          required
        />
        {/* Email */}
        <input
          type="text"
          name="education"
          placeholder="Educational Qualification"
          value={formData.education}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
          required
        />

        {/* Expertise */}
        <input
          type="text"
          name="expertise"
          placeholder="Expertise (e.g. MERN Stack, SEO)"
          value={formData.expertise}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
        />

        {/* Image Upload */}
        <div>
          <label className="block mb-1 font-semibold">Instructor Image</label>
          <div className="flex items-center gap-4">
            <label
              htmlFor="image"
              className="px-4 py-2 text-white transition bg-sky-500 rounded-lg shadow cursor-pointer hover:bg-sky-600"
            >
              Choose File
            </label>
            <span className="text-sm text-gray-600">
              {imageFile ? imageFile.name : "No file chosen"}
            </span>
          </div>
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleImageChange}
            accept="image/*"
            required
            className="hidden"
          />
        </div>

        {/* Status */}
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 text-white bg-sky-500 rounded-xl hover:bg-sky-600"
        >
          {loading ? "Submitting..." : "Add Instructor"}
        </button>
      </form>
    </div>
  );
};

export default AddInstructor;