import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import useAxiosPublic from "@/Hooks/useAxiosPublic";
import { FaUserGraduate } from "react-icons/fa";

export default function AllEnrollments() {
  const axiosPublic = useAxiosPublic();

  const { data: enrollments = [] } = useQuery({
    queryKey: ["enrollments"],
    queryFn: async () => {
      const res = await axiosPublic.get("/enrollments");
      return res.data;
    },
  });

  // Pagination setup
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(enrollments.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentEnrollments = enrollments.slice(indexOfFirst, indexOfLast);

  return (
    <motion.div
      className="max-w-6xl p-6 mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Title */}
      <h2 className="text-4xl font-extrabold text-center mb-10 bg-linear-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent leading-tight">
        All Enrollments
      </h2>

      {/* Table container */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 uppercase">
            <tr>
              <th className="px-6 py-3">#</th>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Address</th>
              <th className="px-6 py-3">Course</th>
              <th className="px-6 py-3">Amount</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Date & Time</th>
            </tr>
          </thead>
          <tbody>
            {currentEnrollments.map((item, index) => (
              <tr
                key={item._id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="px-6 py-4 font-medium">
                  {indexOfFirst + index + 1}
                </td>
                <td className="px-6 py-4 flex items-center gap-2">
                  <FaUserGraduate className="text-sky-500 text-lg" />
                  <span className="font-semibold">{item.name}</span>
                </td>
                {/* <td className="px-6 py-4 text-gray-600">{item.email}</td> */}
                <td className="px-6 py-4 text-gray-600">
                  <div className="flex">
                    {item.email}
                    <br />
                    {item.phone}
                    <br />
                    {item.address}
                  </div>
                </td>

                <td className="px-6 py-4 font-medium">{item.courseTitle}</td>
                <td className="px-6 py-4 text-gray-700">
                  {item.amount ? `${item.amount} BDT` : "-"}
                  <br/>
                  {item.tranId || "—"}
                </td>
                <td
                  className={`px-6 py-4 font-semibold ${
                    item.status === "success"
                      ? "text-green-600"
                      : item.status === "pending"
                      ? "text-yellow-500"
                      : "text-red-500"
                  }`}
                >
                  {item.status || "N/A"}
                </td>
                <td className="px-6 py-4 text-gray-500 text-sm">
                  {item.paidAt
                    ? new Date(item.paidAt).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })
                    : "—"}
                </td>
              </tr>
            ))}

            {enrollments.length === 0 && (
              <tr>
                <td colSpan="7" className="py-6 text-center text-gray-500">
                  No enrollments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {enrollments.length > itemsPerPage && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>

          {[...Array(totalPages).keys()].map((num) => (
            <button
              key={num}
              onClick={() => setCurrentPage(num + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === num + 1
                  ? "bg-sky-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {num + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </motion.div>
  );
}
