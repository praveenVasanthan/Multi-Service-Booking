import { isAxiosError } from "axios";
import axiosInstance from "./axiosInstance";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export default async function makeRequest<T = any, D = unknown>(
  endpoint: string,
  method: HttpMethod = "GET",
  body: D = {} as D,
  headers: Record<string, string> = {
    "Content-Type": "application/json",
  }
) {
  try {
    const response = await axiosInstance.request<T>({
      url: endpoint,
      method,
      ...(method === "GET" ? { params: body } : { data: body }),
      headers: {
        ...headers,
      },
    });
    return response.data;
  } catch (error: any) {
    if (isAxiosError(error)) {
      console.error("API ERROR:", error);
      throw error.response?.data;
    } else {
      console.error("UNKNOWN ERROR:", error);
      throw error;
    }
  }
}
