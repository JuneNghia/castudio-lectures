import {
  PlusOutlined,
  SaveOutlined,
  DeleteOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import BackBtn from "@renderer/components/Button/BackBtn";
import { Button, Input, Form, Alert, Tooltip } from "antd";
import { Fragment, useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet";

const initialList = [
  {
    id: "1",
    name: "Khóa 44",
    description: "",
  },
  {
    id: "2",
    name: "Khóa 45",
    description: "",
  },
];

const ClassManagement = () => {
  const [listClass, setListClass] = useState(initialList);
  const [errors, setErrors] = useState({});

  const validate = useCallback(() => {
    const nameCount = {};
    const newErrors = {};

    listClass.forEach((item) => {
      if (!item.name) {
        newErrors[item.id] = "Tên lớp không được để trống";
      }

      if (item.name) {
        nameCount[item.name] = (nameCount[item.name] || 0) + 1;
      }
    });

    listClass.forEach((item) => {
      if (nameCount[item.name] > 1) {
        newErrors[item.id] = "Tên lớp bị trùng";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [listClass]);

  useEffect(() => {
    validate();
  }, [listClass, validate]);

  const handleInputChange = useCallback((id, field, value) => {
    setListClass((prevList) =>
      prevList.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  }, []);

  const handleAddClass = () => {
    const newId = (listClass.length + 1).toString();
    setListClass([...listClass, { id: newId, name: "", description: "" }]);
  };

  const handleDeleteClass = (id) => {
    setListClass((prevList) => prevList.filter((item) => item.id !== id));
  };

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
            <span className="font-bold text-red-600">{listClass.length}</span>{" "}
            lớp
          </div>
          <div className="flex items-center gap-x-3">
            <Button type="primary" onClick={handleAddClass}>
              <PlusOutlined /> Thêm mới
            </Button>
            <Button
              type="primary"
              className="bg-green-700 hover:!bg-green-600"
              onClick={() => alert("Saving logic here!")}
            >
              <SaveOutlined /> Lưu
            </Button>
          </div>
        </div>

        <div className="pb-4">
          {listClass.map((item, index) => (
            <div className="p-4 mb-4 border border-gray-300" key={item.id}>
              <div className="font-bold mb-4 text-[1.3rem] text-blue-700">
                Lớp {index + 1}:{" "}
                <span className="font-bold text-red-700">{item.name}</span>
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
                  value={item.description}
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
                  <Tooltip title={"Khi xóa lớp học sẽ xóa các video và học viên liên quan đến lớp"}>
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
