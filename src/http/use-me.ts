import { useQuery } from "@tanstack/react-query";
import { env } from "../env";
import type { UserData } from "./types/userData";
import Cookies from "js-cookie";
import { message } from "antd";

export function useMe() {
	return useQuery({
		queryKey: ["me"],
		queryFn: async () => {
			const token = Cookies.get("access_token");
			if (!token) {
				message.error("Sua sessão de autenticação encerrou!");
			}

			const response = await fetch(`${env.VITE_API_URL}/users/me`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			if (!response.ok) throw new Error("Unauthorized");
			const result = await response.json();
			const userData: UserData = result.myAccount;
			return userData;
		},
		retry: false,
	});
}
