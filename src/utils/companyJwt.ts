import axiosInstance from './axiosInstance';

export const setSession = (companyAccessToken: string | null): void => {
  if (companyAccessToken) {
    localStorage.setItem('companyAccessToken', companyAccessToken);
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${companyAccessToken}`;
  } else {
    localStorage.removeItem('companyAccessToken');
    delete axiosInstance.defaults.headers.common['Authorization'];
  }
};

export const getSession = (): string | null => {
  const companyAccessToken = localStorage.getItem('companyAccessToken')
  axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${companyAccessToken}`;
  return companyAccessToken;
};