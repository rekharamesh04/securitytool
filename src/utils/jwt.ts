import axiosInstance from './axiosInstance';

export const setSession = (accessToken: string | null): void => {
  if (accessToken) {
    localStorage.setItem('accessToken', accessToken);
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
  } else {
    localStorage.removeItem('accessToken');
    delete axiosInstance.defaults.headers.common['Authorization'];
  }
};

export const getSession = (): string | null => {
  const accessToken = localStorage.getItem('accessToken')
  axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
  return accessToken;
};