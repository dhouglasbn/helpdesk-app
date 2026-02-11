import { useMutation } from "@tanstack/react-query";
import { env } from "../env";
import type { CreateClientRequest } from "./types/create-client-request";
import type { CreateClientResponse } from "./types/create-client-response";

export function useCreateClient() {
	return useMutation({
		mutationFn: async (data: CreateClientRequest) => {
			const response = await fetch(`${env.VITE_API_URL}/users/client`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			const result: CreateClientResponse = await response.json();
			return result;
		},
	});
}
