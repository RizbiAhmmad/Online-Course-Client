import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { FaEdit, FaTrashAlt, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Select from "react-select";
import useAxiosPublic from "@/Hooks/useAxiosPublic";

const CLOUD_NAME = "dt3bgis04";
const UPLOAD_PRESET = "eCommerce";

const AllCourses = () => {
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();
  const [editingCourse, setEditingCourse] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [newImage, setNewImage] = useState(null);
  const [selectedInstructors, setSelectedInstructors] = useState([]);

  // Fetch all courses
  const { data: courses = [], refetch } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const res = await axiosPublic.get("/courses");
      return res.data;
    },
  });

  // Fetch active categories
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await axiosPublic.get("/categories");
      return res.data.filter((cat) => cat.status === "active");
    },
  });

  // Fetch active instructors
  const { data: instructors = [] } = useQuery({
    queryKey: ["instructors"],
    queryFn: async () => {
      const res = await axiosPublic.get("/instructors");
      return res.data.filter((inst) => inst.status === "active");
    },
  });

  // Delete Course
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This course will be deleted!",
      icon: "warning",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await axiosPublic.delete(`/courses/${id}`);
        if (res.data.deletedCount > 0) {
          refetch();
          Swal.fire("Deleted!", "Course removed.", "success");
        }
      }
    });
  };

  // Upload image to Cloudinary
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

  // Handle Update
  const handleUpdate = async (e) => {
    e.preventDefault();
    setUploading(true);

    const form = e.target;
    const title = form.title.value;
    const price = Number(form.price.value);
    const discountPrice = Number(form.discountPrice.value);
    const duration = form.duration.value;
    const level = form.level.value;
    const status = form.status.value;
    const shortdescription = form.shortdescription.value;
    const description = form.description.value;

    let imageUrl = editingCourse.thumbnail;
    if (newImage) {
      imageUrl = await uploadImageToCloudinary(newImage);
    }

    const updatedCourse = {
      title,
      price,
      discountPrice,
      duration,
      level,
      status,
      shortdescription,
      description,
      thumbnail: imageUrl,
      instructorIds: selectedInstructors.map((i) => i.value),
    };

    const res = await axiosPublic.put(
      `/courses/${editingCourse._id}`,
      updatedCourse
    );

    if (res.data.modifiedCount > 0) {
      Swal.fire("Updated!", "Course updated successfully!", "success");
      refetch();
      setEditingCourse(null);
      setNewImage(null);
      setSelectedInstructors([]);
    }

    setUploading(false);
  };

  // Handle Edit open
  const handleEdit = (course) => {
    setEditingCourse(course);
    setSelectedInstructors(
      instructors
        .filter((inst) => course.instructorIds?.includes(inst._id))
        .map((inst) => ({ value: inst._id, label: inst.name }))
    );
  };

  return (
    <motion.div
      className="max-w-7xl p-6 mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-4xl font-extrabold text-center mb-10 bg-linear-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent leading-tight">
        Manage Courses
      </h2>

      {/* Add Course Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => navigate("/dashboard/addCourse")}
          className="flex items-center gap-2 px-4 py-2 text-white bg-sky-500 rounded-xl hover:bg-sky-600"
        >
          <FaPlus /> Add Course
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 uppercase">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Thumbnail</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Instructors</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Discount</th>
              <th className="px-4 py-3">Duration</th>
              <th className="px-4 py-3">Level</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course, index) => {
              const category = categories.find(
                (cat) => cat._id === course.categoryId
              );
              const instructorNames = instructors
                .filter((inst) => course.instructorIds?.includes(inst._id))
                .map((inst) => inst.name)
                .join(", ");

              return (
                <tr key={course._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-4">{index + 1}</td>
                  <td className="px-4 py-4">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-14 h-14 object-cover rounded"
                    />
                  </td>
                  <td className="px-4 py-4 font-semibold">{course.title}</td>
                  <td className="px-4 py-4">{category?.name || "—"}</td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col gap-1">
                      {instructors
                        .filter((inst) =>
                          course.instructorIds?.includes(inst._id)
                        )
                        .map((inst) => (
                          <div
                            key={inst._id}
                            className="flex items-center gap-2"
                          >
                            {inst.image && (
                              <img
                                src={inst.image}
                                alt={inst.name}
                                className="w-6 h-6 rounded-full object-cover"
                              />
                            )}
                            <div className="text-sm">
                              <p className="font-medium">{inst.name}</p>
                              {/* <p className="text-gray-500">{inst.email}</p> */}
                            </div>
                          </div>
                        ))}
                    </div>
                  </td>

                  <td className="px-4 py-4">{course.price} BDT</td>
                  <td className="px-4 py-4">{course.discountPrice} BDT</td>
                  <td className="px-4 py-4">{course.duration}</td>
                  <td className="px-4 py-4">{course.level}</td>
                  <td className="px-4 py-4">
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        course.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {course.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 flex gap-3">
                    <button onClick={() => handleEdit(course)}>
                      <FaEdit className="text-xl text-sky-500" />
                    </button>
                    <button onClick={() => handleDelete(course._id)}>
                      <FaTrashAlt className="text-xl text-red-500" />
                    </button>
                  </td>
                </tr>
              );
            })}
            {courses.length === 0 && (
              <tr>
                <td colSpan="11" className="py-6 text-center text-gray-500">
                  No courses found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingCourse && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md relative">
            <button
              onClick={() => setEditingCourse(null)}
              className="absolute top-2 right-3 text-gray-500 text-xl"
            >
              ✖
            </button>
            <h3 className="mb-4 text-xl font-semibold text-center">
              Edit Course
            </h3>

            <form onSubmit={handleUpdate} className="space-y-2">
              <input
                name="title"
                defaultValue={editingCourse.title}
                className="w-full border p-2 rounded"
                placeholder="Course Title"
                required
              />
              <textarea
                name="shortdescription"
                defaultValue={editingCourse.shortdescription}
                className="w-full border p-2 rounded"
                placeholder="Short Description"
              />
              <textarea
                name="description"
                defaultValue={editingCourse.description}
                className="w-full border p-2 rounded"
                placeholder="Full Description"
              />

              {/* Instructor Multi-Select */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Instructors
                </label>
                <Select
                  isMulti
                  options={instructors.map((inst) => ({
                    value: inst._id,
                    label: inst.name,
                  }))}
                  value={selectedInstructors}
                  onChange={setSelectedInstructors}
                  classNamePrefix="select"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input
                  name="price"
                  defaultValue={editingCourse.price}
                  className="w-full border p-2 rounded"
                  placeholder="Price"
                  type="number"
                />
                <input
                  name="discountPrice"
                  defaultValue={editingCourse.discountPrice}
                  className="w-full border p-2 rounded"
                  placeholder="Discount Price"
                  type="number"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input
                  name="duration"
                  defaultValue={editingCourse.duration}
                  className="w-full border p-2 rounded"
                  placeholder="Duration"
                />

                <select
                  name="level"
                  defaultValue={editingCourse.level}
                  className="w-full border p-2 rounded"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <select
                name="status"
                defaultValue={editingCourse.status}
                className="w-full border p-2 rounded"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              {/* Thumbnail */}
              <div>
                <label className="block text-sm font-medium">Thumbnail</label>
                <div className="flex items-center gap-4">
                  <label
                    htmlFor="thumbUpload"
                    className="px-3 py-2 text-white bg-sky-500 rounded cursor-pointer hover:bg-sky-600"
                  >
                    Choose File
                  </label>
                  <span className="text-sm text-gray-600">
                    {newImage ? newImage.name : "Keep current image"}
                  </span>
                </div>
                <input
                  id="thumbUpload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewImage(e.target.files[0])}
                  className="hidden"
                />
                {editingCourse.thumbnail && (
                  <img
                    src={editingCourse.thumbnail}
                    alt="Current Thumbnail"
                    className="w-20 h-20 mt-3 object-cover rounded border"
                  />
                )}
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="w-full py-2 bg-sky-500 text-white rounded hover:bg-sky-600 disabled:opacity-60"
              >
                {uploading ? "Updating..." : "Update Course"}
              </button>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default AllCourses;
