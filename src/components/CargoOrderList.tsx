import { useEffect, useState } from "react";
import { MoreOutlined } from "@ant-design/icons";
import {
  Alert,
  Button,
  Dropdown,
  Flex,
  Modal,
  Table,
  Tag,
  message,
} from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import {
  useCargoOrders,
  useDeleteCargoOrder,
} from "../hooks/useCargoOrders";
import { useCargoListUrlState } from "../hooks/useCargoListUrlState";
import {
  CARGO_ORDER_STATUS_LABELS,
  type CargoOrder,
  type CargoOrderStatus,
} from "../types/cargo";
import CargoOrderFilters, {
  type CargoOrderFiltersValue,
} from "./CargoOrderFilters";
import CargoOrderFormModal from "./CargoOrderFormModal";

const STATUS_COLOR: Record<CargoOrderStatus, string> = {
  open: "blue",
  in_progress: "orange",
  closed: "default",
};

const CargoOrderList = () => {
  const { page, setPage, perPage, setPerPage, filters, setFilters } =
    useCargoListUrlState();

  // Debounced search for the API (URL keeps the live input value)
  const [debouncedSearch, setDebouncedSearch] = useState(filters.search);

  // Create / edit modal state (null order = create)
  const [modalOpen, setModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<CargoOrder | null>(null);

  const deleteOrder = useDeleteCargoOrder();

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

  const openCreateModal = () => {
    setEditingOrder(null);
    setModalOpen(true);
  };

  const openEditModal = (order: CargoOrder) => {
    setEditingOrder(order);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingOrder(null);
  };

  // Confirm before calling delete mutation
  const handleDelete = async (id: number) => {
    try {
      await deleteOrder.mutateAsync(id);
      message.success("Cargo order deleted");
    } catch (err) {
      message.error(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const columns: ColumnsType<CargoOrder> = [
    { title: "ID", dataIndex: "id", key: "id", width: 72 },
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
        <Tag color={STATUS_COLOR[status]}>{CARGO_ORDER_STATUS_LABELS[status]}</Tag>
      ),
    },
    {
      title: "Created at",
      dataIndex: "created_at",
      key: "created_at",
      render: (value: string) => new Date(value).toLocaleString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_value, record) => (
        <Dropdown
          trigger={["click"]}
          menu={{
            items: [
              {
                key: "edit",
                label: "Edit",
                onClick: () => openEditModal(record),
              },
              {
                key: "delete",
                label: "Delete",
                danger: true,
                onClick: () => {
                  Modal.confirm({
                    title: "Delete this cargo order?",
                    okText: "Delete",
                    okButtonProps: { danger: true },
                    onOk: () => handleDelete(record.id),
                  });
                },
              },
            ],
          }}
        >
          <Button type="text" icon={<MoreOutlined />} aria-label="Actions" />
        </Dropdown>
      ),
    },
  ];

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
      <Flex justify="space-between" align="flex-start" wrap gap={12}>
        <CargoOrderFilters value={filters} onChange={handleFiltersChange} />
        <Button type="primary" onClick={openCreateModal}>
          Add order
        </Button>
      </Flex>

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
          loading={isLoading || deleteOrder.isPending}
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

      <CargoOrderFormModal
        open={modalOpen}
        order={editingOrder}
        onClose={closeModal}
      />
    </>
  );
};

export default CargoOrderList;
