import { useState } from "react";
import { Alert, Table, Tag } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { useCargoOrders } from "../hooks/useCargoOrders";
import type { CargoOrder, CargoOrderStatus } from "../types/cargo";

const STATUS_COLOR: Record<CargoOrderStatus, string> = {
  open: "blue",
  in_progress: "orange",
  closed: "default",
};

const columns: ColumnsType<CargoOrder> = [
  { title: "Goods", dataIndex: "goods_name", key: "goods_name" },
  { title: "Origin", dataIndex: "origin_city", key: "origin_city" },
  {
    title: "Destination",
    dataIndex: "destination_city",
    key: "destination_city",
  },
  {
    title: "Weight (ton)",
    dataIndex: "weight_ton",
    key: "weight_ton",
  },
  {
    title: "Price (rial)",
    dataIndex: "price_rial",
    key: "price_rial",
    render: (value: number) => value.toLocaleString(),
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status: CargoOrderStatus) => (
      <Tag color={STATUS_COLOR[status]}>{status}</Tag>
    ),
  },
  {
    title: "Created at",
    dataIndex: "created_at",
    key: "created_at",
    render: (value: string) => new Date(value).toLocaleString(),
  },
];

const CargoOrderList = () => {
  // pagination state
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const { data, isLoading, isError, error } = useCargoOrders({
    page,
    per_page: perPage,
  });

  // Keep Ant Design pagination 
  const handleTableChange = (pagination: TablePaginationConfig) => {
    setPage(pagination.current ?? 1);
    setPerPage(pagination.pageSize ?? 10);
  };

  if (isError) {
    return (
      <Alert
        type="error"
        showIcon
        message="Failed to load cargo orders"
        description={error instanceof Error ? error.message : "Unknown error"}
      />
    );
  }

  return (
    <Table<CargoOrder>
      rowKey="id"
      columns={columns}
      dataSource={data?.data ?? []}
      loading={isLoading}
      locale={{ emptyText: "No cargo orders found" }}
      onChange={handleTableChange}
      pagination={{
        current: page,
        pageSize: perPage,
        total: data?.total ?? 0,
        showSizeChanger: true,
        pageSizeOptions: [5, 10, 20],
      }}
    />
  );
};

export default CargoOrderList;
