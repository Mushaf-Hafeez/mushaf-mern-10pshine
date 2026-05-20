import { useState } from "react"

import z from "zod"

import { useNavigate, useParams } from "react-router-dom"
import { logger } from "@/lib/logger"

import { useForm } from "react-hook-form"
import type { SubmitHandler } from "react-hook-form"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Spinner from "@/components/custom/Spinner"
import { zodResolver } from "@hookform/resolvers/zod"
import { resetPassword } from "@/services/auth.service"
import { useUser } from "@/zustand/useUser"
import { Eye, EyeClosed } from "lucide-react"

const resetPasswordSchema = z
  .object({
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

type ResetPasswordData = z.infer<typeof resetPasswordSchema>

const ResetPassword = () => {
  const clearUser = useUser((state) => state.clearUser)

  const {
    register,
    setError,
    clearErrors,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ResetPasswordData>({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(resetPasswordSchema),
  })

  const [isShowPassword, setIsShowPassword] = useState<boolean>(false)
  const [isShowConfirmPassword, setIsShowConfirmPassword] =
    useState<boolean>(false)

  const navigate = useNavigate()
  const { token } = useParams()

  if (!token) {
    logger.warn({}, "Reset password token is missing")
  }

  const handleShowPassword = () => {
    setIsShowPassword((prev) => !prev)
  }

  const handleShowConfirmPassword = () => {
    setIsShowConfirmPassword((prev) => !prev)
  }

  const onSubmit: SubmitHandler<ResetPasswordData> = async (data) => {
    clearErrors("root")

    try {
      const response = await resetPassword(
        token as string,
        data.password,
        data.confirmPassword
      )

      if (response.status === 200) {
        logger.info({}, "Password reset successfully")
        clearUser()
        reset({ password: "", confirmPassword: "" })
        navigate("/auth?mode=login")
      }
    } catch (error: any) {
      logger.error({ error: error.message }, "Password reset failed")
      setError("root", {
        type: "backend",
        message: error?.response?.data?.message || "Something went wrong",
      })
    }
  }

  return (
    <section className="relative h-screen w-full overflow-hidden bg-card text-foreground">
      <span className="absolute -top-10 -left-20 z-10 h-96 w-1/2 rounded-full bg-primary/10 blur-3xl md:-left-60 md:h-screen" />
      <span className="absolute top-100 -right-20 z-20 h-96 w-1/2 rounded-full bg-foreground/20 blur-3xl md:-right-60 md:h-screen" />

      <div className="absolute top-1/2 left-1/2 z-50 h-fit w-10/12 max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-secondary/30 p-6 outline outline-border backdrop-blur-md md:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="col-center gap-4">
          <h2 className="text-center text-2xl font-semibold text-foreground">
            Reset Password
          </h2>

          <p className="text-center text-muted-foreground">
            Change your password
          </p>

          <Field>
            <FieldLabel htmlFor="password">PASSWORD</FieldLabel>

            <div className="relative flex">
              <Input
                {...register("password")}
                id="password"
                aria-invalid={errors.password ? true : false}
                type={isShowPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="border border-border bg-card p-4 text-foreground placeholder:text-muted-foreground"
              />

              <span
                className="absolute top-1/2 right-4 z-10 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-foreground"
                onClick={handleShowPassword}
              >
                {isShowPassword ? <EyeClosed size={20} /> : <Eye size={20} />}
              </span>
            </div>

            {errors.password && (
              <FieldError>{errors.password.message}</FieldError>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="confirmPassword">CONFIRM PASSWORD</FieldLabel>

            <div className="relative flex">
              <Input
                {...register("confirmPassword")}
                id="confirmPassword"
                aria-invalid={errors.confirmPassword ? true : false}
                type={isShowConfirmPassword ? "text" : "password"}
                placeholder="Enter your confirm password"
                className="border border-border bg-card p-4 text-foreground placeholder:text-muted-foreground"
              />

              <span
                className="absolute top-1/2 right-4 z-10 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-foreground"
                onClick={handleShowConfirmPassword}
              >
                {isShowConfirmPassword ? (
                  <EyeClosed size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </span>
            </div>

            {errors.confirmPassword && (
              <FieldError>{errors.confirmPassword.message}</FieldError>
            )}

            {errors.root && <FieldError>{errors.root.message}</FieldError>}
          </Field>

          <Button
            type="submit"
            className="w-full cursor-pointer p-4"
            disabled={isSubmitting}
          >
            {isSubmitting ? <Spinner /> : "Reset password"}
          </Button>
        </form>
      </div>
    </section>
  )
}

export default ResetPassword
