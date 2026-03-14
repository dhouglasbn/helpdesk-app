import { useMutation, useQueryClient } from "@tanstack/react-query";
import { env } from "../env";
import Cookies from "js-cookie";
import { message } from "antd";
import type { CreateUpdateServiceRequest } from "./types/create-update-service-request";

export function useCreateService() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (data: CreateUpdateServiceRequest) => {
			const token = Cookies.get("access_token");
			if (!token) {
				message.error("Sua sessão de autenticação encerrou!");
			}

			const response = await fetch(`${env.VITE_API_URL}/services`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
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
			await queryClient.invalidateQueries({ queryKey: ["list-services"] });
		},
	});
}
