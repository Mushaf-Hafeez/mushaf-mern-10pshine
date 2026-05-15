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
    <Sidebar className="border-none text-white shadow shadow-neutral-800">
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
                  `flex items-center gap-2 rounded-full px-4 py-2 text-neutral-400 transition-all duration-200 hover:bg-neutral-800 hover:text-white ${isActive && "bg-primary text-white hover:bg-primary"}`
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
        <div className="flex w-full items-center gap-4 rounded-lg bg-neutral-800/30 p-4 outline outline-neutral-800">
          <Avatar>
            <AvatarImage className="bg-neutral-900" src={user?.profile_pic} />
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
