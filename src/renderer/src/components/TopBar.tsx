import { UserOutlined } from "@ant-design/icons";
import logoImg from "@renderer/assets/logo.png";
import { Avatar } from "antd";

const TopBar = () => {
  return (
    <div className="flex justify-between px-16 items-center py-4 border-b">
      <div>
        <img src={logoImg} width={150} />
      </div>
      <div>
        <span className="font-bold text-blue-700 text-[1.3rem]">CA Studio Online Library</span>
      </div>
      <Avatar size={"large"} icon={<UserOutlined />} />
    </div>
  );
};

export default TopBar;
