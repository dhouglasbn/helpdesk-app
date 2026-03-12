import { useQuery } from "@tanstack/react-query";
import { env } from "../env";
import Cookies from "js-cookie";
import type { ServiceData } from "./types/service-data";

export function useListServices() {
	return useQuery({
		queryKey: ["list-services"],
		queryFn: async () => {
			const token = Cookies.get("access_token");
			if (!token) throw new Error("No token");

			const response = await fetch(`${env.VITE_API_URL}/services/list`, {
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

			return result as ServiceData[];
		},
	});
}
