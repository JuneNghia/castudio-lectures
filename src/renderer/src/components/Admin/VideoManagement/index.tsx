import { DeleteOutlined, PlusOutlined, SaveOutlined } from "@ant-design/icons";
import showLoading from "@renderer/common/function/showLoading";
import {
  showAlert,
  showAlertConfirm,
  showAlertError,
} from "@renderer/common/function/swalAlert";
import BackBtn from "@renderer/components/Button/BackBtn";
import Error from "@renderer/components/Error";
import Loader from "@renderer/components/Loader";
import { useClass } from "@renderer/hooks/useClass";
import { useFile } from "@renderer/hooks/useFile";
import { useVideo } from "@renderer/hooks/useVideo";
import { Class } from "@renderer/interfaces/class.interface";
import { File } from "@renderer/interfaces/file.interface";
import { Video } from "@renderer/interfaces/video.interface";
import { Badge, Button, Card, Input, List, Select, Typography } from "antd";
import dayjs from "dayjs";
import { Fragment, useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { v4 as uuidv4 } from "uuid";

const VideoManagement = () => {
  const [dataVideos, setDataVideos] = useState<Video[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>("undefined");
  const [dataClasses, setDataClasses] = useState<Class[]>([]);
  const [dataFile, setDataFile] = useState<File[]>([]);
  const {
    listVideos,
    isPending,
    isError,
    isUpdating,
    updateVideosByClass,
    refetch,
  } = useVideo({
    classId: selectedClassId === "undefined" ? undefined : selectedClassId,
  });
  const {
    listClasses,
    isPending: isPendingClass,
    isError: isErrorClass,
  } = useClass();
  const {
    dataFileAPI,
    isPending: isPendingFile,
    isError: isErrorFile,
  } = useFile();
  const isReadOnly = selectedClassId === "undefined";

  const [errors, setErrors] = useState<any>({});

  const handleAddVideo = useCallback(() => {
    const newId = uuidv4();
    const newVideo = {
      id: newId,
      name: "",
      description: "",
      url: "",
      isNew: true,
      class: {
        id: selectedClassId,
        name:
          dataClasses.find((item) => item.id === selectedClassId)?.name || "",
        description: null,
      },
    };
    setDataVideos([...dataVideos, newVideo]);
  }, [dataVideos]);

  useEffect(() => {
    if (listVideos) {
      setDataVideos(listVideos.list);
    }
  }, [listVideos]);

  useEffect(() => {
    if (listClasses) {
      setDataClasses(listClasses.list);
    }
  }, [listClasses]);

  useEffect(() => {
    if (dataFileAPI) {
      setDataFile(dataFileAPI.files);
    }
  }, [dataFileAPI]);

  const handleInputChange = (id: string, field: string, value: string) => {
    setDataVideos((prevData) =>
      prevData.map((video) =>
        video.id === id ? { ...video, [field]: value } : video
      )
    );
  };

  const handleDeleteVideo = useCallback((id: string) => {
    setDataVideos((prevList) => prevList.filter((item) => item.id !== id));
  }, []);

  const validate = useCallback(() => {
    if (selectedClassId !== "undefined") {
      const nameCount: { [key: string]: number } = {};
      const urlCount: { [key: string]: number } = {};
      const newErrors: { [key: string]: { name?: string; url?: string } } = {};

      dataVideos.forEach((item) => {
        if (!item.name) {
          newErrors[item.id] = {
            ...newErrors[item.id],
            name: "Tên video không được để trống",
          };
        }

        if (item.name) {
          nameCount[item.name] = (nameCount[item.name] || 0) + 1;
        }

        if (!item.url) {
          newErrors[item.id] = {
            ...newErrors[item.id],
            url: "URL không được để trống",
          };
        }

        if (item.url) {
          urlCount[item.url] = (urlCount[item.url] || 0) + 1;
        }
      });

      dataVideos.forEach((item) => {
        if (nameCount[item.name] > 1) {
          newErrors[item.id] = {
            ...newErrors[item.id],
            name: "Tên video bị trùng",
          };
        }
      });

      dataVideos.forEach((item) => {
        if (urlCount[item.url] > 1) {
          newErrors[item.id] = {
            ...newErrors[item.id],
            url: "URL video bị trùng",
          };
        }
      });

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    } else {
      setErrors({});

      return;
    }
  }, [dataVideos, selectedClassId]);

  const handleSave = useCallback(() => {
    const newData = {
      videos: dataVideos.map((item) => {
        return {
          id: item.isNew ? undefined : item.id,
          name: item.name === "" ? null : item.name.trim(),
          url: item.url === "" ? null : item.url.trim(),
          description:
            !item.description || item.description === ""
              ? null
              : item.description.trim(),
        };
      }),
    };

    showAlertConfirm({
      title: "Xác nhận lưu",
      html: `Bạn có chắc chắn muốn cập nhật danh sách Video <br/>cho lớp học <b>${dataClasses.find((item) => item.id === selectedClassId)?.name}</b>? <br/><br/><span class='font-bold text-red-700'>Lưu ý: Thao tác này không thể khôi phục</span>`,
      icon: "question",
    }).then((result) => {
      if (result.isConfirmed) {
        updateVideosByClass({
          classId: selectedClassId,
          data: newData,
        })
          .then(async () => {
            await refetch();

            showAlert(
              "Thành công",
              "Danh sách Video đã được cập nhật",
              "success"
            );
          })
          .catch((err) => {
            showAlertError(err);
          });
      }
    });
  }, [dataClasses, dataVideos, selectedClassId]);

  useEffect(() => {
    validate();
  }, [validate]);

  useEffect(() => {
    showLoading(isUpdating);
  }, [isUpdating]);

  if (isPending || isPendingClass || isPendingFile) {
    return <Loader />;
  }

  if (isError || isErrorClass || isErrorFile) {
    return <Error />;
  }

  return (
    <Fragment>
      <Helmet>
        <title>QUẢN LÝ VIDEO</title>
      </Helmet>

      <div className="mt-4 flex items-center gap-x-8">
        <BackBtn />

        {isReadOnly && (
          <div className="font-bold text-red-500">
            Để chỉnh sửa, vui lòng chọn lớp học trước
          </div>
        )}
      </div>

      <div className="mt-4 flex justify-between items-center">
        <div className="flex items-center gap-x-4 w-full">
          <div className="flex items-center gap-x-2">
            <span>Chọn lớp học:</span>
            <Select
              placeholder="Tất cả"
              className="min-w-[200px]"
              onChange={(value) => setSelectedClassId(value)}
              value={selectedClassId}
            >
              <Select.Option value={"undefined"}>Tất cả</Select.Option>
              {dataClasses.map((item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </div>

          <div>
            Tổng số Video:{" "}
            <span className="font-bold">{dataVideos.length}</span>
          </div>
        </div>

        {selectedClassId !== "undefined" && (
          <div className="flex gap-x-4">
            <Button onClick={handleAddVideo} type="primary">
              <PlusOutlined /> Thêm mới
            </Button>
            <Button
              onClick={handleSave}
              type="primary"
              className={
                Object.keys(errors).length > 0
                  ? ""
                  : "bg-green-700 hover:!bg-green-600"
              }
              disabled={Object.keys(errors).length > 0}
            >
              <SaveOutlined /> Lưu
            </Button>
          </div>
        )}
      </div>

      <div className="py-4">
        <List
          grid={{ gutter: 30, column: 3 }}
          dataSource={dataVideos}
          renderItem={(video) => (
            <List.Item>
              <Badge.Ribbon text={video.class?.name}>
                <Card
                  className="border border-blue-700 min-h-[200px]"
                  title={
                    <div className="flex items-center gap-x-2">
                      {!isReadOnly && (
                        <Button
                          onClick={() => handleDeleteVideo(video.id)}
                          danger
                          size="small"
                        >
                          <DeleteOutlined />
                        </Button>
                      )}
                      <div className={video.name ? "font-bold" : "italic"}>
                        {video.name || "Chưa đặt tên Video"}
                      </div>
                    </div>
                  }
                >
                  <Input
                    value={video.name}
                    onChange={(e) =>
                      handleInputChange(video.id, "name", e.target.value)
                    }
                    onBlur={validate}
                    placeholder="Nhập tên"
                    readOnly={isReadOnly}
                  />

                  {errors[video.id]?.name && (
                    <span className="text-red-500">
                      {errors[video.id].name}
                    </span>
                  )}
                  <Input.TextArea
                    value={video.description}
                    className="my-4"
                    onChange={(e) =>
                      handleInputChange(video.id, "description", e.target.value)
                    }
                    placeholder={isReadOnly ? "Không có mô tả" : "Nhập mô tả"}
                    readOnly={isReadOnly}
                  />

                  <Select
                    value={video.url}
                    onChange={(value) =>
                      handleInputChange(video.id, "url", value)
                    }
                    onBlur={validate}
                    placeholder="Nhập URL"
                    className="w-full"
                    disabled={isReadOnly}
                  >
                    {dataFile.map((file) => (
                      <Select.Option key={file.name} value={file.name}>
                        {file.name}
                      </Select.Option>
                    ))}
                  </Select>
                  {dataFile.findIndex((item) => item.name === video.url) ===
                    -1 &&
                    video.url !== "" && (
                      <span className="text-red-500">Đã bị xóa</span>
                    )}
                  {errors[video.id]?.url && (
                    <span className="text-red-500">{errors[video.id].url}</span>
                  )}

                  {!video.isNew && (
                    <div className="mt-4">
                      <Typography.Text>
                        <div>
                          Thời gian tạo:{" "}
                          <span className="font-bold">
                            {dayjs(video.createdAt).format("HH:mm:ss DD/MM/YYYY")}
                          </span>
                        </div>
                        <div>
                          Cập nhật lần cuối:{" "}
                          <span className="font-bold">
                            {dayjs(video.updatedAt).format("HH:mm:ss DD/MM/YYYY")}
                          </span>
                        </div>
                      </Typography.Text>
                    </div>
                  )}
                </Card>
              </Badge.Ribbon>
            </List.Item>
          )}
        />
      </div>
    </Fragment>
  );
};

export default VideoManagement;
