import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios";
import { store } from "./store";

export type THttpArgs = {
    url: string;
    options?: AxiosRequestConfig;
};

const api = axios.create({
    baseURL: "http://localhost:8080",
    headers: {
        "Content-Type": "application/json",
    },
});

export const httpService = {

    // Without Authentication
    fetch: async ({
        url,
        options,
    }: THttpArgs): Promise<AxiosResponse<any>> => {

        return await api({
            url,
            ...options,
        });
    },

    // With Authentication
    fetchWithAuth: async ({
        url,
        options,
    }: THttpArgs): Promise<AxiosResponse<any>> => {

        const token = store.getState().auth.token;

        return await api({
            url,
            ...options,
            headers: {
                ...options?.headers,
                Authorization: `Bearer ${token}`,
            },
        });
    },
};

export default httpService;