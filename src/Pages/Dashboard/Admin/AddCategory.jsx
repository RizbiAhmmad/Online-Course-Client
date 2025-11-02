import React, { useState, useContext } from "react";
import { AuthContext } from "../../../provider/AuthProvider";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useAxiosPublic from "@/Hooks/useAxiosPublic";

const AddCategory = () => {
  const { user } = useContext(AuthContext);
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    status: "active",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Submit to backend
      const categoryData = {
        ...formData,
        email: user?.email,
      };

      const res = await axiosPublic.post(
        "/categories",
        JSON.stringify(categoryData),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.insertedId) {
        Swal.fire("Success", "Category added successfully!", "success");
        setFormData({ name: "", status: "active" });
        navigate("/dashboard/allCategories");
      } else {
        Swal.fire("Error", "Server error. Category not added.", "error");
      }
    } catch (err) {
      console.error(
        "❌ Add Category Error:",
        err.response?.data || err.message
      );
      Swal.fire("Error", "Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl p-6 mx-auto mt-6 bg-white rounded-lg shadow-md">
      <h2 className="mb-6 text-2xl font-bold text-center">Add New Category</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">Name</label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="Category Name"
            className="w-full px-4 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 text-white bg-sky-500 rounded-xl hover:bg-sky-600"
        >
          {loading ? "Submitting..." : "Add Category"}
        </button>
      </form>
    </div>
  );
};

export default AddCategory;
