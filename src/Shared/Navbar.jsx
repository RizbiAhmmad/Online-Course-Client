/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/EduVerse_Logo.png";
import { MdAddCall } from "react-icons/md";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("/");
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/courses", label: "Courses" },
    { href: "/contact", label: "Contact" },
  ];
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

    // Page route navigation
    if (href.startsWith("/")) {
      navigate(href);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Section scroll navigation (like #services)
    const section = document.querySelector(href);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled ? "bg-white backdrop-blur-md shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between h-16">
          {/*  Logo & Name */}
          <div
            onClick={() => handleLinkClick("/", { preventDefault: () => {} })}
            className="flex items-center space-x-3 cursor-pointer"
          >
            <img
              src={logo}
              alt="Logo"
              className="h-10 w-10 md:h-12 md:w-12 rounded-full object-cover border-2 border-white shadow-md"
            />
            <h1 className="text-2xl font-extrabold text-sky-400 tracking-wide hover:text-sky-500 transition-colors">
              EduVerse
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
          </div>

          {/*  Call Button (Desktop Only) */}
          <div className="hidden md:flex items-center">
            <button className="px-4 py-3 text-lg font-semibold text-white bg-linear-to-r from-sky-500 to-purple-600 rounded-xl shadow-md hover:opacity-90 transition-all">
              Login
            </button>
          </div>

          {/*  Mobile Hamburger */}
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

        {/*  Mobile Dropdown */}
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

            <button className="px-6 py-3 text-lg font-semibold text-white bg-linear-to-r from-sky-500 to-purple-600 rounded-xl shadow-md hover:opacity-90 transition-all">
              Login
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
