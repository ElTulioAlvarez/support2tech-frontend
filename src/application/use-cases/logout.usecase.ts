import type { AuthRepository } from "../../domain/repositories/auth.repository";

export class LogoutUseCase {
  constructor(private readonly repo: AuthRepository) {}
  execute() {
    return this.repo.logout();
  }
}