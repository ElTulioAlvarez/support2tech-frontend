import { ENV } from "../../app/config/env";
import { tokenStorage } from "../storage/tokenStorage";
import { authEvents } from "./authEvents";

type ApiErrorShape = {
  message?: string;
  error?: string | { message?: string };
};

type ApiRequestOptions = RequestInit & {
  requireAuth?: boolean;
  autoLogoutOn401?: boolean;
};

async function parseError(res: Response) {
  try {
    const data = (await res.json()) as ApiErrorShape;

    if (typeof data?.message === "string" && data.message.trim()) {
      return data.message;
    }

    if (typeof data?.error === "string" && data.error.trim()) {
      return data.error;
    }

    if (
      data?.error &&
      typeof data.error === "object" &&
      typeof data.error.message === "string" &&
      data.error.message.trim()
    ) {
      return data.error.message;
    }

    return `HTTP ${res.status}`;
  } catch {
    return `HTTP ${res.status}`;
  }
}

export const apiClient = {
  async request<T>(path: string, init?: ApiRequestOptions): Promise<T> {
    const {
      requireAuth = true,
      autoLogoutOn401 = false,
      ...fetchInit
    } = init ?? {};

    const token = tokenStorage.get();
    const headers = new Headers(fetchInit.headers);

    const hasBody =
      fetchInit.body !== undefined &&
      fetchInit.body !== null &&
      !(fetchInit.body instanceof FormData);

    if (hasBody && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    if (requireAuth) {
      if (!token) {
        if (autoLogoutOn401) {
          tokenStorage.clear();
          authEvents.emitUnauthorized();
        }
        throw new Error("Sesión no disponible");
      }

      headers.set("Authorization", `Bearer ${token}`);
    }

    const res = await fetch(`${ENV.API_URL}${path}`, {
      ...fetchInit,
      headers,
    });

    if (!res.ok) {
      const msg = await parseError(res);

      if (res.status === 401 && autoLogoutOn401) {
        tokenStorage.clear();
        authEvents.emitUnauthorized();
      }

      throw new Error(msg);
    }

    if (res.status === 204) {
      return undefined as T;
    }

    return (await res.json()) as T;
  },
};