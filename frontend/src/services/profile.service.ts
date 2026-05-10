import { api } from "./axios"

// getProfile function
export const getProfile = async () => {
  const response = await api.get("/profile")
  return response
}

// updateProfile function
export const updateProfile = async (formData: FormData) => {
  const response = await api.put("/profile", formData)
  return response
}
