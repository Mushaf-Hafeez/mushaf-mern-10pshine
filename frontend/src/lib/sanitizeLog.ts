const sensitiveKeys = [
  "password",
  "confirmPassword",
  "token",
  "accessToken",
  "refreshToken",
  "authorization",
  "otp",
  "cookie",
]

export const sanitizeLogData = (data: any) => {
  if (!data || typeof data !== "object") {
    return data
  }

  const sanitized = { ...data }

  for (const key of sensitiveKeys) {
    if (key in sanitized) {
      sanitized[key] = "[REDACTED]"
    }
  }

  return sanitized
}
