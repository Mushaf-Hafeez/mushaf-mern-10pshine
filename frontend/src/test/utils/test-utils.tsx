import { render, type RenderOptions } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { type ReactElement, type ReactNode } from "react"
import { MemoryRouter, type MemoryRouterProps } from "react-router-dom"

import { ThemeProvider } from "@/components/theme-provider"
import { SidebarProvider } from "@/components/ui/sidebar"

type CustomRenderOptions = Omit<RenderOptions, "wrapper"> & {
  routerProps?: MemoryRouterProps
  withTheme?: boolean
  withSidebar?: boolean
}

function AllProviders({
  children,
  routerProps,
  withTheme = true,
  withSidebar = false,
}: {
  children: ReactNode
  routerProps?: MemoryRouterProps
  withTheme?: boolean
  withSidebar?: boolean
}) {
  let content = children

  if (withSidebar) {
    content = <SidebarProvider>{content}</SidebarProvider>
  }

  if (withTheme) {
    content = (
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme-test">
        {content}
      </ThemeProvider>
    )
  }

  return <MemoryRouter {...routerProps}>{content}</MemoryRouter>
}

function customRender(ui: ReactElement, options: CustomRenderOptions = {}) {
  const {
    routerProps,
    withTheme = true,
    withSidebar = false,
    ...renderOptions
  } = options

  return {
    user: userEvent.setup(),
    ...render(ui, {
      wrapper: ({ children }) => (
        <AllProviders
          routerProps={routerProps}
          withTheme={withTheme}
          withSidebar={withSidebar}
        >
          {children}
        </AllProviders>
      ),
      ...renderOptions,
    }),
  }
}

export * from "@testing-library/react"
export { customRender as render, userEvent }
