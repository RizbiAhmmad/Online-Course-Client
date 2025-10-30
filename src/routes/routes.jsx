
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
    //   {
    //     path: "about",
    //     element: <AboutPage></AboutPage>,
    //   },
    //   {
    //     path: "services",
    //     element: <ServicesPage></ServicesPage>,
    //   },
    //   {
    //     path: "contact",
    //     element: <ContactPage></ContactPage>,
    //   },
    ],
  },
]);
