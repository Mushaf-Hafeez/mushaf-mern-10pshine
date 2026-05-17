import axios from "axios"

import { logger } from "../lib/logger"
import { sanitizeLogData } from "../lib/sanitizeLog"

export const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  logger.info(
    {
      method: config.method,
      url: config.url,
      data: sanitizeLogData(config.data),
      headers: sanitizeLogData(config.headers),
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
        data: sanitizeLogData(response.data),
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
        url: error.config?.url,
        data: sanitizeLogData(error.response?.data),
      },
      "API Error"
    )

    return Promise.reject(error)
  }
)

export default api
