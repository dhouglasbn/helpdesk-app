import { useQuery } from "@tanstack/react-query";
import { env } from "../env";
import Cookies from "js-cookie";
import type { UserData } from "./types/userData";

export function useListTechs() {
	return useQuery({
		queryKey: ["list-techs"],
		queryFn: async () => {
			const token = Cookies.get("access_token");
			if (!token) throw new Error("No token");

			const response = await fetch(`${env.VITE_API_URL}/users/techList`, {
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

			return result.techList as UserData[];
		},
	});
}
