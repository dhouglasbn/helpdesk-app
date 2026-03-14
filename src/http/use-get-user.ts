import { useQuery } from "@tanstack/react-query";
import { env } from "../env";
import type { UserData } from "./types/user-data";
import Cookies from "js-cookie";
import { message } from "antd";

export function useGetUser(userId?: string) {
	return useQuery({
		queryKey: ["user-data", userId],
		queryFn: async ({ queryKey }) => {
			const [, id] = queryKey;
			const token = Cookies.get("access_token");
			if (!token) {
				message.error("Sua sessão de autenticação encerrou!");
			}

			const response = await fetch(`${env.VITE_API_URL}/users/${id}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			if (!response.ok) throw new Error("Usuário não encontrado!");
			const result = await response.json();
			const userData: UserData = result.user;
			return userData;
		},
		enabled: !!userId,
		retry: false,
	});
}
