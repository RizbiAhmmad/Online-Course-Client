import React, { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink, Outlet } from "react-router-dom";
import {
  FaHome,
  FaUsers,
  FaChartLine,
  FaCog,
  FaBars,
  FaTimes,
  FaReceipt,
  FaUserCircle,
} from "react-icons/fa";
import useAxiosPublic from "@/Hooks/useAxiosPublic";
import { AuthContext } from "@/provider/AuthProvider";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const axiosPublic = useAxiosPublic();
  const [userRole, setUserRole] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (user?.email) {
      axiosPublic
        .get("/users/role", { params: { email: user.email } })
        .then((res) => setUserRole(res.data.role))
        .catch((err) => console.error("Error fetching role:", err));
    }
  }, [axiosPublic, user]);

  if (!userRole) return <div>Loading...</div>;

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const menuItems =
    userRole === "admin"
      ? [
          { to: "/", icon: <FaHome />, label: "Home" },
          // { to: "/dashboard/allProducts", icon: <FaChartLine />, label: "Products" },
          { to: "/dashboard/allUsers", icon: <FaUsers />, label: "Users" },
          { to: "/dashboard/allCourses", icon: <FaReceipt />, label: "Courses" },
          { to: "/dashboard/settings", icon: <FaCog />, label: "Settings" },
        ]
      : [
          { to: "/", icon: <FaHome />, label: "Home" },
          { to: "/dashboard/myCourses", icon: <FaReceipt />, label: "My Courses" },
          { to: "/dashboard/profile", icon: <FaUserCircle />, label: "Profile" },
        ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar for desktop */}
      <aside className="hidden md:flex md:flex-col md:w-64 bg-white shadow-lg border-r border-gray-200">
        <div className="flex items-center justify-center py-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
        </div>
        <ul className="flex-1 overflow-y-auto p-4 space-y-2">
          {menuItems.map((item, idx) => (
            <li key={idx}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? "bg-linear-to-r from-sky-500 to-purple-500 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="px-4 py-3 border-t border-gray-200 text-sm text-gray-600 text-center">
          <span className="font-semibold text-gray-800">
            {user.displayName || "User"}
          </span>
        </div>
      </aside>

      {/* Sidebar for mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ duration: 0.3 }}
            className="fixed z-40 top-0 left-0 h-full w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col md:hidden"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
              <button onClick={toggleSidebar}>
                <FaTimes className="text-gray-600 text-xl" />
              </button>
            </div>
            <ul className="flex-1 overflow-y-auto p-4 space-y-2">
              {menuItems.map((item, idx) => (
                <li key={idx}>
                  <NavLink
                    to={item.to}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                        isActive
                          ? "bg-linear-to-r from-sky-500 to-purple-500 text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`
                    }
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
        ></div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <div className="sticky top-0 z-20 bg-sky-100 border-b border-gray-200 flex items-center justify-between px-4 py-4 shadow-sm">
          <button onClick={toggleSidebar} className="md:hidden">
            <FaBars className="text-xl text-gray-700" />
          </button>

          <h1 className="text-lg md:text-xl font-semibold text-gray-800 mx-auto text-center">
            Welcome, {user.displayName || "User"}
          </h1>

          <div className="w-6 md:w-8"></div>
        </div>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>

      {/* Bottom Nav for Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center py-2 md:hidden shadow-lg">
        {userRole === "admin"
          ? [
              { to: "/", icon: <FaHome />, label: "Home" },
              { to: "/dashboard/allProducts", icon: <FaChartLine />, label: "Products" },
              { to: "/dashboard/allOrders", icon: <FaReceipt />, label: "Orders" },
            ].map((item, idx) => (
              <NavLink
                key={idx}
                to={item.to}
                className={({ isActive }) =>
                  `flex flex-col items-center text-sm ${
                    isActive ? "text-red-500" : "text-gray-500"
                  }`
                }
              >
                {item.icon}
                <span className="text-xs mt-1">{item.label}</span>
              </NavLink>
            ))
          : [
              { to: "/", icon: <FaHome />, label: "Home" },
              { to: "/dashboard/myOrders", icon: <FaReceipt />, label: "Orders" },
              { to: "/dashboard/profile", icon: <FaUserCircle />, label: "Profile" },
            ].map((item, idx) => (
              <NavLink
                key={idx}
                to={item.to}
                className={({ isActive }) =>
                  `flex flex-col items-center text-sm ${
                    isActive ? "text-red-500" : "text-gray-500"
                  }`
                }
              >
                {item.icon}
                <span className="text-xs mt-1">{item.label}</span>
              </NavLink>
            ))}
      </nav>
    </div>
  );
};

export default Dashboard;
