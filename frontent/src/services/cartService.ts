import httpService from "../httpService";
import type { TCart } from "../types";

export const getCart = async () => {
  const res = await httpService.fetchWithAuth({
    url: "/api/cart",
    options: {
      method: "GET",
    },
  });

  return res.data as TCart;
};

export const addCartItem = async (productId: string, quantity = 1) => {
  const res = await httpService.fetchWithAuth({
    url: "/api/cart/items",
    options: {
      method: "POST",
      data: { productId, quantity },
    },
  });

  return res.data as TCart;
};

export const updateCartItem = async (itemId: number, quantity: number) => {
  const res = await httpService.fetchWithAuth({
    url: `/api/cart/items/${itemId}`,
    options: {
      method: "PUT",
      data: { quantity },
    },
  });

  return res.data as TCart;
};

export const removeCartItem = async (itemId: number) => {
  const res = await httpService.fetchWithAuth({
    url: `/api/cart/items/${itemId}`,
    options: {
      method: "DELETE",
    },
  });

  return res.data as TCart;
};
