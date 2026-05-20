import { useState, useEffect } from "react"

import { ArrowLeft, LoaderCircle, RotateCcw } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { logger } from "@/lib/logger"

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "../components/ui/input-otp"
import { Button } from "@/components/ui/button"
import Spinner from "@/components/custom/Spinner"

import { REGEXP_ONLY_DIGITS } from "input-otp"

import { useForm, Controller } from "react-hook-form"
import type { SubmitHandler } from "react-hook-form"
import { FieldError } from "@/components/ui/field"

import { OTP, signup } from "@/services/auth.service"

import { useUser } from "@/zustand/useUser"

interface OTPData {
  otp: string
}

const OTPVerification = () => {
  const setUser = useUser((state) => state.setUser)
  const navigate = useNavigate()

  const [email, setEmail] = useState<string>("")
  const [isResending, setIsResending] = useState<boolean>(false)

  const {
    setError,
    clearErrors,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<OTPData>({
    defaultValues: {
      otp: "",
    },
  })

  useEffect(() => {
    const storedEmail = localStorage.getItem("otp-email")
    if (!storedEmail) {
      logger.warn({}, "OTP page accessed without email in localStorage")
      navigate("/auth?mode=signup", {
        state: { message: "Please start signup again" },
      })
      return
    }
    setEmail(storedEmail)
  }, [navigate])

  const hanldeGoBack = () => {
    navigate(-1)
  }

  const handleResend = async () => {
    clearErrors("root")
    reset({ otp: "" })

    if (!email) {
      logger.warn({}, "OTP resend attempted without email")
      return setError("root", {
        type: "manual",
        message: "Email is required. Please go to signup page.",
      })
    }

    try {
      setIsResending(true)

      const response = await OTP({
        name: "",
        email,
        password: "",
        confirmPassword: "",
      })

      if (response.status === 200) {
        setError("root", {
          type: "success",
          message: "OTP has been sent to your email.",
        })
      }
    } catch (error: any) {
      logger.error({ error: error.message, email }, "Failed to resend OTP")
      setError("root", {
        type: "backend",
        message: error?.response?.data?.message || "Something went wrong.",
      })
    } finally {
      setIsResending(false)
    }
  }

  const onSubmit: SubmitHandler<OTPData> = async (data) => {
    clearErrors("root")

    if (!email) {
      logger.error({}, "OTP submission attempted without email")
      return setError("root", {
        type: "manual",
        message: "Email is required. Please start signup again.",
      })
    }

    try {
      const response = await signup({
        email,
        otp: data.otp,
      })

      if (response.status === 201) {
        logger.info(
          { userId: response.data.user._id, email: response.data.user.email },
          "User registered successfully"
        )

        setUser(response.data.user)
        localStorage.removeItem("otp-email")
        reset({ otp: "" })
        navigate("/")
      }
    } catch (error: any) {
      logger.error({ error: error.message }, "OTP verification failed")
      setError("root", {
        type: "backend",
        message: "Please signup first.",
      })
    }
  }

  return (
    <section className="relative h-screen w-full overflow-hidden bg-card text-foreground">
      {/* left gradient */}
      <span className="absolute -top-10 -left-20 z-10 h-96 w-1/2 rounded-full bg-primary/10 blur-3xl md:-left-60 md:h-screen" />
      {/* right gradient */}
      <span className="absolute top-100 -right-20 z-2 h-96 w-1/2 rounded-full bg-primary/10 blur-3xl md:-right-60 md:h-screen"></span>

      <div className="absolute top-1/2 left-1/2 z-50 h-fit w-10/12 max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-secondary/30 p-6 outline outline-border backdrop-blur-md md:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="col-center gap-4">
          <h2 className="text-center text-2xl font-semibold text-foreground">
            OTP Verification
          </h2>

          <p className="text-center text-muted-foreground">
            Enter the 6-digit code sent to your email {email}
          </p>

          <Controller
            name="otp"
            control={control}
            rules={{
              required: "OTP is required",
              minLength: {
                value: 6,
                message: "OTP must be 6 digits",
              },
            }}
            render={({ field }) => (
              <InputOTP
                value={field.value}
                onChange={field.onChange}
                maxLength={6}
                pattern={REGEXP_ONLY_DIGITS}
              >
                <InputOTPGroup>
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <InputOTPSlot
                      key={i}
                      index={i}
                      className="h-12 w-12 border border-border bg-card text-lg text-foreground"
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            )}
          />

          {errors.otp && <FieldError>{errors.otp.message}</FieldError>}

          {errors.root && (
            <FieldError
              className={
                errors.root.type === "success"
                  ? "text-success"
                  : "text-destructive"
              }
            >
              {errors.root.message}
            </FieldError>
          )}

          <Button
            type="submit"
            className="w-full cursor-pointer p-4"
            disabled={isSubmitting}
          >
            {isSubmitting ? <Spinner /> : "Verify Account"}
          </Button>

          <div className="flex w-full items-center justify-between">
            <span
              onClick={hanldeGoBack}
              className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground transition-all duration-200 hover:text-foreground"
            >
              <ArrowLeft size={16} />
              Go back
            </span>

            <span
              onClick={handleResend}
              className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground transition-all duration-200 hover:text-foreground"
            >
              {isResending ? (
                <LoaderCircle size={16} className="animate-spin" />
              ) : (
                <RotateCcw size={16} />
              )}
              Resend OTP
            </span>
          </div>
        </form>
      </div>
    </section>
  )
}

export default OTPVerification
