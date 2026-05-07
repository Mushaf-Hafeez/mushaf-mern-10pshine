import { Outlet } from "react-router-dom"

import { SidebarProvider } from "@/components/ui/sidebar"
import AppSidebar from "@/components/custom/AppSidebar"

const Layout = () => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1">
          {/* <SidebarTrigger /> */}
          <Outlet />
        </div>
      </div>
    </SidebarProvider>
  )
}

export default Layout
