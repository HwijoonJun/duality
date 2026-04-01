// request a presigned URL for uploading a file to S3

import axios from "axios";
import AuthService from "./auth.service"
import type { CrowdmarkUploadResponse } from "../types/File";

const API_BASE_URL = (import.meta.env.VITE_API_URL ?? "http://localhost:8000").replace(/\/+$/, "");
const API_URL = `${API_BASE_URL}/api/v1/uploads/`;

class FileUploadService {

    userStr = AuthService.getCurrentUser();

    getSignedUrls(fileName: Array<string>) {

        return axios
            .post(API_URL + "createsignedurls/", {
                fileName,
                userID: this.userStr?.id,
            })
            .then(response => {
                if (response.data.accessToken) {
                    localStorage.setItem("content", JSON.stringify(response.data));
                }
                return response.data;
            });
    }

    sendCMUrl(CM_url: string): Promise<CrowdmarkUploadResponse> {
        return axios
            .post<CrowdmarkUploadResponse>(API_URL + "uploadcmurl/", {
                CM_url,
                userID: this.userStr?.id,
            }).then(response => {
                if (response.data.response?.public_urls) {
                    localStorage.setItem("imageUrls", JSON.stringify(response.data.response.public_urls));
                }
                return response.data;
            });
    }


}


export default new FileUploadService();
