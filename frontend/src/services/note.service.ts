import { api } from "./axios"

// function to get the note from the backend
export const getNotes = async () => {
  const response = await api.get("/notes")
  return response
}

// function to create the note in the backend
export const createNote = async (content: string) => {
  const response = await api.post("/notes", { content })
  return response
}
