import { create } from "zustand"

interface User {
  _id: string
  name: string
  email: string
  profile_pic: string
  createdAt: string
  updatedAt: string
  __v: number
}

interface UserState {
  user: User | null
  setUser: (newUser: User) => void
  clearUser: () => void
}

export const useUser = create<UserState>((set) => ({
  user: null,
  setUser: (newUser) => {
    set(() => ({
      user: newUser,
    }))
  },
  clearUser: () => {
    set(() => ({
      user: null,
    }))
  },
}))
