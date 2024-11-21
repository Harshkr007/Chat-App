import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import RegisterPage from "../pages/RegisterPage";
import Home from "../pages/Home";
import MessagePage from "../components/MessagePage";
import AuthLayouts from "../layout/AuthLayout.jsx";
import Login from "../pages/Login";
import ForgotPasswordPage from "../pages/ForgotPasswordPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
        children: [
          {
            path: "/:userId",
            element: <MessagePage />,
          },
        ],
      },
      {
        path: "/register",
        element: (
          <AuthLayouts>
            <RegisterPage />
          </AuthLayouts>
        ),
      },
      {
        path: "/login",
        element: (
          <AuthLayouts>
            <Login />
          </AuthLayouts>
        ),
      },
      {
        path: "/forgot-password",
        element: <ForgotPasswordPage />,
      },
    ],
  },
]);
export default router;
