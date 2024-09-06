import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

const axiosRequestConfiguration: AxiosRequestConfig = {
  responseType: 'json',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 90000,
};
const instance = axios.create(axiosRequestConfiguration);
const responseBody = <T>(response: AxiosResponse<T>): T => response.data;
const handleApiRequestError = (error: unknown, method: string) => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    let errorMessage = `Error occurred during ${method} request: ${(error as AxiosError).message}`;
    if (axiosError.response) {
      errorMessage += `\nStatus: ${axiosError.response.status}`;
      errorMessage += `\nStatus text: ${axiosError.response.statusText}`;
      errorMessage += `\nData: ${JSON.stringify(axiosError.response.data)}`;
    }

    return new Error(errorMessage);
  } else {
    return error;
  }
};
export const apiClient = {
  get: async <T>(url: string) => {
    try {
      const response = await instance.get<T>(url);
      return responseBody(response);
    } catch (error) {
      throw handleApiRequestError(error, 'GET');
    }
  },
  post: async <T, K = object>(url: string, body?: K) => {
    try {
      const response = await instance.post<T, AxiosResponse<T>, K>(url, body);
      return responseBody(response);
    } catch (error) {
      throw handleApiRequestError(error, 'POST');
    }
  },
};
