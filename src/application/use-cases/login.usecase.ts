import type { AuthRepository } from "../../domain/repositories/auth.repository";

export class LoginUseCase {
  private readonly repo: AuthRepository;

  constructor(repo: AuthRepository) {
    this.repo = repo;
  }

  execute(email: string, password: string) {
    return this.repo.login(email, password);
  }
}
