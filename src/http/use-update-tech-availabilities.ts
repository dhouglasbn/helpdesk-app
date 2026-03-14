import { useMutation, useQueryClient } from "@tanstack/react-query";
import { env } from "../env";
import type { UpdateTechAvailabilitiesRequest } from "./types/update-tech-availabilities-request";
import { message } from "antd";
import Cookies from "js-cookie";

export function useUpdateTechAvailabilities() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({
			techId,
			newAvailabilities,
		}: UpdateTechAvailabilitiesRequest) => {
			const token = Cookies.get("access_token");
			if (!token) throw new Error("No token");

			const response = await fetch(
				`${env.VITE_API_URL}/users/techAvailabilities/${techId}`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({
						newAvailabilities,
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
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["me"] });
			await queryClient.invalidateQueries({ queryKey: ["list-techs"] });
		},
	});
}
