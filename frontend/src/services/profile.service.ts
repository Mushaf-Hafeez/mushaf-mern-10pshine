import { api } from "./axios"

// getProfile function
export const getProfile = async () => {
  const response = await api.get("/profile")
  return response
}
