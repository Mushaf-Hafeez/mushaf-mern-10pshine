import { useState } from "react"

import { Button } from "../ui/button"
import { Field, FieldError, FieldLabel } from "../ui/field"
import { Input } from "../ui/input"

import { Eye, EyeClosed } from "lucide-react"
import { useForm } from "react-hook-form"
import type { SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import Spinner from "./Spinner"

const signupSchema = z
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
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

type SignupData = z.infer<typeof signupSchema>

const Signup = () => {
  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    reset,
  } = useForm<SignupData>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(signupSchema),
  })
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false)
  const [isShowConfirmPassword, setIsShowConfirmPassword] =
    useState<boolean>(false)

  // function to show/hide the password
  const handleShowPassword = () => {
    setIsShowPassword((prev) => !prev)
  }

  // function to show/hide the confirmPassword
  const handleShowConfirmPassword = () => {
    setIsShowConfirmPassword((prev) => !prev)
  }

  const onSubmit: SubmitHandler<SignupData> = (data) => {
    // make the api call to backend
    console.log(data)
    reset({ name: "", email: "", password: "", confirmPassword: "" })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-12 space-y-6">
      {/* name, email, password, confirmPassword and otp verification. */}

      <Field>
        <FieldLabel htmlFor="name">NAME</FieldLabel>
        <Input
          {...register("name")}
          aria-invalid={errors.name ? true : false}
          id="name"
          type="text"
          placeholder={"Enter your name"}
          className="border border-neutral-700 p-4"
        />
        {errors && errors.name && (
          <FieldError>{errors.name.message}</FieldError>
        )}
      </Field>
      <Field>
        <FieldLabel htmlFor="email">EMAIL ADDRESS</FieldLabel>
        <Input
          {...register("email")}
          aria-invalid={errors.email ? true : false}
          id="email"
          type="email"
          placeholder={"Enter your email"}
          className="border border-neutral-700 p-4"
        />
        {errors && errors.email && (
          <FieldError>{errors.email.message}</FieldError>
        )}
      </Field>
      <Field>
        <FieldLabel htmlFor="password">PASSWORD</FieldLabel>
        <div className="relative flex">
          <Input
            {...register("password")}
            aria-invalid={errors.password ? true : false}
            id="password"
            type={isShowPassword ? "text" : "password"}
            placeholder="Enter your password"
            className="border border-neutral-700 p-4"
          />
          <span
            className="absolute top-1/2 right-4 z-10 -translate-y-1/2 cursor-pointer"
            onClick={handleShowPassword}
          >
            {isShowPassword ? <EyeClosed size={20} /> : <Eye size={20} />}
          </span>
        </div>
        {errors && errors.password && (
          <FieldError>{errors.password.message}</FieldError>
        )}
      </Field>
      <Field>
        <FieldLabel htmlFor="confirmPassword">CONFIRM PASSWORD</FieldLabel>
        <div className="relative flex">
          <Input
            {...register("confirmPassword")}
            aria-invalid={errors.confirmPassword ? true : false}
            id="confirmPassword"
            type={isShowConfirmPassword ? "text" : "password"}
            placeholder="Enter your password again"
            className="border border-neutral-700 p-4"
          />
          <span
            className="absolute top-1/2 right-4 z-10 -translate-y-1/2 cursor-pointer"
            onClick={handleShowConfirmPassword}
          >
            {isShowConfirmPassword ? (
              <EyeClosed size={20} />
            ) : (
              <Eye size={20} />
            )}
          </span>
        </div>
        {errors && errors.confirmPassword && (
          <FieldError>{errors.confirmPassword.message}</FieldError>
        )}
      </Field>
      <Button
        type="submit"
        className="w-full cursor-pointer p-4"
        disabled={isSubmitting}
      >
        {isSubmitting ? <Spinner /> : "Create your Account"}
      </Button>

      <p className="text-center text-xs">
        By continuing, you agree to NoteFlow's <u>Terms of Service</u> and{" "}
        <u>Privacy Policy</u>.
      </p>
    </form>
  )
}

export default Signup
