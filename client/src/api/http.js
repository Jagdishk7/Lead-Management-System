import axios from 'axios';

const http = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
  withCredentials: true,
});

let isRefreshing = false;
let pending = [];

function onRefreshed() {
  pending.forEach((cb) => cb());
  pending = [];
}

http.interceptors.response.use(
  (resp) => resp,
  async (error) => {
    const { config, response } = error || {};
    if (!response) return Promise.reject(error);
    const originalRequest = config;
    if (response.status === 401 && !originalRequest._retry && !originalRequest.url.includes('/auth/login')) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          pending.push(() => resolve(http(originalRequest)));
        });
      }
      originalRequest._retry = true;
      try {
        isRefreshing = true;
        await http.post('/auth/refresh');
        isRefreshing = false;
        onRefreshed();
        return http(originalRequest);
      } catch (e) {
        isRefreshing = false;
        return Promise.reject(e);
      }
    }
    return Promise.reject(error);
  }
);

export default http;

