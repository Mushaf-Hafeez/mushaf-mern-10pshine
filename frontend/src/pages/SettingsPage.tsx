import DeleteAccount from "@/components/custom/DeleteAccount"
import Spinner from "@/components/custom/Spinner"
import { logger } from "@/lib/logger"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { updateProfile, updateProfilePic } from "@/services/profile.service"
import { useUser } from "@/zustand/useUser"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState, type ChangeEvent } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"

import { z } from "zod"
import ModeToggle from "@/components/custom/ModeToggle"

const updateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(6, {
      message: "Name must contain at least 6 characters.",
    })
    .max(25, {
      message: "Name cannot contain more than 25 characters.",
    }),
})

type FormValues = z.infer<typeof updateProfileSchema>

const SettingsPage = () => {
  const user = useUser((state) => state.user)
  const setUser = useUser((state) => state.setUser)

  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [progress, setProgress] = useState<number>(50)

  const {
    clearErrors,
    setError,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      name: user?.name || "",
    },
    resolver: zodResolver(updateProfileSchema),
  })

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return

    setIsUploading(true)

    // create formData
    const formData = new FormData()

    formData.append("image", e.target.files[0])

    try {
      const response = await updateProfilePic(formData, setProgress)

      if (response.status === 200) {
        logger.info(
          { userId: response.data.user._id },
          "Profile pic updated successfully"
        )
        setUser(response.data.user)
      }
    } catch (error: any) {
      logger.error({ error: error.message }, "Failed to update profile pic")
    } finally {
      setIsUploading(false)
    }
  }

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    clearErrors()

    try {
      const response = await updateProfile(data.name)

      if (response.status === 200) {
        logger.info(
          { userId: response.data.user._id },
          "Profile updated successfully"
        )
        setUser(response.data.user)
      }
    } catch (error: any) {
      logger.error({ error: error.message }, "Failed to update profile")

      setError("root", {
        type: "backend",
        message: error?.response?.data?.message || "Something went wrong.",
      })
    }
  }

  return (
    <section className="min-h-screen w-full bg-card text-foreground">
      <div className="flex w-full items-center justify-between gap-2 border-b border-border bg-card px-4 py-3 backdrop-blur-sm sm:px-6 sm:py-4">
        <div className="flex items-center gap-2">
          <Button
            size={"icon-lg"}
            className="cursor-pointer bg-transparent text-foreground transition-all duration-200 hover:bg-secondary"
            asChild
          >
            <SidebarTrigger />
          </Button>

          <h2 className="text-base font-medium text-foreground sm:text-lg">
            Settings
          </h2>
        </div>
      </div>

      <div className="space-y-4 px-4 py-4 sm:space-y-6 sm:px-6 sm:py-6">
        <div className="space-y-4 sm:space-y-6">
          <h2 className="text-lg font-semibold text-foreground sm:text-xl">
            Account Settings
          </h2>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full space-y-3 rounded-2xl bg-secondary/30 p-4 outline outline-border sm:max-w-md sm:space-y-4 sm:p-6"
          >
            <Field>
              <div className="flex-center">
                <Avatar className="size-20 sm:size-24">
                  <AvatarImage src={user?.profile_pic} />
                  <AvatarFallback>
                    {user?.name?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div>
                <h3 className="mt-2 text-center text-sm text-foreground sm:text-base">
                  Profile picture
                </h3>

                <p className="text-center text-xs text-muted-foreground sm:text-sm">
                  Upload profile picture
                </p>
              </div>

              {/* progress bar */}
              {isUploading && (
                <div className="mt-2 col-center gap-2">
                  <div className="w-full">
                    <div
                      style={{
                        width: `${progress}%`,
                      }}
                      className="h-1 rounded-full bg-primary"
                    ></div>
                  </div>
                  <h3 className="font-semibold text-primary">{progress}%</h3>
                </div>
              )}

              <div className="flex-center">
                <FieldLabel
                  htmlFor="image"
                  className="my-2 w-fit cursor-pointer rounded-full bg-secondary px-2 py-1 text-xs text-muted-foreground transition-all duration-200 hover:text-foreground sm:px-3 sm:py-2"
                >
                  Change Picture
                </FieldLabel>
              </div>

              <Input
                id="image"
                type="file"
                className="hidden"
                accept="image/png, image/jpg, image/jpeg"
                onChange={handleFileChange}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="name">Name</FieldLabel>

              <Input
                {...register("name")}
                id="name"
                type="text"
                placeholder="Enter your name"
                className="bg-secondary/30! px-3 py-2 text-foreground placeholder:text-muted-foreground"
              />

              {errors.name && <FieldError>{errors.name.message}</FieldError>}
            </Field>

            {errors.root && <FieldError>{errors.root.message}</FieldError>}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full cursor-pointer items-center gap-2"
            >
              {isSubmitting && <Spinner />}
              Update
            </Button>
          </form>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <h2 className="text-lg font-semibold text-foreground sm:text-xl">
            Theme Preference
          </h2>

          <div className="flex flex-col gap-3 rounded-2xl bg-secondary/30 p-4 outline outline-border sm:gap-4 sm:p-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground sm:text-base">
                Change Theme
              </h3>

              <p className="text-xs text-muted-foreground sm:text-sm">
                Change mode to Light/Dark.
              </p>
            </div>

            <ModeToggle />
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <h2 className="text-lg font-semibold text-foreground sm:text-xl">
            Danger Zone
          </h2>

          <div className="flex flex-col gap-3 rounded-2xl bg-secondary/30 p-4 outline outline-border sm:gap-4 sm:p-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground sm:text-base">
                Delete Account
              </h3>

              <p className="text-xs text-muted-foreground sm:text-sm">
                Permanently delete your account.
              </p>
            </div>

            <DeleteAccount />
          </div>
        </div>
      </div>
    </section>
  )
}

export default SettingsPage
