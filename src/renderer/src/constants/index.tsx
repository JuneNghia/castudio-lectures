import {
  HomeOutlined,
  TeamOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";

export const listAdminMenu = [
  {
    name: "Quản lý lớp học",
    description: "Thêm, xóa, sửa các lớp học",
    url: "/admin/class",
    icon: <HomeOutlined />,
  },
  {
    name: "Quản lý người dùng",
    description:
      "Hiển thị danh sách, sửa, xóa hoặc khóa tài khoản các người dùng hiện hành",
    url: "/admin/user",
    icon: <TeamOutlined />,
  },
  {
    name: "Quản lý video",
    description: "Tạo danh sách video theo lớp học",
    url: "/admin/video",
    icon: <VideoCameraOutlined />,
  },
];
