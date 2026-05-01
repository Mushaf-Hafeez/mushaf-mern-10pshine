import { useState } from "react"

// importing shadcn components
import { Button } from "../ui/button"
import { Field, FieldError, FieldLabel } from "../ui/field"
import { Input } from "../ui/input"

import { Link, useNavigate } from "react-router-dom"
import { Eye, EyeClosed } from "lucide-react"
import { useForm } from "react-hook-form"
import type { SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import Spinner from "./Spinner"

import { login } from "@/services/auth.service"
import { useUser } from "@/zustand/useUser"

const loginSchema = z.object({
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
})

type LoginData = z.infer<typeof loginSchema>

const Login = () => {
  const setUser = useUser((state) => state.setUser)

  const {
    register,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
    handleSubmit,
    reset,
  } = useForm<LoginData>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
  })
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false)
  const navigate = useNavigate()

  // function to show/hide the password
  const handleShowPassword = () => {
    setIsShowPassword((prev) => !prev)
  }

  const onSubmit: SubmitHandler<LoginData> = async (data) => {
    // remove error first
    clearErrors("root")

    // make the api call to backend
    try {
      const response = await login(data)

      if (response.status === 200) {
        // set the user in the zustand
        setUser(response.data.user)
        // store the token in localStorage
        localStorage.setItem("token", response.data.token)
        navigate("/") // after creating notes page, redirect the user to notes page.
      }

      reset({ email: "", password: "" })
    } catch (error: any) {
      console.log("error is: ", error.response.data)
      setError("root", {
        type: "backend",
        message: error.response.data.message || "Something went wrong.",
      })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-12 space-y-6">
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
        <div className="flex w-full justify-between">
          <FieldLabel htmlFor="password">PASSWORD</FieldLabel>
          <Link
            to={"/"}
            className="text-xs text-primary/60 transition-all duration-200 hover:text-primary"
          >
            FORGOT PASSWORD?
          </Link>
        </div>
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
      {errors.root && <FieldError>{errors.root.message}</FieldError>}
      <Button
        type="submit"
        className="w-full cursor-pointer p-4"
        disabled={isSubmitting}
      >
        {isSubmitting ? <Spinner /> : "Login"}
      </Button>

      <p className="text-center text-xs">
        By continuing, you agree to NoteFlow's <u>Terms of Service</u> and{" "}
        <u>Privacy Policy</u>.
      </p>
    </form>
  )
}

export default Login
