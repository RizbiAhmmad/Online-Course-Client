
import Login from "@/Authentication/Login";
import SignUp from "@/Authentication/SignUp";
import Dashboard from "@/Layouts/Dashboard";
import MainLayout from "@/Layouts/MainLayout";
import AddSlider from "@/Pages/Dashboard/Admin/AddSlider";
import AllSliders from "@/Pages/Dashboard/Admin/AllSliders";
import AllUsers from "@/Pages/Dashboard/Admin/AllUsers";
import Profile from "@/Pages/Dashboard/Admin/Profile";
import Home from "@/Pages/Home/Home";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout></MainLayout>,
    children: [
      {
        path: "/",
        element: <Home></Home>
      },
      {
        path: "/courses",
        element: <h1>Courses Page</h1>
      },
    
      {
        path: "/login",
        element:<Login></Login>,
      },
      {
        path: "/signup",
        element: <SignUp></SignUp>,
      }
    ],
  },

  {
    path: "dashboard",
    element: <Dashboard></Dashboard>,
    children: [
      {
        path: "allUsers",
        element: <AllUsers></AllUsers>,
      },
      {
        path: "addSlider",
        element:<AddSlider></AddSlider>
      },
      {
        path: "allSliders",
        element:<AllSliders></AllSliders>
      },
      {
        path: "profile",
        element:<Profile></Profile>
      },
    ],
  },
]);
