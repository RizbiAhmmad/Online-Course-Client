import { useState, useEffect, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/EduVerse_Logo.png";
import { AuthContext } from "@/provider/AuthProvider";
import { FaUser, FaHome, FaBook, FaPhone } from "react-icons/fa";
import useAxiosPublic from "@/Hooks/useAxiosPublic";
import { FaGaugeHigh } from "react-icons/fa6";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("/");
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logOut } = useContext(AuthContext);
  const [role, setRole] = useState(null);
  const axiosPublic = useAxiosPublic();

  // Add new state at the top
  const [footerInfo, setFooterInfo] = useState(null);

  // Fetch footer info
  useEffect(() => {
    const fetchFooterInfo = async () => {
      try {
        const res = await axiosPublic.get("/footer");
        if (res.data.length > 0) {
          setFooterInfo(res.data[0]);
        }
      } catch (err) {
        console.error("Error fetching footer info:", err);
      }
    };
    fetchFooterInfo();
  }, [axiosPublic]);

  // Fetch user role
  useEffect(() => {
    if (user?.email) {
      axiosPublic
        .get("/users")
        .then((res) => {
          const currentUser = res.data.find((u) => u.email === user.email);
          setRole(currentUser?.role || "user");
        })
        .catch(() => setRole("user"));
    }
  }, [user]);

  const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    // { href: "/courses", label: "Courses" },
    { href: "/contact", label: "Contact" },
  ];

  // Scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      if (location.pathname !== "/") return;

      const scrollPosition = window.scrollY;
      links.forEach((link) => {
        if (!link.href.startsWith("#")) return;
        const section = document.querySelector(link.href);
        if (section) {
          const sectionTop = section.offsetTop;
          const sectionHeight = section.offsetHeight;
          if (
            scrollPosition >= sectionTop - 100 &&
            scrollPosition < sectionTop + sectionHeight - 100
          ) {
            setActiveLink(link.href);
          }
        }
      });
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  const handleLinkClick = (href, e) => {
    e.preventDefault();
    setActiveLink(href);
    setIsOpen(false);

    if (href.startsWith("/")) {
      navigate(href);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const section = document.querySelector(href);
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };

  const handleLogin = () => {
    navigate("/login");
    setIsOpen(false);
  };

  const handleLogOut = () => {
    logOut().catch((error) => console.log(error));
  };

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          scrolled ? "bg-white backdrop-blur-md shadow-lg" : "bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-full px-8 md:px-12">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div
              onClick={() => handleLinkClick("/", { preventDefault: () => {} })}
              className="flex items-center space-x-3 cursor-pointer"
            >
              <img
                src={footerInfo?.logo || logo}
                alt={footerInfo?.name || "Logo"}
                className="h-10 w-10 md:h-12 md:w-12 rounded-full object-cover border-2 border-white shadow-md"
              />
              <h1 className="text-2xl font-extrabold text-sky-400 tracking-wide hover:text-sky-500 transition-colors">
                {footerInfo?.name || "EduVerse"}
              </h1>
            </div>

            {/* 🖥 Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8 bg-white/10 border border-gray-900 px-8 py-3 rounded-3xl backdrop-blur-md">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleLinkClick(link.href, e)}
                  className={`relative font-semibold transition-all duration-300 ${
                    activeLink === link.href
                      ? "text-sky-400"
                      : scrolled
                      ? "text-gray-900 hover:text-sky-300"
                      : "text-gray-900 hover:text-sky-500"
                  }`}
                >
                  {link.label}
                  {activeLink === link.href && (
                    <span className="absolute left-0 -bottom-1 w-full h-0.5 bg-sky-400 rounded-full"></span>
                  )}
                </a>
              ))}

              {/* Dashboard (visible only when logged in) */}
              {user && (
                <Link
                  to="/dashboard"
                  className="font-semibold text-gray-900 hover:text-sky-400 transition-colors"
                >
                  Dashboard
                </Link>
              )}
            </div>

            {/* Auth Buttons (Desktop) */}
            {user ? (
              <button
                onClick={handleLogOut}
                className="hidden md:flex text-md border border-gray-300 bg-red-500 px-3 py-2 rounded-md text-white hover:bg-red-600 items-center"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={handleLogin}
                className="hidden md:flex text-md border border-gray-300 bg-sky-500 px-3 py-2 rounded-md text-white hover:bg-sky-600 items-center"
              >
                <FaUser className="mr-1" /> Login
              </button>
            )}

            {/* Mobile Hamburger */}
            <div className="md:hidden z-50">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg focus:outline-none text-black"
              >
                <div
                  className={`w-6 h-0.5 bg-black transition-all duration-300 ${
                    isOpen ? "rotate-45 translate-y-2" : "mb-1.5"
                  }`}
                />
                <div
                  className={`w-6 h-0.5 bg-black transition-all duration-300 ${
                    isOpen ? "opacity-0" : "mb-1.5"
                  }`}
                />
                <div
                  className={`w-6 h-0.5 bg-black transition-all duration-300 ${
                    isOpen ? "-rotate-45 -translate-y-2" : ""
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Mobile Dropdown */}
          <div
            className={`md:hidden absolute top-16 left-0 w-full bg-linear-to-b from-indigo-600/95 to-sky-700/95 backdrop-blur-xl transition-all duration-500 ease-in-out transform ${
              isOpen
                ? "translate-y-0 opacity-100 max-h-[600px] py-6"
                : "-translate-y-10 opacity-0 max-h-0 overflow-hidden"
            }`}
          >
            <div className="flex flex-col items-center space-y-5 px-6">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleLinkClick(link.href, e)}
                  className={`font-semibold text-lg transition-colors duration-300 ${
                    activeLink === link.href
                      ? "text-sky-300"
                      : "text-white hover:text-sky-200"
                  }`}
                >
                  {link.label}
                </a>
              ))}

              {/* Dashboard (Mobile) */}
              {user && (
                <Link
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:text-sky-300 font-semibold text-lg transition-colors"
                >
                  Dashboard
                </Link>
              )}

              {/* Auth Buttons (Mobile) */}
              {user ? (
                <button
                  onClick={() => {
                    handleLogOut();
                    setIsOpen(false);
                  }}
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-md mt-3"
                >
                  Logout
                </button>
              ) : (
                <button
                  onClick={handleLogin}
                  className="w-full bg-sky-500 hover:bg-sky-600 text-white py-2 rounded-md flex items-center justify-center mt-3"
                >
                  <FaUser className="mr-2" /> Login
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* 📱 Mobile Bottom Navigation (Dashboard-style links) */}
      {user && (
        <div className="fixed bottom-0 left-0 w-full md:hidden bg-white border-t border-gray-200 shadow-lg z-40">
          <div className="flex justify-around py-2">
            <button
              onClick={() => navigate("/")}
              className={`flex flex-col items-center text-sm ${
                location.pathname === "/" ? "text-sky-500" : "text-gray-600"
              }`}
            >
              <FaHome className="text-xl" />
              <span className="text-xs mt-1">Home</span>
            </button>

            <button
              onClick={() => navigate("/courses")}
              className={`flex flex-col items-center text-sm ${
                location.pathname === "/courses"
                  ? "text-sky-500"
                  : "text-gray-600"
              }`}
            >
              <FaBook className="text-xl" />
              <span className="text-xs mt-1">Courses</span>
            </button>

            <button
              onClick={() => navigate("/dashboard")}
              className={`flex flex-col items-center text-sm ${
                location.pathname.startsWith("/dashboard")
                  ? "text-sky-500"
                  : "text-gray-600"
              }`}
            >
              <FaGaugeHigh className="text-xl" />
              <span className="text-xs mt-1">Dashboard</span>
            </button>

            <button
              onClick={() => navigate("/contact")}
              className={`flex flex-col items-center text-sm ${
                location.pathname === "/contact"
                  ? "text-sky-500"
                  : "text-gray-600"
              }`}
            >
              <FaPhone className="text-xl" />
              <span className="text-xs mt-1">Contact</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
