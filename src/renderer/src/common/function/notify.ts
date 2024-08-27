import { Slide, toast } from "react-toastify";

const notify = (type: "success" | "error" | "info", text: string | undefined) => {
  const defaultConfig: any = {
    position: "top-center",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "colored",
    limit: 1,
    transition: Slide,
  };
  if (type === "success") {
    toast.success(text, {
      ...defaultConfig,
    });
  }
  if (type === "error") {
    toast.error(text, {
      ...defaultConfig,
    });
  } else if (type === "info") {
    toast.info(text, {
      ...defaultConfig,
    });
  }
};

export default notify;
