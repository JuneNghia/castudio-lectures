import { ConfigProvider } from "antd";
import { RouterProvider } from "react-router-dom";
import router from "./routes";
import { Suspense } from "react";
import Loader from "./components/Loader";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App(): JSX.Element {
  return (
    <Suspense fallback={<Loader />}>
      <ConfigProvider>
        <RouterProvider router={router} />

        <ToastContainer />
      </ConfigProvider>
    </Suspense>
  );
}

export default App;
