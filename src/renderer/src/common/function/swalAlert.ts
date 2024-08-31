import { primaryColor } from "@renderer/constants";
import Swal, { SweetAlertIcon, SweetAlertOptions } from "sweetalert2";

export const showAlertConfirm = async (props: SweetAlertOptions) => {
  return await Swal.fire({
    showCancelButton: true,
    cancelButtonText: "Hủy",
    confirmButtonText: "Lưu",
    allowEscapeKey: false,
    allowOutsideClick: false,
    confirmButtonColor: primaryColor,
    focusConfirm: true,
    allowEnterKey: true,
    ...props,
  });
};

export const showAlert = async (
  title: string,
  html: string,
  icon: SweetAlertIcon | undefined
) => {
  return await Swal.fire({
    title: title,
    html: html,
    icon: icon,
    confirmButtonColor: primaryColor,
    focusConfirm: true,
    allowEnterKey: true,
    allowEscapeKey: false,
    allowOutsideClick: false,
  });
};

export const showAlertError = async (err: any) => {
  const message = err.response?.data?.message;

  return await Swal.fire({
    title: "Thất bại",
    html: message ? message : "Đã xảy ra lỗi",
    icon: "error",
    confirmButtonColor: primaryColor,
    focusConfirm: true,
    allowEnterKey: true,
    allowEscapeKey: false,
    allowOutsideClick: false
  });
};
