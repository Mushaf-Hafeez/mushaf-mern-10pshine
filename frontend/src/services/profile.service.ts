import { api } from "./axios"

// getProfile function
export const getProfile = async () => {
  const response = await api.get("/profile")
  return response
}

// updateProfile function
export const updateProfile = async (name: string) => {
  const response = await api.put("/profile", { name })
  return response
}

// updateProfile function
export const updateProfilePic = async (
  formData: FormData,
  setProgress: (progress: number) => void
) => {
  const response = await api.put("/profile/profile-pic", formData, {
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total) {
        const percent = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        )
        setProgress(percent)
      }
    },
  })
  return response
}
