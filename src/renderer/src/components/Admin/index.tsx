import { listAdminMenu } from "@renderer/constants";
import { Card, List } from "antd";
import { Fragment, useCallback } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";

const AdminPage = () => {
  const navigate = useNavigate();

  const handleClick = useCallback((url: string) => {
    navigate(url);
  }, []);

  return (
    <Fragment>
      <Helmet>
        <title>QUẢN TRỊ HỆ THỐNG</title>
      </Helmet>

      <div className="p-4">
        <List
          grid={{ gutter: 16, column: 3 }}
          dataSource={listAdminMenu}
          renderItem={(menu) => (
            <List.Item>
              <Card
                styles={{
                  header: {
                    borderBottom: "1px solid #ccc",
                  },
                }}
                onClick={() => handleClick(menu.url)}
                className="border border-blue-700 min-h-[200px] hover:bg-blue-200 cursor-pointer"
                title={
                  <div>
                    {menu.icon}
                    <span className="ml-3 font-bold">{menu.name}</span>
                  </div>
                }
              >
                {menu.description}
              </Card>
            </List.Item>
          )}
        />
      </div>
    </Fragment>
  );
};

export default AdminPage;
