import axios, { InternalAxiosRequestConfig } from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_URL,
});
axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  config.headers["Content-Type"] = "application/json";
  return config;
});

export const getProducts = () => axiosInstance.get("/product");
export const createProduct = (name: string) =>
  axiosInstance.post("/product", { name });
export const updateProduct = (id: string, name: string) =>
  axiosInstance.put(`/product/${id}`, { name });
export const deleteProduct = (id: string) =>
  axiosInstance.delete(`/product/${id}`);

export const getProductTypes = () => axiosInstance.get("/product-type");
export const createProductType = (productData: object) =>
  axiosInstance.post("/product-type", { productData });
export const updateProductType = (id: string, productData: object) =>
  axiosInstance.put(`/product-type/${id}`, { productData });
export const deleteProductTypes = (id: string) =>
  axiosInstance.delete(`/product-type/${id}`);

export const getCrossSells = () => axiosInstance.get("/cross-sell");
export const addCrossSell = (option: string[], crossSellOption: string[]) =>
  axiosInstance.post("/cross-sell", { option, crossSellOption });
export const updateCrossSell = (
  id: string,
  option: string[],
  crossSellOption: string[]
) => axiosInstance.put(`/cross-sell/${id}`, { option, crossSellOption });
export const deleteCrossSell = (id: string) =>
  axiosInstance.delete(`/cross-sell/${id}`);
