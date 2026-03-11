import { type PropsWithChildren, createContext, useContext, useEffect } from "react";
import { useMe } from "../../http/use-me";
import { useQueryClient } from "@tanstack/react-query";
import Cookies from 'js-cookie'
import type { UserData } from "../../http/types/userData";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  user: UserData | null;
  loading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useMe();
  const navigate = useNavigate();

  

  useEffect(() => {
    if (isError) {
      Cookies.remove("access_token");
    }
  }, [isError])

  async function logout() {
    Cookies.remove("access_token");
    queryClient.removeQueries({ queryKey: ["me"] })
    navigate("/", { replace: true })
  }

  return (
    <AuthContext.Provider
    value={{
      user: data ?? null,
      loading: isLoading,
      logout
    }}> 
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider")
  return context;
}