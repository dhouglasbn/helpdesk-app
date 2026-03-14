import { useQuery } from "@tanstack/react-query";
import { env } from "../env";
import Cookies from "js-cookie";
import type { TechTicketListResponse } from "./types/tech-ticket-list-response";
import { message } from "antd";

export function useTechTicketList() {
	return useQuery({
		queryKey: ["tech-ticket-list"],
		queryFn: async () => {
			const token = Cookies.get("access_token");
			if (!token) {
				message.error("Sua sessão de autenticação encerrou!");
			}
			const response = await fetch(`${env.VITE_API_URL}/tickets/tech`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			const result = await response.json();

			if (!response.ok) {
				throw {
					status: response.status,
					message: result.error || "Erro inesperado",
				};
			}

			return result as TechTicketListResponse;
		},
	});
}
