import { useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import img403 from "@renderer/assets/images/noPermission.svg";
import img404 from "@renderer/assets/images/notFound.svg";
import img500 from "@renderer/assets/images/serverError.svg";
import { Button, Typography } from "antd";
import { SyncOutlined } from "@ant-design/icons";

interface Error {
  code: number;
  title: string;
  subTitle: string;
  img: string;
}

const listHttpCode = [
  {
    code: 404,
    title: "Không tìm thấy trang",
    subTitle:
      "Trang bạn đang cố gắng truy cập không tồn tại hoặc đã được chuyển sang trang mới vĩnh viễn",
    img: img404,
  },
  {
    code: 403,
    title: "Truy cập bị từ chối",
    subTitle:
      "Bạn không có quyền truy cập trang này, vui lòng liên hệ quản trị viên để biết thêm thông tin",
    img: img403,
  },
  {
    code: 500,
    title: "Lỗi kết nối máy chủ",
    subTitle:
      "Đã xảy ra lỗi khi kết nối tới máy chủ, vui lòng liên hệ quản trị viên để biết thêm thông tin",
    img: img500,
  },
];

const Error = ({
  httpCode = 500,
  height,
}: {
  httpCode?: 404 | 403 | 500;
  height?: string;
}) => {
  const [dataErr, setDataErr] = useState<Error>(listHttpCode[0]);

  const handleResetApp = useCallback(() => {
    window.electronAPI.resetApp();
  }, []);

  useEffect(() => {
    if (httpCode) {
      const foundErr = listHttpCode.find((err) => err.code === httpCode);
      if (foundErr) {
        setDataErr(foundErr);
      } else {
        setDataErr(listHttpCode[0]);
      }
    }
  }, [httpCode]);

  return (
    <>
      <Helmet>
        <title>{dataErr.title}</title>
      </Helmet>
      <div
        className="h-screen w-screen flex justify-center items-center"
        style={{
          minHeight: httpCode === 403 ? "80vh" : height || "80vh",
        }}
      >
        <div>
          <div
            style={{
              alignItems: "center",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                marginBottom: 3,
                textAlign: "center",
              }}
            >
              <img
                alt={`img_${dataErr.code}`}
                src={dataErr.img}
                style={{
                  display: "inline-block",
                  maxWidth: "100%",
                  width: 400,
                }}
              />
            </div>
            <Typography.Title className="mt-4">
              {dataErr.code}: {dataErr.title.toUpperCase()}
            </Typography.Title>
            <Typography.Text>{dataErr.subTitle}</Typography.Text>

            <Button type="primary" className="mt-4" onClick={handleResetApp}>
              <SyncOutlined />
              Khởi động lại ứng dụng
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Error;
