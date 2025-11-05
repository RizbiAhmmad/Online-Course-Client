import React, { useState, useEffect, useContext } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../../../provider/AuthProvider";
import useAxiosPublic from "@/Hooks/useAxiosPublic";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

const AddCourse = () => {
  const { user } = useContext(AuthContext);
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    categoryId: "",
    instructorIds: [],
    shortdescription: "",
    description: "",
    price: "",
    discountPrice: "",
    duration: "",
    level: "Beginner",
    status: "active",
  });

  // Fetch active categories and instructors
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, instRes] = await Promise.all([
          axiosPublic.get("/categories"),
          axiosPublic.get("/instructors"),
        ]);

        const activeCats = (catRes.data || []).filter(
          (cat) => cat.status === "active"
        );
        const activeInsts = (instRes.data || []).filter(
          (inst) => inst.status === "active"
        );

        setCategories(activeCats);
        setInstructors(activeInsts);
      } catch (err) {
        console.error("❌ Error loading data:", err);
      }
    };
    fetchData();
  }, [axiosPublic]);

  // Handle single input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  // Handle image
  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageFile) {
      return Swal.fire("Error", "Please select a thumbnail image", "error");
    }

    if (formData.instructorIds.length === 0) {
      return Swal.fire(
        "Error",
        "Please select at least one instructor",
        "error"
      );
    }

    setLoading(true);

    try {
      // Upload to Cloudinary
      const cloudinaryData = new FormData();
      cloudinaryData.append("file", imageFile);
      cloudinaryData.append("upload_preset", "eCommerce");

      const cloudinaryRes = await axiosPublic.post(
        "https://api.cloudinary.com/v1_1/dt3bgis04/image/upload",
        cloudinaryData
      );

      const imageUrl = cloudinaryRes.data.secure_url;

      const courseData = {
        ...formData,
        price: Number(formData.price),
        discountPrice: Number(formData.discountPrice),
        thumbnail: imageUrl,
        addedBy: user?.email,
        createdAt: new Date(),
      };

      const res = await axiosPublic.post("/courses", courseData);

      if (res.data.insertedId) {
        Swal.fire("Success", "Course added successfully!", "success");
        setFormData({
          title: "",
          categoryId: "",
          instructorIds: [],
          shortdescription: "",
          description: "",
          price: "",
          discountPrice: "",
          duration: "",
          level: "Beginner",
          status: "active",
        });
        setImageFile(null);
        navigate("/dashboard/allCourses");
      } else {
        Swal.fire("Error", "Server error. Course not added.", "error");
      }
    } catch (err) {
      console.error("❌ Add Course Error:", err);
      Swal.fire("Error", "Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl p-6 mx-auto mt-6 bg-white rounded-lg shadow-md">
      <h2 className="mb-6 text-2xl font-bold text-center">Add New Course</h2>
      <form onSubmit={handleSubmit} className="space-y-2">
        {/* Course Title */}
        <input
          type="text"
          name="title"
          placeholder="Course Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
          required
        />

        {/* Category Dropdown */}
        <select
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* Instructor Multi-Select (react-select style) */}
        <label className="block mb-1 font-semibold">Select Instructor(s)</label>
        <Select
          isMulti
          name="instructorIds"
          options={instructors.map((inst) => ({
            value: inst._id,
            label: inst.name,
          }))}
          value={instructors
            .filter((inst) => formData.instructorIds.includes(inst._id))
            .map((inst) => ({ value: inst._id, label: inst.name }))}
          className="basic-multi-select"
          classNamePrefix="select"
          onChange={(selected) =>
            setFormData({
              ...formData,
              instructorIds: selected.map((opt) => opt.value),
            })
          }
        />

        {/* Descriptions */}
        <textarea
          name="shortdescription"
          placeholder="Short Description"
          value={formData.shortdescription}
          onChange={handleChange}
          rows={2}
          className="w-full px-4 py-2 border rounded"
          required
        />
        <textarea
          name="description"
          placeholder="Full Description"
          value={formData.description}
          onChange={handleChange}
          rows={2}
          className="w-full px-4 py-2 border rounded"
          required
        />

        {/* Price & Discount */}
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            name="price"
            placeholder="Price (BDT)"
            value={formData.price}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
          <input
            type="number"
            name="discountPrice"
            placeholder="Discount Price (BDT)"
            value={formData.discountPrice}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
        </div>

        {/* Duration & Level */}
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="duration"
            placeholder="Duration (e.g., 4 weeks)"
            value={formData.duration}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
          <select
            name="level"
            value={formData.level}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        {/* Thumbnail Upload */}
        <div>
          <label className="block mb-1 font-semibold">Course Thumbnail</label>
          <div className="flex items-center gap-4">
            <label
              htmlFor="thumbnail"
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
            id="thumbnail"
            name="thumbnail"
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
            required
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

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 text-white bg-sky-500 rounded-xl hover:bg-sky-600"
        >
          {loading ? "Submitting..." : "Add Course"}
        </button>
      </form>
    </div>
  );
};

export default AddCourse;
