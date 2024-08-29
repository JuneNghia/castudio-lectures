import { ArrowLeftOutlined } from "@ant-design/icons";
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
    if (handleClick) {
      handleClick();
    } else {
      navigate("/");
    }
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
