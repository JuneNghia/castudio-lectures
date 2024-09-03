import { Video as VideoType } from "@renderer/interfaces/video.interface";
import { Dispatch, memo, SetStateAction, useCallback, useEffect } from "react";
import showLoading from "@renderer/common/function/showLoading";
import BackBtn from "./Button/BackBtn";
import ReactPlayer from "react-player/lazy";
import { showAlert } from "@renderer/common/function/swalAlert";
import { Helmet } from "react-helmet";

const Video = memo(
  ({
    data,
    setData,
  }: {
    data: VideoType;
    setData: Dispatch<SetStateAction<VideoType | null>>;
  }) => {
    function extractUntilFirstSlash(url) {
      const firstSlashIndex = url.indexOf("/v1");
      return url.substring(0, firstSlashIndex);
    }

    const staticUrl = `${extractUntilFirstSlash(import.meta.env.VITE_API_URL)}/static/${data.url}`;

    const handleBack = useCallback(() => {
      setData(null);
    }, []);

    const handleErrorLoad = useCallback(() => {
      setData(null);
      showAlert("Lỗi", "Không thể tải dữ liệu Video", "error");
    }, []);

    useEffect(() => {
      showLoading(true);
    }, []);

    return (
      <>
        <Helmet>
          <title>{data.name}</title>
        </Helmet>
        <div className="py-4 px-4 flex items-center gap-x-4">
          <div className="w-fit">
            <BackBtn handleClick={handleBack} text="Quay lại" />
          </div>
          <div>
            Bạn đang xem bài giảng{" "}
            <span className="font-bold">{data.name}</span>
          </div>
        </div>
        <div className="w-full h-full justify-center flex items-center">
          <ReactPlayer
            controls
            onReady={() => showLoading(false)}
            onError={handleErrorLoad}
            onContextMenu={(e) => e.preventDefault()}
            width="75%"
            height="100%"
            config={{
              file: {
                attributes: {
                  disablePictureInPicture: true,
                  controlsList: "nodownload",
                },
              },
            }}
            url={staticUrl}
          />
        </div>
      </>
    );
  }
);

export default Video;
