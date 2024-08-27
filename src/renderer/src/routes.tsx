import { createHashRouter } from "react-router-dom";
import Layout from "./layout";
import AuthGuard from "./components/Guard/AuthGuard";
import { lazy } from "react";

const SignIn = lazy(() => import("./containers/Auth/SignIn"));
const SignUp = lazy(() => import("./containers/Auth/SignUp"));
const Homepage = lazy(() => import("./containers/Home"));

const router = createHashRouter([
  {
    path: "/",
    element: (
      <AuthGuard>
        <Layout />
      </AuthGuard>
    ),
    children: [
      {
        path: "/",
        element: <Homepage />,
      },
    ],
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
