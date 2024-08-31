import BackBtn from "@renderer/components/Button/BackBtn";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import {
  Table,
  Pagination,
  Input,
  Modal,
  Select,
  PaginationProps,
  Button,
} from "antd";
import { Class } from "@renderer/interfaces/class.interface";
import { useClass } from "@renderer/hooks/useClass";
import Error from "@renderer/components/Error";

import { useWhiteList } from "@renderer/hooks/useWhiteList";
import { WhiteList } from "@renderer/interfaces/whitelist.interface";
import notify from "@renderer/common/function/notify";
import { EditOutlined, SaveOutlined } from "@ant-design/icons";
import {
  showAlert,
  showAlertConfirm,
  showAlertError,
} from "@renderer/common/function/swalAlert";
import showLoading from "@renderer/common/function/showLoading";

const { Search } = Input;

const showTotal: PaginationProps["showTotal"] = (total) =>
  `Tổng cộng có ${total} người dùng`;

const WhiteListManagement = memo(() => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [classes, setClasses] = useState<Class[]>([]);
  const [dataWhiteList, setDataWhiteList] = useState<WhiteList[]>([]);
  const [selectedClass, setSelectedClass] = useState<Class | undefined>(
    undefined
  );
  const [data, setData] = useState<string | undefined>(undefined);
  const {
    listClasses,
    isError: isErrorClass,
  } = useClass();

  const { whiteList, refetch, isError, isPending, updateWLByClass } =
    useWhiteList({
      page: currentPage,
      size: pageSize,
      search: searchText,
      classId: !selectedClass ? undefined : selectedClass.id,
    });

  const handleSearch = useCallback((value) => {
    setSearchText(value);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  }, []);

  const handleShowModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setData(undefined);
  }, []);

  const handleSelectClass = useCallback(
    (classId: string) => {
      if (!classId) {
        notify("error", "Không thể lấy ID của lớp học");
      } else {
        if (classId === "undefined") {
          setSelectedClass(undefined);
        } else {
          const foundClass = classes.find((item) => item.id === classId);

          if (!foundClass) {
            notify("error", "Không tìm thấy lớp học");
          } else {
            setSelectedClass(foundClass);
          }
        }
      }
    },
    [classes]
  );

  const handleSubmit = useCallback(() => {
    if (data) {
      const newData = {
        emails: data
          .split("\n")
          .map((email) => email.trim())
          .filter((email) => email),
      };

      if (selectedClass) {
        showAlertConfirm({
          title: "Xác nhận cập nhật",
          icon: "warning",
          confirmButtonText: "Cập nhật",
          html: `Bạn có chắc chắn muốn cập nhật danh sách trắng cho lớp <b>${selectedClass.name}</b>? <br/><br/><span class='font-bold text-red-700'>Lưu ý: Thao tác này không thể khôi phục</span>`,
        }).then((confirm) => {
          if (confirm.isConfirmed) {
            showLoading(true);
            updateWLByClass({
              classId: selectedClass.id,
              data: newData,
            })
              .then(() => {
                showAlert(
                  "Thành công",
                  `Danh sách trắng của lớp <b>${selectedClass.name}</b> <br/> đã được cập nhật thành công`,
                  "success"
                ).then((confirm) => {
                  if (confirm.isConfirmed) {
                    handleCloseModal();

                    refetch();
                  }
                });
              })
              .catch((err) => {
                showAlertError(err);
              });
          }
        });
      } else {
        notify("error", "Không lấy được ID của lớp cần cập nhật");
      }
    }
  }, [data]);

  const columns = useMemo(
    () => [
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
      },
      {
        title: "Lớp học",
        dataIndex: "class",
        key: "className",
        render: (dataClass) => <div>{dataClass?.name}</div>,
      },
    ],
    []
  );

  useEffect(() => {
    if (whiteList) {
      setTotal(whiteList.total);
      setDataWhiteList(whiteList.list);
    }
  }, [whiteList]);

  useEffect(() => {
    if (listClasses) {
      setClasses(listClasses.list);
    }
  }, [listClasses]);

  if (isError || isErrorClass) {
    return <Error />;
  }

  return (
    <div>
      <Helmet>
        <title>QUẢN LÝ DANH SÁCH TRẮNG</title>
      </Helmet>

      <div className="mt-4">
        <BackBtn />
      </div>

      <div className="p-4">
        <div className="w-full mb-4 flex items-center gap-x-6">
          <div className="flex items-center gap-x-3">
            <span>Theo lớp học: </span>
            <Select
              placeholder="Tất cả"
              className="min-w-[200px]"
              value={selectedClass?.id}
              onChange={(value) => handleSelectClass(value)}
            >
              <Select.Option value={"undefined"}>Tất cả</Select.Option>
              {classes.map((item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </div>

          <div>
            {selectedClass ? (
              <Button onClick={handleShowModal} type="primary">
                <EditOutlined /> Cập nhật
              </Button>
            ) : (
              <span className="text-red-500 font-bold">
                Để chỉnh sửa, vui lòng chọn lớp học trước
              </span>
            )}
          </div>
        </div>
        <Search
          placeholder="Tìm kiếm theo địa chỉ email"
          onSearch={handleSearch}
          style={{ marginBottom: 16 }}
          allowClear
        />

        <Table
          columns={columns}
          dataSource={dataWhiteList}
          loading={isPending}
          pagination={false}
          rowKey="id"
          sticky
        />

        <Pagination
          current={currentPage}
          total={total}
          pageSize={pageSize}
          onChange={handlePageChange}
          showSizeChanger
          showLessItems
          showTotal={showTotal}
          pageSizeOptions={[5, 10, 20, 50]}
          style={{ marginTop: 16 }}
        />
      </div>

      <Modal
        title={
          <>
            Cập nhật cho lớp{" "}
            <span className="text-blue-700 font-bold">
              {selectedClass?.name}
            </span>
          </>
        }
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        maskClosable={false}
        keyboard={false}
      >
        <div className="font-bold mb-2">
          Lưu ý quan trọng:{" "}
          <span className="text-red-600 font-bold">
            Dữ liệu mới sẽ thay thế hoàn toàn dữ liệu cũ
          </span>
        </div>
        <Input.TextArea
          value={data}
          placeholder="Mỗi dòng là một địa chỉ Email"
          onChange={(e) => setData(e.target.value)}
          autoSize={{ minRows: 15, maxRows: 15 }}
        />

        <div className="mt-4 flex justify-between">
          <div>
            <span>
              Số lượng email:{" "}
              <span className="font-bold text-blue-700">{data?.split("\n").filter((email) => email).length || 0}</span>
            </span>
          </div>
          <Button disabled={!data} onClick={handleSubmit} type="primary">
            <SaveOutlined /> Cập nhật
          </Button>
        </div>
      </Modal>
    </div>
  );
});

export default WhiteListManagement;
