import axios from 'axios';
import authHeader from './auth-header';

const API_BASE_URL = (import.meta.env.VITE_API_URL ?? "http://localhost:8000").replace(/\/+$/, "");

class UserService {
  getPublicContent() {
    return axios.get(`${API_BASE_URL}/api/v1/auth/all/`)
  }

  getUserBoard() {
    return axios.get(`${API_BASE_URL}/api/v1/auth/me/`, { headers: authHeader() });
  }

  getModeratorBoard() {
    return axios.get(`${API_BASE_URL}/api/v1/mod/`, { headers: authHeader() });
  }

  getAdminBoard() {
    return axios.get(`${API_BASE_URL}/admin/`, { headers: authHeader() });
  }
    
}

export default new UserService();
