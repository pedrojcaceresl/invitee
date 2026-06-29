import { InMemoryGiftRepository } from "@/lib/adapters/in-memory/in-memory-gift-repository";
import { runGiftRepositoryContractTests } from "@/__tests__/contracts/gift-repository.contract";

runGiftRepositoryContractTests(() => new InMemoryGiftRepository());
