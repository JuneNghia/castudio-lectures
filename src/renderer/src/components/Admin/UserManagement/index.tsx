import BackBtn from "@renderer/components/Button/BackBtn";
import styled from "styled-components";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
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
  Tooltip,
  Switch,
} from "antd";
import { useUser } from "@renderer/hooks/useUser";
import { User } from "@renderer/interfaces/user.interface";
import { Class } from "@renderer/interfaces/class.interface";
import { useClass } from "@renderer/hooks/useClass";
import Error from "@renderer/components/Error";
import notify from "@renderer/common/function/notify";
import showLoading from "@renderer/common/function/showLoading";
import { useVideo } from "@renderer/hooks/useVideo";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import {
  showAlert,
  showAlertConfirm,
  showAlertError,
} from "@renderer/common/function/swalAlert";
import { RoleEnum } from "@renderer/common/enum";
import { Video } from "@renderer/interfaces/video.interface";
import useAuth from "@renderer/hooks/useAuth";
import dayjs from "dayjs";

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

const CustomSwitch = styled(Switch)`
  &.ant-switch-checked {
    background-color: green; /* Màu xanh khi bật */
  }

  &:not(.ant-switch-checked) {
    background-color: red; /* Màu đỏ khi tắt */
  }

  /* Loại bỏ màu hover mặc định */
  &.ant-switch-checked:hover {
    background-color: green !important;
  }

  &:not(.ant-switch-checked):hover {
    background-color: red; /* Giữ màu đỏ khi hover tắt */
  }
`;

const getChangedValues = (values, initialValues) => {
  const changedValues = {};
  Object.keys(values).forEach((key) => {
    if (values[key] !== initialValues[key]) {
      changedValues[key] = values[key];
    }
  });
  return changedValues;
};

const showTotal: PaginationProps["showTotal"] = (total) =>
  `Tổng cộng có ${total} người dùng`;

