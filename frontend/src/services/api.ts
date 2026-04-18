import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    // Don't redirect on login failures
    const url = error.config?.url;
    const isLoginRequest = url === '/auth/login';
    
    if (error.response?.status === 401 && !isLoginRequest) {
      const isAuthMe = url === '/auth/me';
      const isLoginPage = window.location.pathname === "/login";
      const isHomePage = window.location.pathname === "/";
      
      if (!isLoginPage && !isHomePage && !isAuthMe) {
        window.location.href = "/login";
      }
    }
    
    // Always reject so the calling code can handle the error
    return Promise.reject(error);
  }
);

export default api;