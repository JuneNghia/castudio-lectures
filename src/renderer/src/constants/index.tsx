import {
  FileDoneOutlined,
  HomeOutlined,
  TeamOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";

export const primaryColor = "#1677fe";

export const listAdminMenu = [
  {
    name: "Quản lý lớp học",
    description: "Hiển thị danh sách và chỉnh sửa các lớp học. Lưu ý quan trọng: Khi xóa lớp học đồng nghĩa với việc toàn bộ người dùng, video và danh sách trắng của lớp học đó cũng sẽ bị xóa vĩnh viễn.",
    url: "/admin/class",
    icon: <HomeOutlined />,
  },
  {
    name: "Quản lý người dùng",
    description:
      "Hiển thị danh sách, sửa, xóa hoặc khóa tài khoản người dùng. Thay đổi lớp học và chỉ định Video được phép truy cập của người dùng được chọn.",
    url: "/admin/user",
    icon: <TeamOutlined />,
  },
  {
    name: "Quản lý video",
    description: "Hiển thị danh sách và tạo danh sách video theo lớp học.",
    url: "/admin/video",
    icon: <VideoCameraOutlined />,
  },
  {
    name: "Quản lý danh sách trắng",
    description:
      "Cho phép các địa chỉ email được phép đăng ký tài khoản theo lớp, khi người dùng đăng ký email sẽ tự động tham gia vào lớp học đã được phân bổ trước đó.",
    url: "/admin/white-list",
    icon: <FileDoneOutlined />,
  },
];
