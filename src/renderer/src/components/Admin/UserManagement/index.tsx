import BackBtn from "@renderer/components/Button/BackBtn";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import {
  Table,
  Pagination,
  Input,
  Button,
  Modal,
  Form,
  Select,
  Tag,
  PaginationProps,
} from "antd";
import { useUser } from "@renderer/hooks/useUser";
import { User } from "@renderer/interfaces/user.interface";
import { Class } from "@renderer/interfaces/class.interface";
import { useClass } from "@renderer/hooks/useClass";
import Loader from "@renderer/components/Loader";
import Error from "@renderer/components/Error";

const { Search } = Input;
const { Option } = Select;

const options = [
  {
    label: "Tất cả",
    value: "0",
  },
  {
    label: "Đang hoạt động",
    value: "1",
  },
  {
    label: "Đã bị khóa",
    value: "2",
  },
];

const showTotal: PaginationProps['showTotal'] = (total) => `Tổng cộng có ${total} người dùng`;

const UserManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [classes, setClasses] = useState<Class[]>([]);
  const [dataUsers, setDataUsers] = useState<User[]>([]);
  const [isActive, setIsActive] = useState<string>("0");
  const [selectedClassId, setSelectedClassId] = useState<string>("undefined");
  const {
    listClasses,
    isPending: isPendingClass,
    isError: isErrorClass,
  } = useClass();

  const {
    listUsers,
    isPending,
    isError,
  }: {
    listUsers: { list: User[]; total: number };
    isPending: boolean;
    isError: boolean;
  } = useUser({
    page: currentPage,
    size: pageSize,
    search: searchText,
    isActive: isActive === "0" ? undefined : isActive === "1" ? true : false,
    classId: selectedClassId === "undefined" ? undefined : selectedClassId,
  });

  // Xử lý tìm kiếm
  const handleSearch = (value) => {
    setSearchText(value);
    setCurrentPage(1); // Reset lại trang về 1 khi tìm kiếm
  };

  // Xử lý phân trang
  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  // Xử lý khi click vào user (mở modal chỉnh sửa)
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const columns = [
    {
      title: "Họ tên",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "MAC",
      dataIndex: "mac",
      key: "mac",
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive: boolean) => {
        return (
          <Tag color={isActive ? "success" : "error"}>
            {isActive ? "Đang hoạt động" : "Đã bị khóa"}
          </Tag>
        );
      },
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, user) => (
        <Button type="primary" onClick={() => handleEditUser(user)}>
          Sửa
        </Button>
      ),
    },
  ];

  useEffect(() => {
    if (listUsers) {
      setTotalUsers(listUsers.total);
      setDataUsers(listUsers.list);
    }
  }, [listUsers]);

  useEffect(() => {
    if (listClasses) {
      setClasses(listClasses.list);
    }
  }, [listClasses]);

  if (isPending || isPendingClass) {
    return <Loader />;
  }

  if (isError || isErrorClass) {
    return <Error />;
  }

  return (
    <div>
      <Helmet>
        <title>QUẢN LÝ TÀI KHOẢN</title>
      </Helmet>

      <div className="mt-4">
        <BackBtn />
      </div>

      <div className="p-4">
        <div className="w-full mb-4 flex gap-x-6">
          <div className="flex items-center gap-x-3">
            <span>Theo trạng thái: </span>
            <Select
              options={options}
              className="min-w-[200px]"
              value={isActive}
              onChange={(value) => setIsActive(value)}
            />
          </div>
          <div className="flex items-center gap-x-3">
            <span>Theo lớp học: </span>
            <Select
              placeholder="Tất cả"
              className="min-w-[200px]"
              onChange={(value) => setSelectedClassId(value)}
              value={selectedClassId}
            >
              <Select.Option value={"undefined"}>Tất cả</Select.Option>
              {classes.map((item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </div>
        </div>
        <Search
          placeholder="Tìm kiếm theo tên, email hoặc địa chỉ MAC"
          onSearch={handleSearch}
          style={{ marginBottom: 16 }}
        />

        <Table
          columns={columns}
          dataSource={dataUsers}
          loading={isPending}
          pagination={false}
          rowKey="id"
        />

        <Pagination
          current={currentPage}
          total={totalUsers}
          pageSize={pageSize}
          onChange={handlePageChange}
          showSizeChanger
          showLessItems
          showTotal={showTotal}
          pageSizeOptions={[5, 10, 20, 50]}
          style={{ marginTop: 16 }}
        />
      </div>

      {/* Modal chỉnh sửa thông tin */}
      <Modal
        title={`Chỉnh sửa thông tin ${selectedUser?.fullName}`}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form
          initialValues={selectedUser}
          //   onFinish={handleSaveUser}
          layout="vertical"
        >
          <Form.Item
            label="Họ và tên"
            name="fullName"
            rules={[
              { required: true, message: "Họ và tên không được để trống" },
            ]}
          >
            <Input placeholder="Nhập tên" />
          </Form.Item>
          <Form.Item
            label="Địa chỉ email"
            name="email"
            rules={[
              { required: true, message: "Email không được để trống" },
              { type: "email", message: "Email không hợp lệ" },
            ]}
          >
            <Input placeholder="Nhập email" />
          </Form.Item>
          <Form.Item
            label="Lớp học"
            name="class"
            rules={[{ required: true, message: "Vui lòng chọn lớp học" }]}
          >
            <Select placeholder="Chọn lớp học">
              {classes.map((cls) => (
                <Option key={cls.id} value={cls.name}>
                  {cls.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Mật khẩu mới" name="password">
            <Input.Password placeholder="Nhập mật khẩu mới (nếu muốn thay đổi)" />
          </Form.Item>

          <Form.Item>
            <div className="flex justify-between">
              <Button type="primary" htmlType="submit">
                Lưu
              </Button>
              <Button type="primary" danger>
                Xóa
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;
