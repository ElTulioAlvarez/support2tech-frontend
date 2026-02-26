import type { AuthRepository } from "../../domain/repositories/auth.repository";

export class MeUseCase {
  constructor(private readonly repo: AuthRepository) {}
  execute() {
    return this.repo.me();
  }
}