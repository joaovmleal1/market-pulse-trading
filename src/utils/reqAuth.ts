import { refreshToken } from "../contexts/AuthContext"; // função que retorna novo accessToken
import { login, logout } from "../store/reducers/token";
import store from "../store";

// Função genérica para executar chamadas autenticadas com retry automático
export async function withTokenRetry<T>(
  fn: (accessToken: string) => Promise<T>
): Promise<T> {
  const state = store.getState();
  const { accessToken, refreshToken: storedRefreshToken } = state.token;

  try {
    // Tenta a requisição com o accessToken atual
    return await fn(accessToken);
  } catch (err: any) {
    // Se falhou por token expirado, tenta renovar
    const isUnauthorized =
      err?.message?.includes("401") || err?.message?.includes("invalid token");

    if (isUnauthorized && storedRefreshToken) {
      try {
        const newAccessToken = await refreshToken(storedRefreshToken); // usa refreshToken para renovar
        store.dispatch(
          login({
            accessToken: newAccessToken,
            refreshToken: storedRefreshToken, // mantemos o mesmo refreshToken
          })
        );
        return await fn(newAccessToken);
      } catch (refreshError) {
        store.dispatch(logout());
        throw new Error("Sessão expirada. Faça login novamente.");
      }
    }

    throw err;
  }
}
