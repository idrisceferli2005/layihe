import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Admin from "./pages/admin/Admin";
import Register from "./pages/auth/register/Register";
import Login from "./pages/auth/login/Login";
import ForgotPassword from "./pages/auth/forgotpassword/ForgotPassword";
import Resetpassword from "./pages/auth/resetpassword/Resetpassword";
import Profile from "./pages/profile/Profile";
import ErrorBoundary from "./pages/ErrorBoundary";


import Posts from "./pages/post/Posts";
import Search from "./pages/search/Search";
import PostDetail from "./pages/postDetail/PostDetail";
import EditProfile from "./components/editprofile/EditProfile";
import ProtectAdmin from "./routes/ProtectAdmin";
import Notifications from "./pages/notifications/Notifications";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/admin",
        element: <ProtectAdmin />,
        children: [
          {
            path: "/admin",
            element: <Admin />,
          },
        ],
      },
      {
        path: "/profile/:id",
        element: <Profile />,
      },
      {
        path: "/edit-profile/:id",
        element: <EditProfile />,
      },
      {
        path: "/forgotpassword",
        element: <ForgotPassword />,
      },
      {
        path: "/resetpassword/:token",
        element: <Resetpassword />,
      },
      {
        path: "/search",
        element: <Search />,
      },
      {
        path: "/notifications",
        element: <Notifications />,
      },
      {
        path: "/posts",
        element: <Posts />,
      },
      {
        path: "/post/:id",
        element: <PostDetail />,
      },
    ],
  },
 
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
