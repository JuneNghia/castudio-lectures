import { ConfigProvider } from "antd";
import { RouterProvider } from "react-router-dom";
import router from "./routes";
import { Suspense } from "react";
import Loader from "./components/Loader";
import { Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App(): JSX.Element {
  return (
    <Suspense fallback={<Loader />}>
      <ConfigProvider>
        <RouterProvider router={router} />

        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          limit={1}
          transition={Slide}
        />
      </ConfigProvider>
    </Suspense>
  );
}

export default App;
