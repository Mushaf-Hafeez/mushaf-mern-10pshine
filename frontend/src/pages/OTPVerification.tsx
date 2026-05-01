import { useState } from "react"

import { ArrowLeft, RotateCcw } from "lucide-react"
import { useNavigate } from "react-router-dom"

// importing shadcn ui components
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

import { signup } from "@/services/auth.service"

import { useSignup } from "@/zustand/useSignup"

interface OTPData {
  otp: string
}

const OTPVerification = () => {
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
  const navigate = useNavigate()

  const signupData = useSignup((state) => state.data)
  const clearData = useSignup((state) => state.clearData)

  // function to redirect the user to previous page
  const hanldeGoBack = () => {
    navigate(-1)
  }

  //   handleResendOTP function
  const handleResend = () => {
    // get the user's email from the zustand and than call the api to sendOTP
    // validate user's email
    alert("resend otp")
  }

  // onSubmit function
  const onSubmit: SubmitHandler<OTPData> = async (data) => {
    // remove error first
    clearErrors("root")

    const userData = {
      ...signupData,
      otp: data.otp,
    }

    try {
      const response = await signup(userData)

      if (response.status === 201) {
        localStorage.setItem("token", response.data.token)
        clearData() // to clear the data from the zustand
        reset({ otp: "" })
        navigate("/") // redirect the user to notes page when it will be created
      }
    } catch (error: any) {
      console.log("error is: ", error.response.data)
      setError("root", {
        type: "backend",
        message: error.response.data.message || "Something went wrong",
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
            OTP Verification
          </h2>
          <p>Enter the 6-digit ocde sent to your email {signupData.email}</p>

          {/* otp input */}
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
                  <InputOTPSlot
                    index={0}
                    className="h-12 w-12 border border-neutral-700 bg-neutral-800 text-lg text-white"
                  />
                  <InputOTPSlot
                    index={1}
                    className="h-12 w-12 border border-neutral-700 bg-neutral-800 text-lg text-white"
                  />
                  <InputOTPSlot
                    index={2}
                    className="h-12 w-12 border border-neutral-700 bg-neutral-800 text-lg text-white"
                  />
                  <InputOTPSlot
                    index={3}
                    className="h-12 w-12 border border-neutral-700 bg-neutral-800 text-lg text-white"
                  />
                  <InputOTPSlot
                    index={4}
                    className="h-12 w-12 border border-neutral-700 bg-neutral-800 text-lg text-white"
                  />
                  <InputOTPSlot
                    index={5}
                    className="h-12 w-12 border border-neutral-700 bg-neutral-800 text-lg text-white"
                  />
                </InputOTPGroup>
              </InputOTP>
            )}
          />

          {/* errors */}
          {errors.otp && <FieldError>{errors.otp.message}</FieldError>}
          {errors.root && <FieldError>{errors.root.message}</FieldError>}

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
              className="flex cursor-pointer items-center gap-2 text-sm text-neutral-400 transition-all duration-200 hover:text-white"
            >
              <ArrowLeft size={16} className="cursor-pointer" />
              Go back
            </span>
            <span
              onClick={handleResend}
              className="flex cursor-pointer items-center gap-2 text-sm text-neutral-400 transition-all duration-200 hover:text-white"
            >
              <RotateCcw size={16} className="cursor-pointer" />
              Resend OTP
            </span>
          </div>
        </form>
      </div>
    </section>
  )
}

export default OTPVerification
