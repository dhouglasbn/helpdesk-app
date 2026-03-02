import { useMutation } from "@tanstack/react-query";
import { env } from "../env";
import { toast } from "react-toastify";
import type { LoginRequest } from "./types/login-request";
import type { LoginResponse } from "./types/login-response";

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
				toast.error(error.message);
				return;
			}
			toast.error(
				"Houve um problema com o servidor, tente novamente mais tarde.",
			);
		},
	});
}
