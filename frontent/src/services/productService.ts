import httpService from "../httpService";
import type { TCategory, TPage, TProduct } from "../types";

export type TProductFilters = {
  q?: string;
  categoryId?: string;
  minPrice?: string;
  maxPrice?: string;
  inStock?: boolean;
  sort?: string;
  page?: number;
  size?: number;
};

const toParams = (filters: TProductFilters = {}) => {
  const params: Record<string, string | number | boolean> = {};
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "" && value !== false) {
      params[key] = value;
    }
  });
  return params;
};

export const getProducts = async (filters: TProductFilters = {}) => {
  const res = await httpService.fetch({
    url: "/api/public/products",
    options: {
      method: "GET",
      params: toParams(filters),
    },
  });

  return res.data as TPage<TProduct>;
};

export const getProduct = async (id: string) => {
  const res = await httpService.fetch({
    url: `/api/public/products/${id}`,
    options: {
      method: "GET",
    },
  });

  return res.data as TProduct;
};

export const getCategories = async () => {
  const res = await httpService.fetch({
    url: "/api/public/categories",
    options: {
      method: "GET",
    },
  });

  return res.data as TCategory[];
};
