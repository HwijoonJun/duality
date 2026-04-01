import axios from "axios";

const API_BASE_URL = (import.meta.env.VITE_API_URL ?? "http://localhost:8000").replace(/\/+$/, "");
const API_URL = `${API_BASE_URL}/api/v1/auth/`;

class AuthService {
    login(email: string, password: string) {
        return axios
            .post(API_URL + "login/", {
                email,
                password
            })
            .then(response => {
                if (response.data.accessToken) {
                    localStorage.setItem("user", JSON.stringify(response.data));
                }

                return response.data;
            });
    }

    logout() {
        return axios
            .post(API_URL + "logout/")
            .then(() => {
                localStorage.removeItem("user");
            });
        
    }

    register(username: string, email: string, password: string) {
        return axios.post(API_URL + "register/", {
            username,
            email,
            password
        });
    }

    getCurrentUser() {
        const userStr = localStorage.getItem("user");
        if (userStr) return JSON.parse(userStr);

        return null;
    }
}

export default new AuthService();
