import { api } from "./axios"

// function to get the note from the backend
export const getNotes = async () => {
  const response = await api.get("/notes")
  return response
}
