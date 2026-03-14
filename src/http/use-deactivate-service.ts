import { useMutation, useQueryClient } from "@tanstack/react-query";
import { env } from "../env";
import { message } from "antd";
import Cookies from "js-cookie";
import type { DeactivateServiceRequest } from "./types/deactivate-service-request";

export function useDeactivateService() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ serviceId }: DeactivateServiceRequest) => {
			const token = Cookies.get("access_token");
			if (!token) {
				message.error("Sua sessão de autenticação encerrou!");
			}

			const response = await fetch(
				`${env.VITE_API_URL}/services/${serviceId}`,
				{
					method: "DELETE",
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);

			if (response.status !== 204) {
				const result = await response.json();
				throw {
					status: response.status,
					message: result.error || "Erro inesperado",
				};
			}
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
