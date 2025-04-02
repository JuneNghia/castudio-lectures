import { LogoutOutlined, SyncOutlined, UserOutlined } from "@ant-design/icons";
import logoImg from "@renderer/assets/logo.png";
import { RoleEnum } from "@renderer/common/enum";
import notify from "@renderer/common/function/notify";
import { showAlertConfirm } from "@renderer/common/function/swalAlert";
import useAuth from "@renderer/hooks/useAuth";
import { Avatar, Button, Divider, Popover, Tag, Tooltip } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const TopBar = () => {
  const [version, setVersion] = useState(null);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = useCallback(() => {
    showAlertConfirm({
      title: "Đăng xuất",
      html: "Bạn có chắc chắn muốn đăng xuất?",
      icon: "question",
      confirmButtonText: "Đăng xuất",
      confirmButtonColor: "red",
    }).then((confirm) => {
      if (confirm.isConfirmed) {
        signOut();
        notify("success", "Đăng xuất thành công");
        navigate("/sign-in");
      }
    });
  }, [signOut]);

  const handleResetApp = useCallback(() => {
    window.electronAPI.resetApp();
  }, []);

  const handleGetAppVersion = useCallback(async () => {
    const appVersion = await window.electronAPI.getVersion();

    setVersion(appVersion);
  }, []);

  useEffect(() => {
    handleGetAppVersion();
  }, []);

  return (
    <div className="flex justify-between px-16 items-center py-4 border-b">
      <div>
        <img src={logoImg} width={150} />
      </div>
      <div>
        <span className="font-bold text-blue-700 text-[1.3rem]">
          C.A Studio Lectures {version}
        </span>
      </div>

      <div className="flex items-center gap-x-4">
        <Tooltip title="Khởi động lại">
          <Button onClick={handleResetApp}>
            <SyncOutlined />
          </Button>
        </Tooltip>
        <Popover
          title={
            <>
              <div className="font-bold relative">{user?.name}</div>
              <div>{user?.email}</div>
              <Divider className="mb-0 mt-1" />
            </>
          }
          className="cursor-pointer"
          content={
            <div className="flex justify-between items-center">
              <div>
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
              </div>
              <Button danger onClick={handleSignOut}>
                <LogoutOutlined />
                Đăng xuất
              </Button>
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
