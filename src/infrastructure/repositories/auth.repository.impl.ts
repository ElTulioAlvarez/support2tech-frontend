import type { AuthRepository } from "../../domain/repositories/auth.repository";
import type { Session } from "../../domain/entities/session";
import type { User } from "../../domain/entities/user";
import { apiClient } from "../http/apiClient";
import { tokenStorage } from "../storage/tokenStorage";

type LoginResponse = {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  token_type?: string;
  user: { id: string; email?: string | null };
};

type AuthMeResponse = {
  user: {
    sub: string;
    email?: string | null;
  };
};

type ProfileResponse = {
  id: string;
  nombre: string | null;
  rol: "admin" | "tecnico";
  telefono: string | null;
  estado: string;
  createdAt: string | null;
};

export class AuthRepositoryImpl implements AuthRepository {
  async login(email: string, password: string): Promise<Session> {
    const data = await apiClient.request<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    tokenStorage.set(data.access_token);

    const user = await this.me();

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in,
      tokenType: data.token_type,
      user: {
        id: user.id || data.user.id,
        email: user.email ?? data.user.email ?? null,
        nombre: user.nombre ?? null,
        rol: user.rol ?? "tecnico",
        telefono: user.telefono ?? null,
        estado: user.estado ?? "activo",
      },
    };
  }

  async me(): Promise<User> {
    const [profile, auth] = await Promise.all([
      apiClient.request<ProfileResponse>("/api/account/me"),
      apiClient.request<AuthMeResponse>("/auth/me"),
    ]);

    return {
      id: profile.id || auth.user.sub,
      email: auth.user.email ?? null,
      nombre: profile.nombre,
      rol: profile.rol,
      telefono: profile.telefono,
      estado: profile.estado,
    };
  }

  async logout(): Promise<void> {
    tokenStorage.clear();
  }
}
