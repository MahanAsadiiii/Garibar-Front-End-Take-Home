import { useEffect, useState } from "react";
import { Alert, Table, Tag } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { useCargoOrders } from "../hooks/useCargoOrders";
import type { CargoOrder, CargoOrderStatus } from "../types/cargo";
import CargoOrderFilters, {
  type CargoOrderFiltersValue,
} from "./CargoOrderFilters";

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
  // Server-side pagination state
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  // Immediate UI filters + debounced search for the API
  const [filters, setFilters] = useState<CargoOrderFiltersValue>({});
  const [debouncedSearch, setDebouncedSearch] = useState<string | undefined>();

  // Debounce search so typing does not refetch every keystroke
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, 300);
    return () => clearTimeout(timer);
  }, [filters.search]);

  const { data, isLoading, isError, error } = useCargoOrders({
    page,
    per_page: perPage,
    status: filters.status,
    origin_city: filters.origin_city,
    search: debouncedSearch,
  });

  const handleFiltersChange = (next: CargoOrderFiltersValue) => {
    setFilters(next);
    setPage(1);
  };

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setPage(pagination.current ?? 1);
    setPerPage(pagination.pageSize ?? 10);
  };

  return (
    <>
      <CargoOrderFilters value={filters} onChange={handleFiltersChange} />

      {isError ? (
        <Alert
          type="error"
          showIcon
          message="Failed to load cargo orders"
          description={error instanceof Error ? error.message : "Unknown error"}
        />
      ) : (
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
      )}
    </>
  );
};

export default CargoOrderList;
