import dayjs from "dayjs"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useUser } from "@/zustand/useUser"

import { getProfile } from "@/services/profile.service"

import Spinner from "@/components/custom/Spinner"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import type { User } from "./NotesPage"

import { Calendar, LogOut, Mail, Pencil } from "lucide-react"

const ProfilePag = () => {
  const [open, setOpen] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [user, setUser] = useState<User | null>()
  const [error, setError] = useState<string>("")

  const clearUser = useUser((state) => state.clearUser)
  const navigate = useNavigate()

  // logout function
  const handleLogout = () => {
    localStorage.removeItem("token")
    clearUser()
    navigate("/")
  }

  useEffect(() => {
    const fetchProfile = async () => {
      setError("")
      setIsLoading(true)

      try {
        const response = await getProfile()

        if (response.status === 200) {
          setUser(response.data.user)
        }
      } catch (error: any) {
        console.log("error is: ", error)
        setError(error.response?.data?.message || "Something went wrong")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [])

  return (
    <section className="h-screen w-full bg-neutral-900 text-white">
      {/* header */}
      <div className="flex w-full items-center justify-between gap-2 border-b border-neutral-800 px-6 py-4 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <Button
            size={"icon-lg"}
            className="cursor-pointer bg-transparent transition-all duration-200 hover:bg-neutral-800"
            asChild
          >
            <SidebarTrigger />
          </Button>

          <h2 className="text-lg font-medium">Profile</h2>
        </div>
      </div>

      {isLoading ? (
        <Spinner />
      ) : (
        <div className="flex h-[calc(100vh-73px)] items-center justify-center">
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="flex w-full max-w-md flex-col gap-6 rounded-2xl bg-neutral-800/30 p-8 outline outline-neutral-800">
              {/* profile */}
              <div className="flex flex-col items-center gap-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user!.profile_pic} />
                  <AvatarFallback>
                    {user?.name?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <h2 className="text-3xl font-semibold">
                  {user?.name || "Unknown User"}
                </h2>
              </div>

              {/* info */}
              <div className="flex flex-col gap-5 text-neutral-400">
                <div className="flex items-center gap-4 rounded-full bg-neutral-800 px-6 py-3">
                  <Mail size={20} />
                  <p className="text-md">{user!.email}</p>
                </div>
                <div className="flex items-center gap-4 rounded-full bg-neutral-800 px-6 py-3">
                  <Calendar size={20} />
                  <p className="text-md">
                    {dayjs(
                      new Date(user!.createdAt).toLocaleDateString()
                    ).format("MMMM DD, YYYY")}
                  </p>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex items-center gap-4">
                <Link
                  to={"/user/settings"}
                  className="flex-center flex-1 cursor-pointer gap-2 rounded-full bg-neutral-800 py-3 text-center text-neutral-400 transition-all duration-200 hover:text-white"
                >
                  <Pencil size={20} />
                  Edit Profile
                </Link>

                <AlertDialog open={open} onOpenChange={setOpen}>
                  <AlertDialogTrigger asChild>
                    <button className="flex-center flex-1 cursor-pointer gap-2 rounded-full bg-red-400/15 py-3 text-center text-red-300 transition-all duration-200 hover:text-red-400">
                      <LogOut size={20} />
                      Logout
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-neutral-800">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Logout</AlertDialogTitle>
                      <AlertDialogDescription className="text-neutral-400">
                        Are your sure you want to logout?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="border-0 bg-neutral-800">
                      <AlertDialogCancel className="cursor-pointer ring-0 hover:text-white">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleLogout}
                        variant={"destructive"}
                        className="cursor-pointer"
                      >
                        Logout
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  )
}

export default ProfilePag
