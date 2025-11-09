import Footer from "@/Shared/Footer";
import Navbar from "@/Shared/Navbar";
import ScrollToTop from "@/Shared/ScrollToTop";
import { Outlet, useLocation } from "react-router-dom";

const MainLayout = () => {
const location = useLocation();
  const noHeaderFooter =
    location.pathname.includes("login") || location.pathname.includes("signup");
    return (
        <div className="">
          <ScrollToTop />
            {!noHeaderFooter && <Navbar />}
      <Outlet />
      {!noHeaderFooter && <Footer />}
        </div>
    );
};

export default MainLayout;