import { useMutation, useQueryClient } from "@tanstack/react-query";
import { env } from "../env";
import Cookies from "js-cookie";
import type { UpdatePictureRequest } from "./types/update-picture-request";
import { message } from "antd";

export function useUpdatePicture() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (data: UpdatePictureRequest) => {
			const token = Cookies.get("access_token");
			if (!token) {
				message.error("Sua sessão de autenticação encerrou!");
			}

			const formData = new FormData();
			const file = data.picture?.[0]?.originFileObj;
			if (!file) throw new Error("No file");
			formData.append("profilePic", file);

			const response = await fetch(
				`${env.VITE_API_URL}/users/picture/${data.userId}`,
				{
					method: "PUT",
					headers: {
						Authorization: `Bearer ${token}`,
					},
					body: formData,
				},
			);

			const result = await response.json();

			if (!response.ok) {
				throw {
					status: response.status,
					message: result.error || "Erro inesperado",
				};
			}

			return result;
		},
		onError: (error: any) => {
			if (error.status === 400) {
				message.error(error.message);
				return;
			}
			message.error(
				"Houve um problema com o servidor, tente novamente mais tarde.",
			);
		},

		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["me"] });
			await queryClient.invalidateQueries({ queryKey: ["list-techs"] });
		},
	});
}
