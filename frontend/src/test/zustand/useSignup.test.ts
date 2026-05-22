import { afterEach, describe, expect, it } from "vitest"

import { useSignup } from "@/zustand/useSignup"

const signupData = {
  name: "Test User",
  email: "test@test.com",
  password: "Password1!",
  confirmPassword: "Password1!",
}

describe("useSignup store", () => {
  afterEach(() => {
    useSignup.getState().clearData()
  })

  it("has empty initial data", () => {
    expect(useSignup.getState().data).toEqual({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    })
  })

  it("setData updates signup data", () => {
    useSignup.getState().setData(signupData)
    expect(useSignup.getState().data).toEqual(signupData)
  })

  it("clearData resets to empty fields", () => {
    useSignup.getState().setData(signupData)
    useSignup.getState().clearData()
    expect(useSignup.getState().data).toEqual({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    })
  })
})
