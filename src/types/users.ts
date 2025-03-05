import { z } from 'zod';

export const UserCreateRequestSchema = z.object({
  name: z.string(),
  email: z.string().email(),
});

const UserUpdateRequest = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
});

export const UserUpdateRequestSchema = UserUpdateRequest.superRefine((data, ctx) => {
  if (!data.name && !data.email) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "At least one of 'name' or 'email' is required",
    });
  }
});
