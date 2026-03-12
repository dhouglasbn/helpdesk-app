import type { UploadFile } from "antd";

export type UpdatePictureRequest = {
	userId: string;
	picture: UploadFile[];
};
