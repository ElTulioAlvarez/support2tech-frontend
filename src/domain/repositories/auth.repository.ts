import type { Session } from "../entities/session";
import type { User } from "../entities/user";

export interface AuthRepository {
  login(email: string, password: string): Promise<Session>;
  me(): Promise<User>;
  logout(): Promise<void>;
}