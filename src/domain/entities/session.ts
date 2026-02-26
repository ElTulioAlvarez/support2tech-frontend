import type { User } from "./user";

export type Session = {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
  tokenType?: string;
  user: User;
};