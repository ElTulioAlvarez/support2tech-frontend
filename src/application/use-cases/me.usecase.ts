import type { AuthRepository } from "../../domain/repositories/auth.repository";

export class MeUseCase {
  private readonly repo: AuthRepository;

  constructor(repo: AuthRepository) {
    this.repo = repo;
  }

  execute() {
    return this.repo.me();
  }
}
