import { api } from "./axios"

// function to call backend login api
export const login = async (data: { email: string; password: string }) => {
  const response = await api.post("/auth/login", data)
  return response
}

// function to call backend sendOTP api
export const OTP = async (email: string) => {
  const response = await api.post("/auth/otp", { email })
  return response
}

// function to call backend signup api
interface UserDate {
  name: string
  email: string
  password: string
  confirmPassword: string
  otp: string
}

export const signup = async (userData: UserDate) => {
  const response = await api.post("/auth/signup", userData)
  return response
}

// function to call backend checkAuth api
export const checkAuth = async () => {
  const response = await api.get("/auth/check-auth")
  return response
}

// function to call backend forgotPassword api
export const forgotPassword = async (email: string) => {
  const response = await api.put("/auth/forgot-password", { email })
  return response
}

// function to call backend resetPassword api
export const resetPassword = async (
  reset_password_token: string,
  password: string,
  confirmPassword: string
) => {
  const response = await api.put("/auth/reset-password", {
    reset_password_token,
    password,
    confirmPassword,
  })
  return response
}

// function to call backend delete account api
export const deleteAccount = async (password: string) => {
  const response = await api.delete("/auth/delete-account", {
    data: {
      password,
    },
  })
  return response
}
