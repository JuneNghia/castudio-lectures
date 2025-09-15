import { useCallback, useEffect, useRef, useState } from "react";
import { Card, Button, Upload, Progress, message, Modal, Tooltip } from "antd";
import {
  CopyOutlined,
  DeleteOutlined,
  PauseOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useFile } from "@renderer/hooks/useFile";
import { File } from "@renderer/interfaces/file.interface";
import notify from "@renderer/common/function/notify";
import Loader from "@renderer/components/Loader";
import {
  showAlert,
  showAlertConfirm,
  showAlertError,
} from "@renderer/common/function/swalAlert";
import showLoading from "@renderer/common/function/showLoading";
import BackBtn from "@renderer/components/Button/BackBtn";
import axios from "axios";
import Error from "@renderer/components/Error";

const token = await window.electronAPI.readToken();

const RepoManagement = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [totalSize, setTotalSize] = useState(0);
  const [maxSize, setMaxSize] = useState(0);
  const [loadedSize, setLoadedSize] = useState(0);
  const [fileUploadSize, setFileUploadSize] = useState(0);
  const cancelUploadRef = useRef<any>(null);

  const { dataFileAPI, isPending, refetch, deleteFileByFileName, isError } =
    useFile();

  useEffect(() => {
    if (dataFileAPI) {
      setFiles(dataFileAPI.files);
      setTotalSize(dataFileAPI.totalSizeMB);
      setMaxSize(dataFileAPI.maxStorageSizeMB);
    }
  }, [dataFileAPI]);

  const deleteFile = useCallback((fileName: string) => {
    showAlertConfirm({
      title: "Xóa video",
      icon: "warning",
      confirmButtonText: "Xóa",
      confirmButtonColor: "red",
      html: `Bạn có chắc chắn muốn xóa vĩnh viễn Video <br/><b>${fileName}</b>? <br/><br/><span class='font-bold text-red-700'>Lưu ý: Thao tác này không thể khôi phục</span>"`,
    }).then((confirm) => {
      if (confirm.isConfirmed) {
        showLoading(true);
        deleteFileByFileName({ fileName })
          .then(() => {
            showAlert(
              "Thành công",
              `Video <b>${fileName}</b> đã bị xóa vĩnh viễn`,
              "success"
            ).then((confirm) => {
              if (confirm.isConfirmed) {
                refetch();
              }
            });
          })
          .catch((err) => {
            showAlertError(err);
          });
      }
    });
  }, []);

  const handleUpload = useCallback(({ file }) => {
    const formData = new FormData();
    formData.append("file", file);

    const cancelToken = axios.CancelToken;
    const source = cancelToken.source();
    cancelUploadRef.current = source;

    setIsUploading(true);
    axios
      .post(`${import.meta.env.VITE_API_URL}/file/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        cancelToken: source.token,
        onUploadProgress: (progressEvent) => {
          if (progressEvent && progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );

            setUploadProgress(percentCompleted);
            setLoadedSize(
              parseFloat((progressEvent.loaded / (1024 * 1024)).toFixed(2))
            );
            setFileUploadSize(
              parseFloat((progressEvent.total / (1024 * 1024)).toFixed(2))
            );
          } else {
            notify("error", "Lỗi khi lấy % upload");
          }
        },
      })
      .then(() => {
        message.success("Tải lên thành công");
        setIsUploading(false);
        setUploadProgress(0);
        refetch();
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          message.info("Tải lên đã bị hủy");
        } else {
          showAlertError(err);
        }
        setIsUploading(false);
      });
  }, []);

  const handleCancelUpload = useCallback(() => {
    if (cancelUploadRef.current) {
      cancelUploadRef.current.cancel("Người dùng đã hủy tải lên");
    }
  }, [cancelUploadRef]);

  if (isPending) {
    return <Loader />;
  }

  if (isError) {
    return <Error />;
  }

  return (
    <div>
      <div className="mt-4">
        <BackBtn />
      </div>
      <div className="flex justify-between my-4 items-center">
        <div>
          <h4>
            Tổng dung lượng đã sử dụng: {totalSize} MB /{" "}
            <span>{maxSize} MB</span>
          </h4>
        </div>

        <div>
          <Upload customRequest={handleUpload} showUploadList={false}>
            <Button type="primary" icon={<UploadOutlined />}>
              Tải lên Video mới
            </Button>
          </Upload>
        </div>
      </div>

      <div className="pb-8 grid grid-cols-3 gap-4">
        {files.map((item) => (
          <Card
            key={item.name}
            title={item.name}
            className="border border-blue-700"
            extra={
              <div>
                <Tooltip title="Sao chép tên Video">
                  <Button
                    type="primary"
                    shape="circle"
                    icon={<CopyOutlined />}
                    onClick={() => {
                      navigator.clipboard.writeText(item.name);
                      message.success("Sao chép thành công");
                    }}
                    style={{ marginRight: 8 }}
                  />
                </Tooltip>

                <Tooltip title="Xóa">
                  <Button
                    type="primary"
                    danger
                    shape="circle"
                    icon={<DeleteOutlined />}
                    onClick={() => deleteFile(item.name)}
                  />
                </Tooltip>
              </div>
            }
          >
            <p>Dung lượng: {item.sizeMB} MB</p>
          </Card>
        ))}
      </div>

      <Modal
        maskClosable={false}
        keyboard={false}
        open={isUploading}
        footer={null}
        closable={false}
      >
        <Progress
          percent={uploadProgress}
          status={uploadProgress < 100 ? "active" : "success"}
        />
        <p>{`Đã tải lên: ${loadedSize} MB / ${fileUploadSize} MB`}</p>

        <div className="flex mt-4 justify-end">
          <Button onClick={handleCancelUpload} danger>
            <PauseOutlined />
            Ngừng tải lên
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default RepoManagement;
