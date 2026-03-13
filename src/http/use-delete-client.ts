import { useMutation, useQueryClient } from "@tanstack/react-query";
import { env } from "../env";
import type { UpdateUserRequest } from "./types/update-user-request";
import { message } from "antd";
import Cookies from "js-cookie";
import type { DeleteClientRequest } from "./types/delete-client-request";

export function useDeleteClient() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ userId }: DeleteClientRequest) => {
			const token = Cookies.get("access_token");
			if (!token) throw new Error("No token");

			const response = await fetch(
				`${env.VITE_API_URL}/users/client/${userId}`,
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
		// onSuccess: async () => {
		// 	await queryClient.invalidateQueries({ queryKey: ["me"] });
		// },
	});
}
