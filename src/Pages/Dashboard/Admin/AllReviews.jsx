import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { FaTrashAlt, FaStar, FaPlus } from "react-icons/fa";
import { motion } from "framer-motion";
import useAxiosPublic from "@/Hooks/useAxiosPublic";

const AllReviews = () => {
  const axiosPublic = useAxiosPublic();

  // Fetch Reviews
  const { data: reviews = [], refetch } = useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      const res = await axiosPublic.get("/reviews");
      return res.data;
    },
  });

  // Delete Review
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This review will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await axiosPublic.delete(`/reviews/${id}`);
        if (res.data.deletedCount > 0) {
          refetch();
          Swal.fire("Deleted!", "Review has been removed.", "success");
        }
      }
    });
  };

  // Render star rating
  const renderStars = (count) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar
          key={i}
          className={`inline-block ${
            i <= count ? "text-yellow-400" : "text-gray-300"
          }`}
        />
      );
    }
    return stars;
  };

  return (
    <motion.div
      className="max-w-6xl p-6 mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-4xl font-extrabold text-center mb-10 bg-linear-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent leading-tight">
        Manage Reviews
      </h2>

      {/* Add Review Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => navigate("/dashboard/addReview")}
          className="flex items-center gap-2 px-4 py-2 text-white bg-sky-500 rounded-xl hover:bg-sky-600"
        >
          <FaPlus /> Add Review
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
              <th className="px-6 py-3">Batch</th>
              <th className="px-6 py-3">Rating</th>
              <th className="px-6 py-3">Feedback</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review, index) => (
              <tr key={review._id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4">{index + 1}</td>
                <td className="px-6 py-4">
                  <img
                    src={review.image}
                    alt={review.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </td>
                <td className="px-6 py-4 font-semibold">{review.name}</td>
                <td className="px-6 py-4">{review.batch}</td>
                <td className="px-6 py-4">{renderStars(review.rating)}</td>
                <td className="px-6 py-4 text-gray-600">
                  {review.feedback.length > 50
                    ? review.feedback.slice(0, 50) + "..."
                    : review.feedback}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {review.email}
                </td>
                <td className="px-6 py-4 text-center">
                  <button onClick={() => handleDelete(review._id)}>
                    <FaTrashAlt className="text-xl text-red-500 hover:text-red-600 transition" />
                  </button>
                </td>
              </tr>
            ))}

            {reviews.length === 0 && (
              <tr>
                <td colSpan="8" className="py-6 text-center text-gray-500">
                  No reviews found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default AllReviews;
