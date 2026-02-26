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

type MeResponse = {
  user: { sub: string; email?: string | null };
};

export class AuthRepositoryImpl implements AuthRepository {
  async login(email: string, password: string): Promise<Session> {
    const data = await apiClient.request<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    tokenStorage.set(data.access_token);

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in,
      tokenType: data.token_type,
      user: { id: data.user.id, email: data.user.email },
    };
  }

  async me(): Promise<User> {
    const data = await apiClient.request<MeResponse>("/auth/me");
    return { id: data.user.sub, email: data.user.email };
  }

  async logout(): Promise<void> {
    tokenStorage.clear();
  }
}