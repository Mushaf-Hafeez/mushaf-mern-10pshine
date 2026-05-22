import { describe, expect, it, vi } from "vitest"
import { Route, Routes } from "react-router-dom"

import Layout from "@/pages/Layout"
import { render, screen } from "@/test/utils/test-utils"

vi.mock("@/zustand/useUser", () => ({
  useUser: vi.fn((selector) =>
    selector({
      user: {
        _id: "1",
        name: "Test User",
        email: "test@test.com",
        profile_pic: "",
        createdAt: "",
        updatedAt: "",
        __v: 0,
      },
      setUser: vi.fn(),
      clearUser: vi.fn(),
    })
  ),
}))

describe("Layout", () => {
  it("renders sidebar and outlet content", () => {
    render(
      <Routes>
        <Route path="/user" element={<Layout />}>
          <Route index element={<div>Child Page</div>} />
        </Route>
      </Routes>,
      {
        routerProps: { initialEntries: ["/user"] },
        withSidebar: true,
      }
    )

    expect(screen.getByRole("link", { name: /noteflow/i })).toBeInTheDocument()
    expect(screen.getByText("Child Page")).toBeInTheDocument()
  })
})
