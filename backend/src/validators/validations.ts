import mongoose from "mongoose";
import z from "zod";

export const emailValidation = z.object({
  email: z
    .string()
    .trim()
    .nonempty("Email is required.")
    .email("Invalid email."),
});

export const createUserValidation = z
  .object({
    name: z
      .string({
        error: (iss) =>
          iss.input === undefined ? "Name is required." : "Name is required.",
      })
      .trim()
      .min(1, { error: "Name is required." })
      .min(6, { error: "Name must contain at least 6 characters." })
      .max(25, { error: "Name cannot contain more than 25 characters." }),

    email: z
      .string({
        error: (iss) =>
          iss.input === undefined ? "Email is required." : "Invalid email.",
      })
      .trim()
      .min(1, { error: "Email is required." })
      .email({ error: "Invalid email." }),

    password: z
      .string({
        error: (iss) =>
          iss.input === undefined
            ? "Password is required."
            : "Invalid password.",
      })
      .min(8, { error: "Password must be at least 8 characters" })
      .max(100, { error: "Password is too long" })
      .regex(/[a-z]/, { error: "Must contain at least one lowercase letter" })
      .regex(/[A-Z]/, { error: "Must contain at least one uppercase letter" })
      .regex(/[0-9]/, { error: "Must contain at least one number" })
      .regex(/[^a-zA-Z0-9]/, {
        error: "Must contain at least one special character",
      }),

    confirmPassword: z
      .string({
        error: (iss) =>
          iss.input === undefined
            ? "Please confirm your password"
            : "Please confirm your password",
      })
      .min(1, { error: "Please confirm your password" }),

    otp: z
      .string({
        error: (iss) =>
          iss.input === undefined ? "OTP is required" : "OTP is required",
      })
      .min(1, { error: "OTP is required" })
      .length(6, { error: "OTP must be exactly 6 digits" })
      .regex(/^\d+$/, { error: "OTP must only contain numbers" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const loginValidation = z.object({
  email: z
    .string({
      error: (iss) =>
        iss.input === undefined ? "Email is required." : "Invalid email.",
    })
    .trim()
    .min(1, { error: "Email is required." })
    .email({ error: "Invalid email." }),
  password: z
    .string({
      error: (iss) =>
        iss.input === undefined ? "Password is required." : "Invalid password.",
    })
    .min(8, { error: "Password must be at least 8 characters" })
    .max(100, { error: "Password is too long" })
    .regex(/[a-z]/, { error: "Must contain at least one lowercase letter" })
    .regex(/[A-Z]/, { error: "Must contain at least one uppercase letter" })
    .regex(/[0-9]/, { error: "Must contain at least one number" })
    .regex(/[^a-zA-Z0-9]/, {
      error: "Must contain at least one special character",
    }),
});

export const resetPasswordValidation = z
  .object({
    reset_password_token: z.uuid({
      error: (iss) =>
        iss.input === undefined ? "token is required" : "invalid token",
    }),
    password: z
      .string({
        error: (iss) =>
          iss.input === undefined
            ? "Password is required."
            : "Invalid password.",
      })
      .min(8, { error: "Password must be at least 8 characters" })
      .max(100, { error: "Password is too long" })
      .regex(/[a-z]/, { error: "Must contain at least one lowercase letter" })
      .regex(/[A-Z]/, { error: "Must contain at least one uppercase letter" })
      .regex(/[0-9]/, { error: "Must contain at least one number" })
      .regex(/[^a-zA-Z0-9]/, {
        error: "Must contain at least one special character",
      }),

    confirmPassword: z
      .string({
        error: (iss) =>
          iss.input === undefined
            ? "Please confirm your password"
            : "Please confirm your password",
      })
      .min(1, { error: "Please confirm your password" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const noteIdValidation = z.object({
  id: z
    .string()
    .min(1, "ID is required")
    .refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: "Invalid MongoDB ObjectId",
    }),
});

export const createNoteValidation = z.object({
  content: z
    .string({
      error: (iss) =>
        iss.input === undefined ? "Content is required." : "Invalid content.",
    })
    .trim()
    .min(1, { error: "Content cannot be empty." }),
});

export const updateNoteValidation = createNoteValidation;
