import {
  PlusOutlined,
  SaveOutlined,
  DeleteOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
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
import { Class } from "@renderer/interfaces/class.interface";
import { updatedClasses } from "@renderer/services/class.service";
import { Button, Input, Form, Alert, Tooltip } from "antd";
import dayjs from "dayjs";
import { Fragment, useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { v4 as uuidv4 } from "uuid";

const ClassManagement = () => {
  const [dataClasses, setDataClasses] = useState<Class[]>([]);
  const [errors, setErrors] = useState({});
  const { listClasses, isPending, isError, refetch } = useClass();

  const validate = useCallback(() => {
    const nameCount = {};
    const newErrors = {};

    dataClasses.forEach((item) => {
      if (!item.name) {
        newErrors[item.id] = "Tên lớp không được để trống";
      }

      if (item.name) {
        nameCount[item.name] = (nameCount[item.name] || 0) + 1;
      }
    });

    dataClasses.forEach((item) => {
      if (nameCount[item.name] > 1) {
        newErrors[item.id] = "Tên lớp bị trùng";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [dataClasses]);

  useEffect(() => {
    validate();
  }, [dataClasses, validate]);

  const handleInputChange = useCallback(
    (id: string, field: string, value: string) => {
      setDataClasses((prevList) =>
        prevList.map((item) =>
          item.id === id ? { ...item, [field]: value } : item
        )
      );
    },
    []
  );

  const handleAddClass = () => {
    const newId = uuidv4();
    const newClass = { id: newId, name: "", description: "", isNew: true };
    setDataClasses([...dataClasses, newClass]);
  };

  const handleDeleteClass = useCallback((id: string) => {
    setDataClasses((prevList) => prevList.filter((item) => item.id !== id));
  }, []);

  const handleSave = useCallback(() => {
    const newData = {
      classes: dataClasses.map((item) => {
        return {
          id: item.isNew ? undefined : item.id,
          name: item.name === "" ? null : item.name.trim(),
          description:
            !item.description || item.description === ""
              ? null
              : item.description.trim(),
        };
      }),
    };

    showAlertConfirm({
      title: "Xác nhận lưu",
      html: "Bạn có chắc chắn muốn cập nhật danh sách lớp học? <br/><br/><span class='font-bold text-red-700'>Lưu ý: Thao tác này không thể khôi phục</span>",
      icon: "question",
    }).then((result) => {
      if (result.isConfirmed) {
        showLoading(true);
        updatedClasses(newData)
          .then(async () => {
            await refetch();

            showAlert(
              "Thành công",
              "Danh sách lớp học đã được cập nhật",
              "success"
            );
          })
          .catch((err) => {
            showLoading(false);
            showAlertError(err);
          });
      }
    });
  }, [dataClasses]);

  useEffect(() => {
    if (listClasses) {
      setDataClasses(listClasses.list);
    }
  }, [listClasses]);

  if (isPending) {
    return <Loader />;
  }

  if (isError) {
    return <Error />;
  }

  return (
    <Fragment>
      <Helmet>
        <title>QUẢN LÝ LỚP HỌC</title>
      </Helmet>

      <div className="mt-4">
        <BackBtn />
      </div>

      <div>
        <div className="flex gap-x-4 justify-between items-center my-4 mb-4">
          <div>
            Có tổng cộng{" "}
            <span className="font-bold text-red-600">{dataClasses.length}</span>{" "}
            lớp
          </div>
          <div className="flex items-center gap-x-3">
            <Button type="primary" onClick={handleAddClass}>
              <PlusOutlined /> Thêm mới
            </Button>
            <Button
              type="primary"
              className={
                Object.keys(errors).length > 0
                  ? ""
                  : "bg-green-700 hover:!bg-green-600"
              }
              onClick={handleSave}
              disabled={Object.keys(errors).length > 0}
            >
              <SaveOutlined /> Lưu
            </Button>
          </div>
        </div>

        <div className="pb-4">
          {dataClasses.map((item, index) => (
            <div className="p-4 mb-4 border border-gray-300" key={item.id}>
              <div className="mb-4 flex items-center justify-between">
                <div className="font-bold text-[1.3rem]">
                  Lớp {index + 1}:{" "}
                  <span className="font-bold text-red-700">{item.name}</span>
                </div>

                {!item.isNew && (
                  <div className="flex items-center gap-x-4">
                    <div>
                      Ngày tạo:{" "}
                      <span className="font-bold">
                        {dayjs(item.createdAt).format("DD/MM/YYYY")}
                      </span>
                    </div>
                    <div className="flex items-center gap-x-4">
                      <div>
                        Số lượng học viên:{" "}
                        <span className="font-bold">{item.userCount}</span>
                      </div>
                      <div>
                        Số lượng Video:{" "}
                        <span className="font-bold">{item.videoCount}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Form.Item
                validateStatus={errors[item.id] ? "error" : ""}
                label="Tên lớp"
              >
                <Input
                  value={item.name}
                  onChange={(e) =>
                    handleInputChange(item.id, "name", e.target.value)
                  }
                  placeholder="Nhập tên lớp"
                />
              </Form.Item>

              <Form.Item label="Mô tả">
                <Input
                  value={item.description ? item.description : ""}
                  onChange={(e) =>
                    handleInputChange(item.id, "description", e.target.value)
                  }
                  placeholder="Nhập mô tả lớp học"
                />
              </Form.Item>

              {errors[item.id] && (
                <Alert
                  message={errors[item.id]}
                  type="error"
                  showIcon
                  style={{ marginTop: "10px" }}
                />
              )}

              <div className="flex justify-end items-center gap-x-4">
                <div className="mt-4 cursor-pointer">
                  <Tooltip
                    title={
                      `Khi xóa lớp học sẽ xóa các video, danh sách trắng và học viên liên quan đến lớp ${item.name}`
                    }
                  >
                    <QuestionCircleOutlined />
                  </Tooltip>
                </div>

                <Button
                  danger
                  onClick={() => handleDeleteClass(item.id)}
                  className="mt-4"
                >
                  <DeleteOutlined /> Xóa
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Fragment>
  );
};

export default ClassManagement;
