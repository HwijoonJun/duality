export interface IFile {
  url: string,
  name: string,
}

export interface CrowdmarkUploadResult {
  uploads: string[];
  public_urls: string[];
}

export interface CrowdmarkUploadResponse {
  message: string;
  response: CrowdmarkUploadResult;
}
