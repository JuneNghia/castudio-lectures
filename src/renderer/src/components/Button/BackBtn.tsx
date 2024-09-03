import { ArrowLeftOutlined } from "@ant-design/icons";
import showLoading from "@renderer/common/function/showLoading";
import { showAlertError } from "@renderer/common/function/swalAlert";
import { checkHealth } from "@renderer/services/health.service";
import { Button, Tooltip } from "antd";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  tooltipTitle?: string;
  text?: string;
  handleClick?: () => void;
}

const BackBtn = ({ tooltipTitle, text, handleClick }: Props) => {
  const navigate = useNavigate();

  const handleClickBtn = useCallback(() => {
    showLoading(true);
    checkHealth()
      .then(() => {
        if (handleClick) {
          handleClick();
        } else {
          navigate("/");
        }

        showLoading(false);
      })
      .catch((err) => {
        showAlertError(err).then((confirm) => {
          if (confirm.isConfirmed) {
            window.electronAPI.resetApp();
          }
        });
      });
  }, []);

  return (
    <div className="w-fit" onClick={handleClickBtn}>
      <Tooltip title={tooltipTitle || undefined}>
        <Button>
          <ArrowLeftOutlined />
          <span>{text || "Quay lại trang chủ"}</span>
        </Button>
      </Tooltip>
    </div>
  );
};

export default BackBtn;