const UserManagement = memo(() => {
  const [form] = Form.useForm();
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);
  const [classes, setClasses] = useState<Class[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [dataUsers, setDataUsers] = useState<User[]>([]);
  const [isActive, setIsActive] = useState<string>("0");
  const [selectedClassId, setSelectedClassId] = useState<string>("undefined");
  const { listClasses, isError: isErrorClass } = useClass();
  const { listVideos, isError: isErrorVideo } = useVideo({
    classId: undefined,
  });

  const {
    listUsers,
    isPending,
    isError,
    fetchUserById,
    createSupport,
    updateUserById,
    deleteUserById,
    refetch,
  } = useUser({
    page: currentPage,
    size: pageSize,
    search: searchText,
    isActive: isActive === "0" ? undefined : isActive === "1" ? true : false,
    classId: selectedClassId === "undefined" ? undefined : selectedClassId,
  });

  const handleSearch = useCallback((value) => {
    setSearchText(value);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  }, []);

  const handleShowModalCreate = useCallback(() => {
    const fieldValues = {
      name: "",
      password: "",
      mac: "",
      email: "",
    };

    form.setFieldsValue(fieldValues);

    setIsModalCreateOpen(true);
  }, [form]);

  const handleCreateSupport = useCallback((user: User) => {
    const newSupport = {
      name: user.name,
      mac: user.mac,
      password: user.password,
      email: user.email,
    };

    showAlertConfirm({
      title: "Thêm trợ giảng",
      icon: "question",
      confirmButtonText: "Thêm",
      html: `Bạn có chắc chắn muốn thêm trợ giảng <b>${user.name}</b>?`,
    }).then((confirm) => {
      if (confirm.isConfirmed) {
        showLoading(true);
        createSupport({ data: newSupport })
          .then(() => {
            showAlert(
              "Thành công",
              `Trợ giảng <b>${user.name}</b> đã được thêm`,
              "success"
            ).then((confirm) => {
              if (confirm.isConfirmed) {
                handleCloseModal();

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

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedUser(undefined);
    setIsModalCreateOpen(false);
  }, [form]);

  const handleDeleteUser = useCallback(() => {
    if (selectedUser) {
      showAlertConfirm({
        title: "Xác nhận xóa",
        icon: "warning",
        confirmButtonText: "Xóa",
        confirmButtonColor: "red",
        html: `Bạn có chắc chắn muốn xóa vĩnh viễn người dùng <b>${selectedUser.email}</b>? <br/><br/><span class='font-bold text-red-700'>Lưu ý: Thao tác này không thể khôi phục</span>`,
      }).then((confirm) => {
        if (confirm.isConfirmed) {
          showLoading(true);
          deleteUserById({
            id: selectedUser.id,
          })
            .then(() => {
              showAlert(
                "Thành công",
                `Người dùng <b>${selectedUser.email}</b> đã được xóa vĩnh viễn`,
                "success"
              ).then((confirm) => {
                if (confirm.isConfirmed) {
                  handleCloseModal();

                  refetch();
                }
              });
            })
            .catch((err) => {
              showAlertError(err);
            });
        }
      });
    } else {
      notify("error", "Không lấy được ID người dùng");
    }
  }, [selectedUser]);

  const handleEditUser = useCallback((user) => {
    showLoading(true);
    fetchUserById({
      id: user.id,
    })
      .then((res: User) => {
        const dataUser = {
          ...res,
          classId: res?.class?.id,
          videoIds: res.videos.map((video) => video.id),
          password: "",
        };
        setSelectedUser(dataUser);

        if (dataUser) {
          showLoading(false);
          setIsModalOpen(true);
        }
      })
      .catch(() => {
        notify("error", "Không thể lấy dữ liệu người dùng");
      });
  }, []);

  const handleSaveUser = useCallback(
    (user: User) => {
      const changedValues = getChangedValues(user, selectedUser);

      if (Object.values(changedValues).length === 0) {
        notify("info", "Không có dữ liệu thay đổi");
      } else {
        if (selectedUser) {
          showAlertConfirm({
            title: "Xác nhận cập nhật",
            icon: "warning",
            confirmButtonText: "Cập nhật",
            html: `Bạn có chắc chắn muốn cập nhật người dùng <b>${selectedUser.email}</b>? <br/><br/><span class='font-bold text-red-700'>Lưu ý: Thao tác này không thể khôi phục</span>`,
          }).then((confirm) => {
            if (confirm.isConfirmed) {
              showLoading(true);
              updateUserById({
                id: selectedUser.id,
                data: changedValues,
              })
                .then(() => {
                  showAlert(
                    "Thành công",
                    `Người dùng <b>${selectedUser.email}</b> <br/> đã được cập nhật thành công`,
                    "success"
                  ).then((confirm) => {
                    if (confirm.isConfirmed) {
                      handleCloseModal();

                      refetch();
                    }
                  });
                })
                .catch((err) => {
                  showAlertError(err);
                });
            }
          });
        } else {
          notify("error", "Không lấy được ID người dùng");
        }
      }
    },
    [selectedUser]
  );

  const columns: any = useMemo(
    () => [
      {
        title: "Họ tên",
        dataIndex: "name",
        key: "name",
        width: 200,
        render: (name, user) =>
          user?.role === RoleEnum.USER ? (
            name
          ) : (
            <span className="flex items-center gap-x-2">
              {name}{" "}
              <Tag
                color={
                  user?.role === RoleEnum.ADMIN
                    ? "red"
                    : user?.role === RoleEnum.SUPPORT
                      ? "purple"
                      : "green"
                }
              >
                {user?.role}
              </Tag>
            </span>
          ),
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
        width: 200,
      },
      {
        title: "MAC",
        dataIndex: "mac",
        key: "mac",
        width: 180,
      },
      {
        title: "Trạng thái",
        dataIndex: "isActive",
        key: "isActive",
        align: "center",
        render: (isActive: boolean) => {
          return (
            <Tag color={isActive ? "success" : "error"}>
              {isActive ? "Đang hoạt động" : "Đã bị khóa"}
            </Tag>
          );
        },
      },
      {
        title: "Ngày đăng ký",
        dataIndex: "createdAt",
        key: "createdAt",
        align: "center",
        render: (createdAt: string) => {
          return dayjs(createdAt).format("DD/MM/YYYY");
        },
      },
      {
        title: "Hành động",
        key: "action",
        align: "center",
        render: (_, dataUser) =>
          user?.role === RoleEnum.ADMIN ||
          (user?.role === RoleEnum.SUPPORT &&
            dataUser?.role === RoleEnum.USER) ? (
            <Button type="primary" onClick={() => handleEditUser(dataUser)}>
              <EditOutlined />
              {user?.role === RoleEnum.SUPPORT ? "Gửi Video" : "Cập nhật"}
            </Button>
          ) : null,
      },
    ],
    []
  );

  useEffect(() => {
    if (listUsers) {
      setTotalUsers(listUsers.total);
      setDataUsers(listUsers.list);
    }
  }, [listUsers]);

  useEffect(() => {
    form.setFieldsValue(selectedUser);
  }, [selectedUser]);

  useEffect(() => {
    if (listClasses) {
      setClasses(listClasses.list);
    }
  }, [listClasses]);

  useEffect(() => {
    if (listVideos) {
      setVideos(listVideos.list);
    }
  }, [listVideos]);

  if (isError || isErrorClass || isErrorVideo) {
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
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-x-6">
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

          <div>
            <Button
              hidden={user?.role !== RoleEnum.ADMIN}
              onClick={handleShowModalCreate}
              type="primary"
            >
              <PlusOutlined /> Thêm trợ giảng
            </Button>
          </div>
        </div>

        <Search
          placeholder="Tìm kiếm theo tên, email hoặc địa chỉ MAC"
          onSearch={handleSearch}
          style={{ marginBottom: 16 }}
          allowClear
        />

        <Table
          columns={columns}
          dataSource={dataUsers}
          loading={isPending}
          pagination={false}
          rowKey="id"
          sticky
          bordered
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

      {isModalOpen && (
        <Modal
          title={
            <>
              Chỉnh sửa thông tin{" "}
              <span className="text-blue-700 font-bold">
                {selectedUser?.name}
              </span>
            </>
          }
          open={isModalOpen}
          onCancel={handleCloseModal}
          footer={null}
          maskClosable={false}
          keyboard={false}
        >
          <Form
            form={form}
            initialValues={selectedUser}
            onFinish={handleSaveUser}
            layout="horizontal"
            labelCol={{ offset: 0, span: 8 }}
            className="mt-6"
          >
            <Form.Item
              label="Họ và tên"
              name="name"
              rules={[
                { required: true, message: "Họ và tên không được để trống" },
              ]}
            >
              <Input
                disabled={user?.role !== RoleEnum.ADMIN}
                placeholder="Nhập tên"
              />
            </Form.Item>
            <Form.Item
              label="Địa chỉ email"
              name="email"
              rules={[
                { required: true, message: "Email không được để trống" },
                { type: "email", message: "Email không hợp lệ" },
              ]}
            >
              <Input
                disabled={user?.role !== RoleEnum.ADMIN}
                placeholder="Nhập email"
              />
            </Form.Item>
            <Form.Item
              hidden={user?.role !== RoleEnum.ADMIN}
              label="MAC"
              name="mac"
              rules={[{ required: true, message: "MAC không được để trống" }]}
            >
              <Input placeholder="Nhập địa chỉ MAC" />
            </Form.Item>
            <Form.Item
              hidden={selectedUser?.role !== RoleEnum.USER}
              label="Lớp học"
              name="classId"
            >
              <Select
                disabled={user?.role !== RoleEnum.ADMIN}
                placeholder="Chưa có lớp học"
              >
                {classes.map((cls) => (
                  <Option key={cls.id} value={cls.id}>
                    {cls.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              hidden={selectedUser?.role !== RoleEnum.USER}
              label="Video được xem"
              name="videoIds"
            >
              <Select
                filterOption={(input, option) =>
                  option?.props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0 ||
                  option?.props.value
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
                allowClear
                mode="multiple"
                placeholder="Chưa có Video"
              >
                {videos.map((video) => (
                  <Option key={video.id} value={video.id}>
                    {video.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              hidden={user?.role !== RoleEnum.ADMIN}
              label="Mật khẩu mới"
              name="password"
              rules={[{ min: 8, message: "Mật khẩu phải có ít nhất 8 ký tự" }]}
            >
              <Input.Password placeholder="Nhập mật khẩu mới (nếu muốn thay đổi)" />
            </Form.Item>
            <Form.Item
              valuePropName="checked"
              label="Trạng thái tài khoản"
              name="isActive"
              hidden={
                selectedUser?.role === RoleEnum.ADMIN ||
                user?.role !== RoleEnum.ADMIN
              }
            >
              <CustomSwitch
                checkedChildren="Đang hoạt động"
                unCheckedChildren="Vô hiệu hóa"
              />
            </Form.Item>

            <Form.Item>
              <div className={`flex justify-between`}>
                {user?.role === RoleEnum.ADMIN ? (
                  <Tooltip
                    title={
                      selectedUser?.role === RoleEnum.ADMIN
                        ? "Không thể xóa tài khoản ADMIN"
                        : undefined
                    }
                  >
                    <Button
                      disabled={selectedUser?.role === RoleEnum.ADMIN}
                      onClick={handleDeleteUser}
                      type="primary"
                      danger
                    >
                      <DeleteOutlined />
                      Xóa
                    </Button>
                  </Tooltip>
                ) : (
                  <div></div>
                )}

                <Button type="primary" htmlType="submit">
                  <SaveOutlined />
                  Cập nhật
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Modal>
      )}

      {isModalCreateOpen && (
        <Modal
          title={
            <>
              Thêm trợ giảng
              <span className="text-blue-700 font-bold">
                {selectedUser?.name}
              </span>
            </>
          }
          open={isModalCreateOpen}
          onCancel={handleCloseModal}
          footer={null}
          maskClosable={false}
          keyboard={false}
        >
          <Form
            form={form}
            onFinish={handleCreateSupport}
            layout="horizontal"
            labelCol={{ offset: 0, span: 8 }}
            className="mt-6"
          >
            <Form.Item
              label="Họ và tên"
              name="name"
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
              label="MAC"
              name="mac"
              rules={[{ required: true, message: "MAC không được để trống" }]}
            >
              <Input placeholder="Địa chỉ MAC của trợ giảng" />
            </Form.Item>

            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[
                { required: true, message: "Mật khẩu không được để trống" },
                { min: 8, message: "Mật khẩu phải có ít nhất 8 ký tự" },
              ]}
            >
              <Input.Password placeholder="Nhập mật khẩu" />
            </Form.Item>

            <Form.Item>
              <div className="flex justify-end">
                <Button type="primary" htmlType="submit">
                  <SaveOutlined />
                  Thêm
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Modal>
      )}
    </div>
  );
});

export default UserManagement;
