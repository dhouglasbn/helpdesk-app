import { useQuery } from "@tanstack/react-query";
import { env } from "../env";
import Cookies from "js-cookie";
import type { ClientTicketHistoryResponse } from "./types/client-ticket-history-response";

export function useClientTicketHistory() {
	return useQuery({
		queryKey: ["client-history"],
		queryFn: async () => {
			const token = Cookies.get("access_token");
			if (!token) throw new Error("No token");

			const response = await fetch(
				`${env.VITE_API_URL}/tickets/clientHistory`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);

			const result = await response.json();

			if (!response.ok) {
				throw {
					status: response.status,
					message: result.error || "Erro inesperado",
				};
			}

			return result as ClientTicketHistoryResponse;
		},
	});
}
