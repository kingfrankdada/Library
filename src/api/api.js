import axios from "axios";

const baseURL = process.env.VUE_APP_API_BASE_URL;

const instance = axios.create({
  baseURL,
  timeout: 5000,
});

// 请求拦截器
// instance.interceptors.request.use(
//   (config) => {
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// 响应拦截器
// instance.interceptors.response.use(
//   (response) => response,
//   (error) => Promise.reject(error)
// );

export default instance;