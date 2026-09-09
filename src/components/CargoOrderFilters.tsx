import { Input, Select, Space } from "antd";
import {
  CARGO_ORDER_STATUS_OPTIONS,
  type CargoOrderStatus,
} from "../types/cargo";

export type CargoOrderFiltersValue = {
  status?: CargoOrderStatus;
  origin_city?: string;
  search?: string;
};

type Props = {
  value: CargoOrderFiltersValue;
  onChange: (next: CargoOrderFiltersValue) => void;
};

const STATUS_OPTIONS = [
  { label: "All statuses", value: "" },
  ...CARGO_ORDER_STATUS_OPTIONS,
];

// Filter controls for status, origin city, and goods search
const CargoOrderFilters = ({ value, onChange }: Props) => {
  return (
    <Space wrap style={{ marginBottom: 16 }}>
      <Select
        style={{ width: 160 }}
        options={STATUS_OPTIONS}
        value={value.status ?? ""}
        onChange={(status) =>
          onChange({
            ...value,
            status: status ? (status as CargoOrderStatus) : undefined,
          })
        }
      />
      <Input
        allowClear
        placeholder="Origin city"
        style={{ width: 180 }}
        value={value.origin_city ?? ""}
        onChange={(e) =>
          onChange({
            ...value,
            origin_city: e.target.value || undefined,
          })
        }
      />
      <Input.Search
        allowClear
        placeholder="Search goods"
        style={{ width: 220 }}
        value={value.search ?? ""}
        onChange={(e) =>
          onChange({
            ...value,
            search: e.target.value || undefined,
          })
        }
      />
    </Space>
  );
};

export default CargoOrderFilters;
