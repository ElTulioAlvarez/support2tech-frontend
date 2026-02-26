import { ENV } from "../../app/config/env";
import { tokenStorage } from "../storage/tokenStorage";
import { authEvents } from "./authEvents";

type ApiErrorShape = { message?: string };

async function parseError(res: Response) {
  try {
    const data = (await res.json()) as ApiErrorShape;
    return data?.message || `HTTP ${res.status}`;
  } catch {
    return `HTTP ${res.status}`;
  }
}

export const apiClient = {
  async request<T>(path: string, init?: RequestInit): Promise<T> {
    const token = tokenStorage.get();

    const headers = new Headers(init?.headers);
    headers.set("Content-Type", "application/json");
    if (token) headers.set("Authorization", `Bearer ${token}`);

    const res = await fetch(`${ENV.API_URL}${path}`, {
      ...init,
      headers,
    });

    if (!res.ok) {
      const msg = await parseError(res);

      if (res.status === 401) {
        tokenStorage.clear();
        authEvents.emitUnauthorized(); // ✅ aquí está la magia
      }

      throw new Error(msg);
    }

    return (await res.json()) as T;
  },
};