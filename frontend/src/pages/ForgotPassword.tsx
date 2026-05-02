import { useState } from "react"

import { ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import type { SubmitHandler } from "react-hook-form"

import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldError } from "@/components/ui/field"
import Spinner from "@/components/custom/Spinner"

import { forgotPassword } from "@/services/auth.service"

const emailSchema = z.object({
  email: z
    .string()
    .trim()
    .nonempty("Email is required.")
    .email("Invalid email."),
})

type EmailData = z.infer<typeof emailSchema>

const ForgotPassword = () => {
  const [isLinkSend, setIsLinkSend] = useState<boolean>(false)
  const {
    register,
    setError,
    clearErrors,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<EmailData>({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(emailSchema),
  })
  const navigate = useNavigate()

  // function to redirect the user to previous page
  const hanldeGoBack = () => {
    navigate(-1)
  }

  const onSubmit: SubmitHandler<EmailData> = async (data) => {
    // remove error first
    clearErrors("root")
    setIsLinkSend(false)

    try {
      const response = await forgotPassword(data.email)

      if (response.status === 200) {
        setIsLinkSend(true)
        reset({ email: "" })
      }
    } catch (error: any) {
      console.log("error is: ", error)
      setError("root", {
        type: "backend",
        message: error.response.data.message || "Something went wrong.",
      })
    }
  }

  return (
    <section className="relative h-screen w-full overflow-hidden bg-neutral-900 text-white">
      {/* left gradient */}
      <span className="absolute -top-10 -left-20 z-1 h-96 w-1/2 rounded-full bg-primary/10 blur-3xl md:-left-60 md:h-screen"></span>
      {/* right gradient */}
      <span className="absolute top-100 -right-20 z-2 h-96 w-1/2 rounded-full bg-foreground/30 blur-3xl md:-right-60 md:h-screen"></span>

      {/*  OTPVerification container */}
      <div className="absolute top-1/2 left-1/2 z-5 h-fit w-10/12 max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-neutral-800/30 p-6 outline outline-neutral-800 backdrop-blur-md md:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="col-center gap-4">
          {/* Heading */}
          <h2 className="text-center text-2xl font-semibold">
            Forgot Password
          </h2>
          <p>Enter your email address</p>

          <Field>
            <Input
              {...register("email")}
              id="email"
              aria-invalid={errors.email ? true : false}
              type="email"
              placeholder={"Enter your email"}
              className="border border-neutral-700 p-4"
            />
            {errors && errors.email && (
              <FieldError>{errors.email.message}</FieldError>
            )}
            {errors && errors.root && (
              <FieldError>{errors.root.message}</FieldError>
            )}
            {isLinkSend && (
              <FieldError className="text-green-500">
                OTP has been sent to your email.
              </FieldError>
            )}
          </Field>

          <Button
            type="submit"
            className="w-full cursor-pointer p-4"
            disabled={isSubmitting}
          >
            {isSubmitting ? <Spinner /> : "Get reset link"}
          </Button>

          <div className="flex w-full items-center justify-between">
            <span
              onClick={hanldeGoBack}
              className="flex cursor-pointer items-center gap-2 text-sm text-neutral-400 transition-all duration-200 hover:text-white"
            >
              <ArrowLeft size={16} className="cursor-pointer" />
              Go back
            </span>
          </div>
        </form>
      </div>
    </section>
  )
}

export default ForgotPassword
