import httpService from "../httpService";

export const getProfile = async () => {
  const res = await httpService.fetchWithAuth({
    url: "/api/profile/me",
    options: {
      method: "GET",
    },
  });

  return res.data;
};