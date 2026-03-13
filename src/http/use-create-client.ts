import { useMutation } from "@tanstack/react-query";
import { env } from "../env";
import type { CreateUserRequest } from "./types/create-user-request";
import type { CreateUserResponse } from "./types/create-user-response";
import { message } from "antd";

export function useCreateClient() {
	return useMutation({
		mutationFn: async (data: CreateUserRequest) => {
			const response = await fetch(`${env.VITE_API_URL}/users/client`, {
				method: "POST",
				headers: {
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
	});
}
