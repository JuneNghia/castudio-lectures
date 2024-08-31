import { Card, List } from "antd";
import { useCallback, useState } from "react";
import { Helmet } from "react-helmet";
import Video from "../Video";
import notify from "@renderer/common/function/notify";
import { Video as VideoType } from "@renderer/interfaces/video.interface";
import useAuth from "@renderer/hooks/useAuth";

const UserPage = () => {
  const [dataVideo, setDataVideo] = useState<VideoType | null>(null);
  const { user } = useAuth();

  const handleClick = useCallback((data: VideoType | null) => {
    if (data) {
      setDataVideo(data);
    } else {
      notify("error", "Video không khả dụng. Vui lòng thử lại sau");
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>DANH SÁCH VIDEO</title>
      </Helmet>

      {dataVideo ? (
        <Video data={dataVideo} setData={setDataVideo} />
      ) : (
        <div className="p-4">
          <div className="mb-4">
            Bạn hiện đang được xem{" "}
            <span className="font-bold">{user?.videos.length}</span> video
          </div>

          <List
            grid={{ gutter: 16, column: 3 }}
            dataSource={user?.videos}
            renderItem={(video, index) => (
              <List.Item>
                <Card
                  styles={{
                    header: {
                      borderBottom: "1px solid #ccc",
                    },
                  }}
                  onClick={() => handleClick(video)}
                  className="border border-blue-700 min-h-[120px] truncate hover:bg-blue-200 cursor-pointer"
                  title={
                    <div>
                      <span className="ml-3 font-bold">
                        {index + 1}. {video.name}
                      </span>
                    </div>
                  }
                >
                  {video.description || (
                    <span className="italic">Không có thông tin mô tả</span>
                  )}
                </Card>
              </List.Item>
            )}
          />
        </div>
      )}
    </>
  );
};

export default UserPage;
