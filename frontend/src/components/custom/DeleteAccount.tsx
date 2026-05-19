import { useEffect, useState } from "react"

import { logger } from "@/lib/logger"

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Field, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import Spinner from "@/components/custom/Spinner"

import { useUser } from "@/zustand/useUser"
import { zodResolver } from "@hookform/resolvers/zod"

import { useForm, type SubmitHandler } from "react-hook-form"
import { useNavigate } from "react-router-dom"

import { deleteAccount } from "@/services/auth.service"

import { z } from "zod"
import { Button } from "../ui/button"
import { Eye, EyeClosed } from "lucide-react"

const passwordSchema = z.object({
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

type FormValues = z.infer<typeof passwordSchema>

const DeleteAccount = () => {
  const clearUser = useUser((state) => state.clearUser)

  const [isShowPassword, setIsShowPassword] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false)
  const {
    register,
    setError,
    clearErrors,
    handleSubmit,
    formState: { isSubmitting, errors },
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      password: "",
    },
    resolver: zodResolver(passwordSchema),
  })
  const navigate = useNavigate()

  // function to show/hide the password
  const handleShowPassword = () => {
    setIsShowPassword((prev) => !prev)
  }

  // handleDeleteAccount function
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    clearErrors("root")
    try {
      const response = await deleteAccount(data.password)

      if (response.status === 200) {
        logger.info(
          { userId: undefined }, // User ID should be tracked from user context
          "Account deleted successfully"
        )
        reset({ password: "" })
        setOpen(false)
        clearUser()
        navigate("/")
      }
    } catch (error: any) {
      logger.error({ error: error.message }, "Failed to delete account")
      setError("root", {
        type: "backend",
        message: error.response.data.message || "Something went wrong.",
      })
    }
  }

  useEffect(() => {
    if (!open) {
      clearErrors()
      reset({
        password: "",
      })
    }
  }, [open, clearErrors, reset])

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="cursor-pointer">
          Delete account
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-card">
        <form onSubmit={handleSubmit(onSubmit)}>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete account</AlertDialogTitle>
            <AlertDialogDescription>
              <p>
                This action cannot be undone. This will permanently delete your
                account from our servers.
              </p>
              <Field>
                <div className="relative flex">
                  <Input
                    {...register("password")}
                    type={isShowPassword ? "text" : "password"}
                    placeholder="Enter your password..."
                    className="my-2 w-full text-foreground"
                  />
                  <span
                    className="absolute top-1/2 right-4 z-10 -translate-y-1/2 cursor-pointer"
                    onClick={handleShowPassword}
                  >
                    {isShowPassword ? (
                      <EyeClosed size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </span>
                </div>
                {errors && errors.password && (
                  <FieldError>{errors.password.message}</FieldError>
                )}
                {errors && errors.root && (
                  <FieldError>{errors.root.message}</FieldError>
                )}
              </Field>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="border-0 bg-card">
            <AlertDialogCancel className="cursor-pointer ring-0 hover:text-foreground">
              Cancel
            </AlertDialogCancel>
            <Button
              type="submit"
              variant="destructive"
              className="flex cursor-pointer items-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting && <Spinner />}
              Delete account
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteAccount
