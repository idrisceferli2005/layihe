import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Category from "./pages/Category";
import Men from "./pages/Men";
import Women from "./pages/Women";
import Latest from "./pages/Latest";
import Admin from "./pages/admin/Admin";
import Register from "./pages/auth/register/Register";
import Login from "./pages/auth/login/Login";
import ForgotPassword from "./pages/auth/forgotpassword/ForgotPassword";
import Resetpassword from "./pages/auth/resetpassword/Resetpassword";
import Profile from "./pages/profile/Profile";
import ErrorBoundary from "./pages/ErrorBoundary";
import Search from "./pages/Search";
import Notifications from "./pages/Notifications";
import Posts from "./pages/Posts";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorBoundary />, // ErrorBoundary komponentini əlavə edin
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/category",
        element: <Category />,
      },
      {
        path: "/men",
        element: <Men />,
      },
      {
        path: "/women",
        element: <Women />,
      },
      {
        path: "/latest",
        element: <Latest />,
      },
      {
        path: "/admin",
        element: <Admin />,
      },
      {
        path: "/profile/:id",
        element: <Profile />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/login",
        element: <Login />,
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
        element: <Search/>
      },
      {
        path: "/notifications",
        element: <Notifications />,
      },
      {
        path: "/posts",
        element: <Posts />,
      },
    ],
  },
]);

function App() {

  return <RouterProvider router={router} />;
}

export default App;