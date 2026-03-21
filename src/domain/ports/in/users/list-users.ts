import type { UserSummary } from "@/domain/entities/user";
import z from "zod";

// request
export const listUsersInputSchema = z.object({
  query: z.string().max(255),
  page: z.int().min(1).optional(),
  limit: z.int().min(1).optional(),
});

export type ListUsersInput = z.infer<typeof listUsersInputSchema>;

// response
export type ListUsersOutput = {
  users: UserSummary[];
};

// use case
export type ListUsersUseCase = {
  listUsers(input: ListUsersInput): Promise<ListUsersOutput>;
};
