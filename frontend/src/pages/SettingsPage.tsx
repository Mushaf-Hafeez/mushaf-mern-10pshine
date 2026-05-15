import DeleteAccount from "@/components/custom/DeleteAccount"
import Spinner from "@/components/custom/Spinner"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { updateProfile } from "@/services/profile.service"
import { useUser } from "@/zustand/useUser"
import { zodResolver } from "@hookform/resolvers/zod"
import { UploadCloud } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { useNavigate } from "react-router-dom"

import { z } from "zod"

const updateProfileSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(6, {
        message: "Name must contain at least 6 characters.",
      })
      .max(25, {
        message: "Name cannot contain more than 25 characters.",
      })
      .optional()
      .or(z.literal("")),

    image: z
      .any()
      .optional()
      .refine((files) => {
        if (!files?.length) return true

        return files[0]?.type.startsWith("image/")
      }, "Only image files are allowed")
      .refine((files) => {
        if (!files?.length) return true

        return files[0]?.size <= 2 * 1024 * 1024
      }, "Image size must be less than 2MB"),
  })
  .refine((data) => data.name || data.image?.length, {
    message: "Provide a name or a profile picture to update.",
    path: ["root"],
  })

type FormValues = z.infer<typeof updateProfileSchema>

const SettingsPage = () => {
  const user = useUser((state) => state.user)
  const setUser = useUser((state) => state.setUser)

  const [preview, setPreview] = useState<string | null>(
    user?.profile_pic || null
  )

  const {
    clearErrors,
    setError,
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      name: user?.name || "",
    },
    resolver: zodResolver(updateProfileSchema),
  })

  const navigate = useNavigate()

  const image = watch("image")

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    clearErrors()

    const formData = new FormData()

    if (data.name?.trim()) {
      formData.append("name", data.name.trim())
    }

    if (data.image?.[0]) {
      formData.append("image", data.image[0])
    }

    try {
      const response = await updateProfile(formData)

      if (response.status === 200) {
        setUser(response.data.user)
        navigate("/user/profile")
      }
    } catch (error: any) {
      console.log("error is: ", error)

      setError("root", {
        type: "backend",
        message: error?.response?.data?.message || "Something went wrong.",
      })
    }
  }

  useEffect(() => {
    if (image?.[0]) {
      const imageUrl = URL.createObjectURL(image[0])

      setPreview(imageUrl)

      return () => {
        URL.revokeObjectURL(imageUrl)
      }
    }
  }, [image])

  return (
    <section className="min-h-screen w-full bg-neutral-900 text-white">
      {/* header */}
      <div className="flex w-full items-center justify-between gap-2 border-b border-neutral-800 px-6 py-4 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <Button
            size={"icon-lg"}
            className="cursor-pointer bg-transparent transition-all duration-200 hover:bg-neutral-800"
            asChild
          >
            <SidebarTrigger />
          </Button>

          <h2 className="text-lg font-medium">Settings</h2>
        </div>
      </div>

      {/* settings */}
      <div className="space-y-6 p-6">
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Account Settings</h2>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="max-w-md space-y-4 rounded-2xl bg-neutral-800/30 p-6 outline outline-neutral-800"
          >
            {/* profile image */}
            <Field>
              <div className="flex-center">
                {preview ? (
                  <Avatar className="size-24">
                    <AvatarImage src={preview} />
                    <AvatarFallback>
                      {user?.name?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <div className="flex-center size-24 rounded-full bg-neutral-700/30">
                    <UploadCloud size={30} className="text-primary" />
                  </div>
                )}
              </div>

              <div>
                <h3 className="mt-2 text-center">Profile picture</h3>

                <p className="text-center text-sm text-neutral-400">
                  Upload profile picture
                </p>
              </div>

              <div className="flex-center">
                <FieldLabel
                  htmlFor="image"
                  className="my-2 w-fit cursor-pointer rounded-full bg-neutral-700/30 px-3 py-2 text-xs transition-all duration-200 hover:bg-neutral-700"
                >
                  Change Picture
                </FieldLabel>
              </div>

              <Input
                {...register("image")}
                id="image"
                type="file"
                className="hidden"
                accept="image/png, image/jpg, image/jpeg"
              />

              {errors.image && (
                <FieldError>{errors.image.message as string}</FieldError>
              )}
            </Field>

            {/* name */}
            <Field>
              <FieldLabel htmlFor="name">Name</FieldLabel>

              <Input
                {...register("name")}
                id="name"
                type="text"
                placeholder="Enter your name"
                className="bg-neutral-700/30! px-3 py-2"
              />

              {errors.name && <FieldError>{errors.name.message}</FieldError>}
            </Field>

            {/* root error */}
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

        {/* security */}
        <div className="w-3xl space-y-6">
          <h2 className="text-xl font-semibold">Account Settings</h2>
          <div className="flex w-full items-center justify-between rounded-2xl bg-neutral-800/30 p-6 outline outline-neutral-800">
            <div>
              <h3 className="font-semibold">Danger Zone</h3>
              <p>Permanently delete your account.</p>
            </div>
            <DeleteAccount />
          </div>
        </div>
      </div>
    </section>
  )
}

export default SettingsPage
