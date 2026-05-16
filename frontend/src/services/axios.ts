import axios from "axios"
import { logger } from "../lib/logger"

export const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  logger.info(
    {
      method: config.method,
      url: config.url,
      data: config.data,
    },
    "API Request"
  )
  return config
})

api.interceptors.response.use(
  (response) => {
    logger.info(
      {
        status: response.status,
        url: response.config.url,
        data: response.data,
      },
      "API Response"
    )
    return response
  },
  (error) => {
    logger.error(
      {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url,
      },
      "API Error"
    )
  }
)
