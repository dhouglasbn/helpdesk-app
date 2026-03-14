import { useMutation, useQueryClient } from "@tanstack/react-query";
import { env } from "../env";
import type { CreateUserRequest } from "./types/create-user-request";
import type { CreateUserResponse } from "./types/create-user-response";
import { message } from "antd";
import Cookies from "js-cookie";

export function useCreateTech() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (data: CreateUserRequest) => {
			const token = Cookies.get("access_token");
			if (!token) {
				message.error("Sua sessão de autenticação encerrou!");
			}

			const response = await fetch(`${env.VITE_API_URL}/users/tech`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			const result = await response.json();

			if (!response.ok) {
				throw {
					status: response.status,
					message: result.error || "Erro inesperado",
				};
			}

			return result as CreateUserResponse;
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
			await queryClient.invalidateQueries({ queryKey: ["list-techs"] });
		},
	});
}
