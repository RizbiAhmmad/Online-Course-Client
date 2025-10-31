
import Login from "@/Authentication/Login";
import SignUp from "@/Authentication/SignUp";
import MainLayout from "@/Layouts/MainLayout";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout></MainLayout>,
    children: [
      {
        path: "/",
        // element: <h1>Hiii</h1>
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
]);
