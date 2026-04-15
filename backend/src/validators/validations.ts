import z from "zod";

export const emailValidation = z.object({
  email: z
    .string()
    .trim()
    .nonempty("Email is required.")
    .email("Invalid email."),
});
