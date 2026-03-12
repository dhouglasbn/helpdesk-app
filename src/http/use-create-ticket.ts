import { useMutation, useQueryClient } from "@tanstack/react-query";
import { env } from "../env";
import { toast } from "react-toastify";
import type { CreateTicketRequest } from "./types/create-ticket-request";
import Cookies from "js-cookie";

export function useCreateTicket() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (data: CreateTicketRequest) => {
			const token = Cookies.get("access_token");
			if (!token) throw new Error("No token");

			const response = await fetch(`${env.VITE_API_URL}/tickets`, {
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
				toast.error(error.message);
				return;
			}
			toast.error(
				"Houve um problema com o servidor, tente novamente mais tarde.",
			);
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["client-history"] });
		},
	});
}
