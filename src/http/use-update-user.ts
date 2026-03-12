import { useMutation, useQueryClient } from "@tanstack/react-query";
import { env } from "../env";
import type { UpdateUserRequest } from "./types/update-user-request";
import type { CreateClientResponse } from "./types/create-client-response";
import { message } from "antd";
import Cookies from "js-cookie";

export function useUpdateUser() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({
			userId,
			newName,
			newEmail,
			newAddress,
			newPhone,
			role,
		}: UpdateUserRequest) => {
			const token = Cookies.get("access_token");
			if (!token) throw new Error("No token");

			const response = await fetch(
				`${env.VITE_API_URL}/users/${role}/${userId}`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({
						newName,
						newEmail,
						newAddress,
						newPhone,
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

			return result as CreateClientResponse;
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
		},
	});
}
