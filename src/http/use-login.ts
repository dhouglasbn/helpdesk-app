import { useMutation } from "@tanstack/react-query";
import { env } from "../env";
import type { LoginRequest } from "./types/login-request";
import type { LoginResponse } from "./types/login-response";
import { message } from "antd";

export function useLogin() {
	return useMutation({
		mutationFn: async (data: LoginRequest) => {
			const response = await fetch(`${env.VITE_API_URL}/users/login`, {
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

			return result as LoginResponse;
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
