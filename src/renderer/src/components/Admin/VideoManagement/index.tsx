import BackBtn from "@renderer/components/Button/BackBtn";
import { Fragment } from "react";
import { Helmet } from "react-helmet";

const VideoManagement = () => {
  return (
    <Fragment>
      <Helmet>
        <title>QUẢN LÝ VIDEO</title>
      </Helmet>

      <div className="mt-4">
        <BackBtn />
      </div>
    </Fragment>
  );
};

export default VideoManagement;
