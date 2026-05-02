import { create } from "zustand"

interface Data {
  name: string
  email: string
  password: string
  confirmPassword: string
}

interface SignupState {
  data: Data
  setData: (newData: Data) => void
  clearData: () => void
}

export const useSignup = create<SignupState>((set) => {
  return {
    data: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    setData: (newData) => {
      set(() => ({
        data: newData,
      }))
    },
    clearData: () => {
      set(() => ({
        data: {
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        },
      }))
    },
  }
})
