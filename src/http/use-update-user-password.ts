import { useMutation } from "@tanstack/react-query";
import { env } from "../env";
import type { UpdateUserPasswordRequest } from "./types/update-user-password-request";
import { message } from "antd";
import Cookies from "js-cookie";

export function useUpdateUserPassword() {
	return useMutation({
		mutationFn: async ({
			userId,
			currentPassword,
			newPassword,
		}: UpdateUserPasswordRequest) => {
			const token = Cookies.get("access_token");
			if (!token) {
				message.error("Sua sessão de autenticação encerrou!");
			}

			const response = await fetch(
				`${env.VITE_API_URL}/users/password/${userId}`,
				{
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({
						currentPassword,
						newPassword,
					}),
				},
			);

			const result = await response.json();

			if (!response.ok) {
				throw {
					status: response.status,
					message: result.error || "Erro inesperado",
				};
			}

			return;
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
	});
}
