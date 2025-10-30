import Navbar from "@/Shared/Navbar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {

    return (
        <div>
            <Navbar></Navbar>
            <Outlet></Outlet>
            {/* <Footer></Footer> */}
        </div>
    );
};

export default MainLayout;