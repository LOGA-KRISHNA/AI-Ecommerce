// services/addressService.ts

import httpService from "../httpService";
import type { TAddress } from "../types";

export const getAddresses = async () => {
  const res = await httpService.fetchWithAuth({
    url: "/api/addresses",
    options: {
      method: "GET",
    },
  });

  return res.data;
};

export const createAddress = async (
  body: TAddress
) => {
  const res = await httpService.fetchWithAuth({
    url: "/api/addresses",
    options: {
      method: "POST",
      data: body,
    },
  });

  return res.data;
};

export const updateAddress = async (
  id: string,
  body: TAddress
) => {
  const res = await httpService.fetchWithAuth({
    url: `/api/addresses/${id}`,
    options: {
      method: "PUT",
      data: body,
    },
  });

  return res.data;
};

export const deleteAddress = async (
  id: string
) => {
  return await httpService.fetchWithAuth({
    url: `/api/addresses/${id}`,
    options: {
      method: "DELETE",
    },
  });
};