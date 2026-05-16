import dayjs from "dayjs"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useUser } from "@/zustand/useUser"
import { logger } from "@/lib/logger"

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
import { logout } from "@/services/auth.service"

const ProfilePag = () => {
  const [open, setOpen] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false)
  const [user, setUser] = useState<User | null>()
  const [error, setError] = useState<string>("")

  const clearUser = useUser((state) => state.clearUser)
  const navigate = useNavigate()

  // logout function
  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      const response = await logout()

      if (response.status === 200) {
        logger.info({ userId: user?._id }, "User logged out successfully")
        clearUser()
        navigate("/")
      }
    } catch (error: any) {
      logger.error({ error: error.message }, "Logout failed")
    } finally {
      setIsLoggingOut(false)
    }
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
        logger.error({ error: error.message }, "Failed to fetch profile")
        setError(error.response?.data?.message || "Something went wrong")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [])

  return (
    <section className="min-h-screen w-full bg-neutral-900 text-white">
      {/* header */}
      <div className="flex w-full items-center justify-between gap-2 border-b border-neutral-800 px-4 py-3 backdrop-blur-sm sm:px-6 sm:py-4">
        <div className="flex items-center gap-2">
          <Button
            size={"icon-lg"}
            className="cursor-pointer bg-transparent transition-all duration-200 hover:bg-neutral-800"
            asChild
          >
            <SidebarTrigger />
          </Button>

          <h2 className="text-base font-medium sm:text-lg">Profile</h2>
        </div>
      </div>

      {isLoading ? (
        <Spinner />
      ) : (
        <div className="flex min-h-[calc(100vh-73px)] items-center justify-center px-4 py-6 sm:px-6">
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="flex w-full max-w-md flex-col gap-4 rounded-2xl bg-neutral-800/30 p-4 outline outline-neutral-800 sm:gap-6 sm:p-8">
              {/* profile */}
              <div className="flex flex-col items-center gap-3 sm:gap-4">
                <Avatar className="h-20 w-20 sm:h-24 sm:w-24">
                  <AvatarImage src={user!.profile_pic} />
                  <AvatarFallback>
                    {user?.name?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <h2 className="text-center text-xl font-semibold sm:text-3xl">
                  {user?.name || "Unknown User"}
                </h2>
              </div>

              {/* info */}
              <div className="flex flex-col gap-3 text-neutral-400 sm:gap-5">
                <div className="flex items-center gap-3 rounded-full bg-neutral-800 px-4 py-2 sm:gap-4 sm:px-6 sm:py-3">
                  <Mail size={18} className="flex-shrink-0 sm:size-5" />
                  <p className="truncate text-sm sm:text-base">{user!.email}</p>
                </div>
                <div className="flex items-center gap-3 rounded-full bg-neutral-800 px-4 py-2 sm:gap-4 sm:px-6 sm:py-3">
                  <Calendar size={18} className="flex-shrink-0 sm:size-5" />
                  <p className="text-sm sm:text-base">
                    {dayjs(
                      new Date(user!.createdAt).toLocaleDateString()
                    ).format("MMMM DD, YYYY")}
                  </p>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                <Link
                  to={"/user/settings"}
                  className="flex-center flex-1 cursor-pointer gap-2 rounded-full bg-neutral-800 py-2 text-center text-xs text-neutral-400 transition-all duration-200 hover:text-white sm:py-3 sm:text-sm"
                >
                  <Pencil size={18} className="sm:size-5" />
                  Edit Profile
                </Link>

                <AlertDialog open={open} onOpenChange={setOpen}>
                  <AlertDialogTrigger asChild>
                    <button className="flex-center flex-1 cursor-pointer gap-2 rounded-full bg-red-400/15 py-2 text-center text-xs text-red-300 transition-all duration-200 hover:text-red-400 sm:py-3 sm:text-sm">
                      <LogOut size={18} className="sm:size-5" />
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
                        className="flex cursor-pointer items-center gap-2"
                        disabled={isLoggingOut}
                      >
                        {isLoggingOut && <Spinner />}
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
