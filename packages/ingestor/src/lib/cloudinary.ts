import { Axios, AxiosInstance } from "axios";

export interface CloudinaryUploadResponse {
  asset_id: string;
  public_id: string;
  version: number;
  version_id: string;
  signature: string;
  secure_url: string;
  url: string;
  original_filename: string;
  format: string;
}

export const createCloudinaryClient = (clientCloudinaryEnv: string) => {
  const cloudinaryClient = new Axios({
    baseURL: `https://api.cloudinary.com/v1_1/${clientCloudinaryEnv}/image`,
  });

  return cloudinaryClient as AxiosInstance;
};

export const uploadCloudinaryImage = async (
  cloudinaryClient: AxiosInstance,
  cloudinaryPreset: string,
  imageUrl: string,
) => {
  const res = await cloudinaryClient.post<string>(
    "/upload",
    `file=${imageUrl}&upload_preset=${
      process.env.CLIENT_CLOUDINARY_PRESET as string
    }`,
  );

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const data = JSON.parse(res.data) as CloudinaryUploadResponse;

  return data;
};
