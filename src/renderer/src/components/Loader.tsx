import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";

const Loader = () => {
  return (
    <div className="w-screen h-full flex items-center justify-center">
      <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
    </div>
  );
};

export default Loader;
