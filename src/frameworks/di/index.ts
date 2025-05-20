import { RepositoryRegistry } from "./repository.register";
import { UseCaseRegistry } from "./usecase.register";

export class DependencyInjection {
    static registerAll(): void {
        UseCaseRegistry.registerUseCases();
        RepositoryRegistry.registerRepositories();
    }
}