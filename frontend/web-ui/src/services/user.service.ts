import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8000/';

class UserService {
  getPublicContent() {
    return axios.get(API_URL + 'api/v1/all/')
  }

  getUserBoard() {
    return axios.get(API_URL + 'api/v1/me/', { headers: authHeader() });
  }

  getModeratorBoard() {
    return axios.get(API_URL + 'api/v1/mod/', { headers: authHeader() });
  }

  getAdminBoard() {
    return axios.get(API_URL + 'api/v1/admin/', { headers: authHeader() });
  }
    
}

export default new UserService();