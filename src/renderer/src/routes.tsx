import { createHashRouter } from "react-router-dom";
import Layout from "./layout";
import AuthGuard from "./components/AuthGuard";
import { lazy } from "react";

const SignIn = lazy(() => import("./containers/Auth/SignIn"));
const SignUp = lazy(() => import("./containers/Auth/SignUp"));

const router = createHashRouter([
  {
    path: "/",
    element: (
      <AuthGuard>
        <Layout />
      </AuthGuard>
    ),
  },
  {
    path: "/sign-in",
    element: <SignIn />,
  },
  {
    path: "/sign-up",
    element: <SignUp />,
  },
]);

export default router;
