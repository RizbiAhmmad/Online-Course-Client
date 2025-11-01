import useAxiosPublic from "@/Hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { FaTrashAlt } from "react-icons/fa";
import { motion } from "framer-motion";

const AllUsers = () => {
  const axiosPublic = useAxiosPublic();

  const { data: users = [], refetch } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axiosPublic.get("/users");
      return res.data;
    },
  });

  const handleChangeRole = (userId, newRole) => {
    axiosPublic
      .patch(`/users/${userId}/role`, { role: newRole })
      .then((res) => {
        if (res.data.modifiedCount > 0) {
          refetch();
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: `Role updated to ${newRole}`,
            showConfirmButton: false,
            timer: 1500,
          });
        }
      });
  };

  const handleDeleteUser = (user) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosPublic.delete(`/users/${user._id}`).then((res) => {
          if (res.data.deletedCount > 0) {
            refetch();
            Swal.fire("Deleted!", "User has been removed.", "success");
          }
        });
      }
    });
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-sky-100 text-sky-700 border-sky-400";
      case "manager":
        return "bg-blue-100 text-blue-700 border-blue-400";
      case "instructor":
        return "bg-green-100 text-green-700 border-green-400";
      case "moderator":
        return "bg-purple-100 text-purple-700 border-purple-400";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  return (
    <motion.div
      className="p-8 max-w-6xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-4xl font-extrabold text-center mb-10 bg-linear-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
        Manage All Users
      </h2>

      <div className="overflow-x-auto rounded-2xl shadow-xl bg-white border border-gray-100">
        <table className="w-full text-sm text-left table-auto">
          <thead className="bg-linear-to-r from-gray-100 to-gray-200 text-gray-700 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-3">#</th>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user, index) => (
              <motion.tr
                key={user._id}
                className="hover:bg-gray-50 transition-all duration-300"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <td className="px-6 py-4 font-medium text-gray-700">
                  {index + 1}
                </td>
                <td className="px-6 py-4">{user.name}</td>
                <td className="px-6 py-4 text-gray-600">{user.email}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full border ${getRoleColor(
                        user.role
                      )}`}
                    >
                      {user.role || "user"}
                    </span>
                    <select
                      value={user.role || "user"}
                      onChange={(e) =>
                        handleChangeRole(user._id, e.target.value)
                      }
                      className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring focus:ring-green-200"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                      <option value="manager">Manager</option>
                      <option value="instructor">Instructor</option>
                      <option value="moderator">Moderator</option>
                    </select>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => handleDeleteUser(user)}
                    className="text-red-600 hover:text-white hover:bg-red-600 p-2 rounded-full transition-all duration-300"
                    title="Delete User"
                  >
                    <FaTrashAlt className="text-lg" />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default AllUsers;
