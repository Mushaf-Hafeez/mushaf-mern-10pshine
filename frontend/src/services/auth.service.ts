import { api } from "./axios"

// function to call backend login api
export const login = async (data: { email: string; password: string }) => {
  const response = await api.post("/auth/login", data)
  return response
}
