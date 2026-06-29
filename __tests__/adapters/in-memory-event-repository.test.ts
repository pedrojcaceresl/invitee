import { InMemoryEventRepository } from "@/lib/adapters/in-memory/in-memory-event-repository";
import { runEventRepositoryContractTests } from "@/__tests__/contracts/event-repository.contract";

runEventRepositoryContractTests(() => new InMemoryEventRepository());
