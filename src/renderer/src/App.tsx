import { RouterProvider } from "react-router-dom";
import router from "./routes";
import { Suspense, useEffect, useState } from "react";
import Loader from "./components/Loader";
import { Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Error from "./components/Error";
import { checkHealth } from "./services/health.service";

function App(): JSX.Element {
  const [isOK, setIsOK] = useState(true);

  useEffect(() => {
    checkHealth().catch(() => {
      setIsOK(false);
    });
  }, []);

  if (!isOK) {
    return <Error height="100vh"/>;
  }

  return (
    <Suspense fallback={<Loader />}>
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
    </Suspense>
  );
}

export default App;
