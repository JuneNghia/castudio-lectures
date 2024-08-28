import { UndoOutlined, UserOutlined } from "@ant-design/icons";
import logoImg from "@renderer/assets/logo.png";
import useAuth from "@renderer/hooks/useAuth";
import { Avatar, Button, Popover, Tooltip } from "antd";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

const TopBar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const handleSignOut = useCallback(() => {
    signOut();

    navigate("/sign-in");
  }, []);

  const handleResetApp = useCallback(() => {
    window.electronAPI.resetApp();
  }, []);

  return (
    <div className="flex justify-between px-16 items-center py-4 border-b">
      <div>
        <img src={logoImg} width={150} />
      </div>
      <div>
        <span className="font-bold text-blue-700 text-[1.3rem]">
          CA Studio Online Library
        </span>
      </div>

      <div className="flex items-center gap-x-4">
        <Tooltip title="Làm mới">
          <Button onClick={handleResetApp}>
            <UndoOutlined />
          </Button>
        </Tooltip>
        <Popover
          title={user?.fullName}
          className="cursor-pointer"
          content={
            <div>
              <div
                className="text-blue-700 cursor-pointer hover:underline"
                onClick={handleSignOut}
              >
                Đăng xuất
              </div>
            </div>
          }
          trigger={"click"}
        >
          <Avatar size={"large"} icon={<UserOutlined />} />
        </Popover>
      </div>
    </div>
  );
};

export default TopBar;
