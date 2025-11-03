import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { FaEdit, FaTrashAlt, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import useAxiosPublic from "@/Hooks/useAxiosPublic";

const CLOUD_NAME = "dt3bgis04";
const UPLOAD_PRESET = "eCommerce";

const AllInstructors = () => {
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();
  const [editingInstructor, setEditingInstructor] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [newImage, setNewImage] = useState(null);

  const { data: instructors = [], refetch } = useQuery({
    queryKey: ["instructors"],
    queryFn: async () => {
      const res = await axiosPublic.get("/instructors");
      return res.data;
    },
  });

  // Delete Instructor
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This instructor will be deleted!",
      icon: "warning",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await axiosPublic.delete(`/instructors/${id}`);
        if (res.data.deletedCount > 0) {
          refetch();
          Swal.fire("Deleted!", "Instructor removed.", "success");
        }
      }
    });
  };

  // Upload Image to Cloudinary
  const uploadImageToCloudinary = async (file) => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", UPLOAD_PRESET);
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      { method: "POST", body: fd }
    );
    const data = await res.json();
    return data.secure_url;
  };

  // Handle Update Instructor
  const handleUpdate = async (e) => {
    e.preventDefault();
    setUploading(true);

    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const education = form.education.value;
    const expertise = form.expertise.value;
    const status = form.status.value;

    let imageUrl = editingInstructor.image;
    const imageFile = newImage;
    if (imageFile) {
      imageUrl = await uploadImageToCloudinary(imageFile);
    }

    const updatedInstructor = { name, email, education, expertise, status, image: imageUrl };
    const res = await axiosPublic.put(
      `/instructors/${editingInstructor._id}`,
      updatedInstructor
    );

    if (res.data.modifiedCount > 0) {
      Swal.fire("Updated!", "Instructor updated successfully!", "success");
      refetch();
      setEditingInstructor(null);
      setNewImage(null);
    }

    setUploading(false);
  };

  return (
    <motion.div
      className="max-w-5xl p-6 mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="leading-relaxed text-4xl font-extrabold text-center mb-10 bg-linear-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
        Manage Instructors
      </h2>

      {/* Add Instructor Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => navigate("/dashboard/addInstructor")}
          className="flex items-center gap-2 px-4 py-2 text-white bg-sky-500 rounded-xl hover:bg-sky-600"
        >
          <FaPlus /> Add Instructor
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 uppercase">
            <tr>
              <th className="px-6 py-3">#</th>
              <th className="px-6 py-3">Image</th>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Education</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Expertise</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {instructors.map((ins, index) => (
              <tr key={ins._id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4">{index + 1}</td>
                <td className="px-6 py-4">
                  <img
                    src={ins.image}
                    alt={ins.name}
                    className="w-12 h-12 object-cover rounded-full"
                  />
                </td>
                <td className="px-6 py-4 font-semibold">{ins.name}</td>
                <td className="px-6 py-4">{ins.education}</td>
                <td className="px-6 py-4">{ins.email}</td>
                <td className="px-6 py-4">{ins.expertise}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 text-xs rounded ${
                      ins.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {ins.status}
                  </span>
                </td>
                <td className="px-6 py-4 flex gap-3">
                  <button onClick={() => setEditingInstructor(ins)}>
                    <FaEdit className="text-xl text-sky-500" />
                  </button>
                  <button onClick={() => handleDelete(ins._id)}>
                    <FaTrashAlt className="text-xl text-red-500" />
                  </button>
                </td>
              </tr>
            ))}
            {instructors.length === 0 && (
              <tr>
                <td colSpan="7" className="py-6 text-center text-gray-500">
                  No instructors found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingInstructor && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md relative">
            <button
              onClick={() => setEditingInstructor(null)}
              className="absolute top-2 right-3 text-gray-500 text-xl"
            >
              ✖
            </button>
            <h3 className="mb-4 text-xl font-semibold text-center">
              Edit Instructor
            </h3>

            <form onSubmit={handleUpdate} className="space-y-4">
              <input
                name="name"
                defaultValue={editingInstructor.name}
                className="w-full border p-2 rounded"
                placeholder="Name"
                required
              />
              <input
                name="email"
                defaultValue={editingInstructor.email}
                className="w-full border p-2 rounded"
                placeholder="Email"
                required
              />
              <input
                name="education"
                defaultValue={editingInstructor.education}
                className="w-full border p-2 rounded"
                placeholder="Education"
                required
              />
              <input
                name="expertise"
                defaultValue={editingInstructor.expertise}
                className="w-full border p-2 rounded"
                placeholder="Expertise"
              />
              <select
                name="status"
                defaultValue={editingInstructor.status}
                className="w-full border p-2 rounded"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              <div>
                <label className="block text-sm font-medium">Image</label>
                <div className="flex items-center gap-4">
                  <label
                    htmlFor="imageUpload"
                    className="px-3 py-2 text-white bg-sky-500 rounded cursor-pointer hover:bg-sky-600"
                  >
                    Choose File
                  </label>
                  <span className="text-sm text-gray-600">
                    {newImage ? newImage.name : "Keep current image"}
                  </span>
                </div>
                <input
                  id="imageUpload"
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={(e) => setNewImage(e.target.files[0])}
                  className="hidden"
                />
                {editingInstructor.image && (
                  <img
                    src={editingInstructor.image}
                    alt="Current"
                    className="w-16 h-16 mt-3 rounded-full border object-cover"
                  />
                )}
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="w-full py-2 bg-sky-500 text-white rounded hover:bg-sky-600 disabled:opacity-60"
              >
                {uploading ? "Updating..." : "Update Instructor"}
              </button>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default AllInstructors;
