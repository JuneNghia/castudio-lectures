import { listMenu } from "@renderer/constants";
import { Card, List } from "antd";
import { Fragment, useCallback } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";

const SupportPage = () => {
  const navigate = useNavigate();

  const handleClick = useCallback((url: string) => {
    navigate(url);
  }, []);

  return (
    <Fragment>
      <Helmet>
        <title>QUẢN TRỊ HỆ THỐNG - SUPPORT</title>
      </Helmet>

      <div className="p-4">
        <List
          grid={{ gutter: 16, column: 3 }}
          dataSource={listMenu.filter((menu) => menu.allowSupport)}
          renderItem={(menu) => (
            <List.Item>
              <Card
                styles={{
                  header: {
                    borderBottom: "1px solid #ccc",
                  },
                }}
                onClick={() => handleClick(menu.url)}
                className="border border-blue-700 min-h-[220px] hover:bg-blue-200 cursor-pointer"
                title={
                  <div>
                    {menu.icon}
                    <span className="ml-3 font-bold">{menu.name}</span>
                  </div>
                }
              >
                <span>{menu.description}</span>
              </Card>
            </List.Item>
          )}
        />
      </div>
    </Fragment>
  );
};

export default SupportPage;
