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

    // 🔑 Tras login, carga perfil (rol) para decidir navegación y permisos.
    // Si el perfil no existe, el backend responderá 403.
    const profile = await this.me();

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in,
      tokenType: data.token_type,
      user: {
        id: data.user.id,
        email: data.user.email,
        nombre: profile.nombre ?? null,
        rol: profile.rol ?? "tecnico",
        telefono: profile.telefono ?? null,
        estado: profile.estado ?? "activo",
      },
    };
  }

  async me(): Promise<User> {
    // Perfil completo (incluye rol). Requiere bearer token.
    const p = await apiClient.request<ProfileResponse>("/api/account/me");
    return {
      id: p.id,
      nombre: p.nombre,
      rol: p.rol,
      telefono: p.telefono,
      estado: p.estado,
    };
  }

  async logout(): Promise<void> {
    tokenStorage.clear();
  }
}