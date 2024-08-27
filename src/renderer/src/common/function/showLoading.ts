import Swal from "sweetalert2";

const showLoading = (isLoading: boolean) => {
  if (isLoading) {
    Swal.fire({
      allowOutsideClick: false,
      allowEnterKey: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
      customClass: {
        popup: "custom-popup-loading",
        loader: "custom-popup-spinner",
      },
    });
  } else {
    Swal.close();
  }
};

export default showLoading;
