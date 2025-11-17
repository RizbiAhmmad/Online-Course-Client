import Login from "@/Authentication/Login";
import SignUp from "@/Authentication/SignUp";
import Dashboard from "@/Layouts/Dashboard";
import MainLayout from "@/Layouts/MainLayout";
import AddCategory from "@/Pages/Dashboard/Admin/AddCategory";
import AddInstructor from "@/Pages/Dashboard/Admin/AddInstructor";
import AddSlider from "@/Pages/Dashboard/Admin/AddSlider";
import AllCategories from "@/Pages/Dashboard/Admin/AllCategories";
import AllSliders from "@/Pages/Dashboard/Admin/AllSliders";
import AllUsers from "@/Pages/Dashboard/Admin/AllUsers";
import Profile from "@/Pages/Dashboard/Admin/Profile";
import Home from "@/Pages/Home/Home";
import { createBrowserRouter } from "react-router-dom";
import AllInstructors from "../Pages/Dashboard/Admin/AllInstructors";
import AddCourse from "@/Pages/Dashboard/Admin/AddCourse";
import AllCourses from "@/Pages/Dashboard/Admin/AllCourses";
import AddReview from "@/Pages/Dashboard/Admin/AddReview";
import AllReviews from "@/Pages/Dashboard/Admin/AllReviews";
import AllFooterInfo from "@/Pages/Dashboard/Admin/AllFooterInfo";
import AddFooterInfo from "@/Pages/Dashboard/Admin/AddFooterInfo";
import About from "@/Pages/About/About";
import Contact from "@/Pages/Home/Contact";
import AddPolicy from "@/Pages/Dashboard/Admin/AddPolicy";
import AllPolicies from "@/Pages/Dashboard/Admin/AllPolicies";
import PrivacyPolicy from "@/Pages/Home/PrivacyPolicy";
import RefundPolicy from "@/Pages/Home/RefundPolicy";
import TermsConditions from "@/Pages/Home/TermsConditions";
import CourseDetails from "@/Pages/Courses/CourseDetails";
import EnrollForm from "@/Pages/Courses/EnrollForm";
import PrivateRoute from "./PrivateRoute";
import SuccessPage from "@/Pages/Courses/SuccessPage";
import FailPage from "@/Pages/Courses/FailPage";
import CancelPage from "@/Pages/Courses/CancelPage";
import AllEnrollments from "@/Pages/Dashboard/Admin/AllEnrollments";
import MyEnrollments from "@/Pages/Dashboard/User/MyEnrollments";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout></MainLayout>,
    children: [
      {
        path: "/",
        element: <Home></Home>,
      },
      // {
      //   path: "/courses",
      //   element: <h1>Courses Page</h1>,
      // },
      {
        path: "/course/:id",
        element: <CourseDetails />,
      },
      {
        path: "/enroll/:id",
        element: (
          <PrivateRoute>
            <EnrollForm />
          </PrivateRoute>
        ),
      },
      {
        path: "/login",
        element: <Login></Login>,
      },
      {
        path: "/signup",
        element: <SignUp></SignUp>,
      },
      {
        path: "/about",
        element: <About></About>,
      },
      {
        path: "/contact",
        element: <Contact></Contact>,
      },
      {
        path: "privacyPolicy",
        element: <PrivacyPolicy />,
      },
      {
        path: "ReturnAndRefundPolicy",
        element: <RefundPolicy />,
      },
      {
        path: "TermsAndConditions",
        element: <TermsConditions />,
      },
      {
        path: "/payment/success",
        element: <SuccessPage />,
      },
      {
        path: "/payment/fail",
        element: <FailPage />,
      },
      {
        path: "/payment/cancel",
        element: <CancelPage />,
      },
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
        element: <AddSlider></AddSlider>,
      },
      {
        path: "allSliders",
        element: <AllSliders></AllSliders>,
      },
      {
        path: "addCategory",
        element: <AddCategory></AddCategory>,
      },
      {
        path: "allCategories",
        element: <AllCategories></AllCategories>,
      },
      {
        path: "addInstructor",
        element: <AddInstructor></AddInstructor>,
      },
      {
        path: "allInstructors",
        element: <AllInstructors></AllInstructors>,
      },
      {
        path: "addCourse",
        element: <AddCourse></AddCourse>,
      },
      {
        path: "allCourses",
        element: <AllCourses></AllCourses>,
      },
      {
        path: "addReview",
        element: <AddReview></AddReview>,
      },
      {
        path: "allReviews",
        element: <AllReviews></AllReviews>,
      },
      {
        path: "addFooterInfo",
        element: <AddFooterInfo />,
      },
      {
        path: "FooterInfo",
        element: <AllFooterInfo />,
      },
      {
        path: "addPolicy",
        element: <AddPolicy />,
      },
      {
        path: "allPolicies",
        element: <AllPolicies />,
      },
      {
        path: "enrollments",
        element: <AllEnrollments></AllEnrollments>,
      },
      {
        path: "enrollments/:email",
        element: <MyEnrollments></MyEnrollments>,
      },
      {
        path: "profile",
        element: <Profile></Profile>,
      },
    ],
  },
]);
