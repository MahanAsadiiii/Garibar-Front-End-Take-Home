import { useEffect, useState } from "react";
import {
  CARGO_ORDER_STATUSES,
  type CargoOrderStatus,
} from "../types/cargo";
import type { CargoOrderFiltersValue } from "../components/CargoOrderFilters";

const DEFAULT_PAGE = 1;
const DEFAULT_PER_PAGE = 10;
const ALLOWED_PER_PAGE = new Set([5, 10, 20]);

function isCargoOrderStatus(value: string): value is CargoOrderStatus {
  return (CARGO_ORDER_STATUSES as readonly string[]).includes(value);
}

function readFromUrl(): {
  page: number;
  perPage: number;
  filters: CargoOrderFiltersValue;
} {
  const params = new URLSearchParams(window.location.search);

  const pageRaw = Number(params.get("page"));
  const page =
    Number.isFinite(pageRaw) && pageRaw >= 1 ? Math.floor(pageRaw) : DEFAULT_PAGE;

  const perPageRaw = Number(params.get("per_page"));
  const perPage =
    Number.isFinite(perPageRaw) && ALLOWED_PER_PAGE.has(perPageRaw)
      ? perPageRaw
      : DEFAULT_PER_PAGE;

  const filters: CargoOrderFiltersValue = {};
  const status = params.get("status");
  if (status && isCargoOrderStatus(status)) filters.status = status;

  const originCity = params.get("origin_city");
  if (originCity) filters.origin_city = originCity;

  const search = params.get("search");
  if (search) filters.search = search;

  return { page, perPage, filters };
}

function writeToUrl(
  page: number,
  perPage: number,
  filters: CargoOrderFiltersValue,
) {
  const params = new URLSearchParams();

  if (page !== DEFAULT_PAGE) params.set("page", String(page));
  if (perPage !== DEFAULT_PER_PAGE) params.set("per_page", String(perPage));
  if (filters.status) params.set("status", filters.status);
  if (filters.origin_city) params.set("origin_city", filters.origin_city);
  if (filters.search) params.set("search", filters.search);

  const query = params.toString();
  const nextUrl = query
    ? `${window.location.pathname}?${query}`
    : window.location.pathname;
  const currentUrl = `${window.location.pathname}${window.location.search}`;

  if (nextUrl !== currentUrl) {
    window.history.replaceState(null, "", nextUrl);
  }
}

/** Keeps list page, page size, and filters in sync with the URL query string. */
export function useCargoListUrlState() {
  const [initial] = useState(readFromUrl);
  const [page, setPage] = useState(initial.page);
  const [perPage, setPerPage] = useState(initial.perPage);
  const [filters, setFilters] = useState(initial.filters);

  useEffect(() => {
    writeToUrl(page, perPage, filters);
  }, [page, perPage, filters]);

  return {
    page,
    setPage,
    perPage,
    setPerPage,
    filters,
    setFilters,
  };
}
