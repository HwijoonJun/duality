import axios from 'axios';
import authHeader from './auth-header';
import { API_BASE_URL } from "./config";

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
