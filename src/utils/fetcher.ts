import axiosInstance from "./axiosInstance";

export const getFetcher = (url: string) => axiosInstance.get(url).then((res) => res.data);
