import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "@/Hooks/useAxiosPublic";
import { useContext } from "react";
import { AuthContext } from "@/provider/AuthProvider";
import { motion } from "framer-motion";

export default function MyEnrollments() {
  const axiosPublic = useAxiosPublic();
  const { user } = useContext(AuthContext);

  const { data: enrollments = [] } = useQuery({
    queryKey: ["userEnrollments", user?.email],
    queryFn: async () => {
      const res = await axiosPublic.get(`/enrollments/${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        My Enrollments
      </h2>

      {enrollments.length === 0 ? (
        <p className="text-center text-gray-500 text-lg mt-10">
          You haven’t enrolled in any course yet.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrollments.map((item) => (
            <motion.div
              key={item._id}
              className="bg-white rounded-xl shadow-lg overflow-hidden border hover:shadow-2xl transition-shadow duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={item.courseImage}
                alt={item.courseTitle}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {item.courseTitle}
                </h3>
                <p className="text-sm text-gray-500 mb-2">
                  Enrolled on:{" "}
                  {new Date(item.paidAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <p className="text-sm text-gray-500 mb-2">
                  Transaction ID: <span className="font-mono">{item.tranId}</span>
                </p>
                <p className="text-lg font-semibold text-green-600">
                  Paid: {item.amount} BDT
                </p>
                <button className="mt-3 w-full bg-sky-500 text-white py-2 rounded-lg hover:bg-sky-600 transition-colors">
                  Go to Course
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
