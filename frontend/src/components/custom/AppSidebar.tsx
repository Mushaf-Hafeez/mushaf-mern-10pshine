import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { sidebarLinks } from "@/constants/contant"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Link, NavLink } from "react-router-dom"
import { useUser } from "@/zustand/useUser"

const AppSidebar = () => {
  const user = useUser((state) => state.user)

  return (
    <Sidebar className="border-none text-foreground shadow shadow-border">
      <SidebarHeader>
        <h2 className="cursor-pointer p-4 text-lg font-bold text-primary md:text-2xl">
          <Link to={"/"}>NoteFlow</Link>
        </h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="my-5">
          <nav className="flex flex-col gap-4 px-4">
            {sidebarLinks.map(({ path, icon: Icon, title }, index) => (
              <NavLink
                key={index}
                to={path}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-full px-4 py-2 transition-all duration-200 hover:bg-secondary hover:text-foreground ${
                    isActive
                      ? "bg-primary text-primary-foreground hover:bg-primary"
                      : "text-muted-foreground"
                  }`
                }
              >
                <Icon size={22} />
                {title}
              </NavLink>
            ))}
          </nav>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex w-full items-center gap-4 rounded-lg bg-secondary/30 p-4 outline outline-border">
          <Avatar>
            <AvatarImage className="bg-card" src={user?.profile_pic} />
            <AvatarFallback>{user?.name.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="w-full">
            <h6 className="text-sm font-semibold">{user?.name}</h6>
            <p className="max-w-40 truncate text-xs">{user?.email}</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar
