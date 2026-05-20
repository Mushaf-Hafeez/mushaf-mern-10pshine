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
        setError(error?.response?.data?.message || "Something went wrong")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [])

  return (
    <section className="min-h-screen w-full bg-card text-foreground">
      <div className="flex w-full items-center justify-between gap-2 border-b border-border bg-card px-4 py-3 backdrop-blur-sm sm:px-6 sm:py-4">
        <div className="flex items-center gap-2">
          <Button
            size={"icon-lg"}
            className="cursor-pointer bg-transparent text-foreground transition-all duration-200 hover:bg-secondary"
            asChild
          >
            <SidebarTrigger />
          </Button>

          <h2 className="text-base font-medium text-foreground sm:text-lg">
            Profile
          </h2>
        </div>
      </div>

      {isLoading ? (
        <Spinner />
      ) : (
        <div className="flex min-h-[calc(100vh-73px)] items-center justify-center px-4 py-6 sm:px-6">
          {error ? (
            <p className="text-destructive">{error}</p>
          ) : (
            <div className="flex w-full max-w-md flex-col gap-4 rounded-2xl bg-secondary/30 p-4 outline outline-border sm:gap-6 sm:p-8">
              <div className="flex flex-col items-center gap-3 sm:gap-4">
                <Avatar className="h-20 w-20 sm:h-24 sm:w-24">
                  <AvatarImage src={user!.profile_pic} />
                  <AvatarFallback>
                    {user?.name?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <h2 className="text-center text-xl font-semibold text-foreground sm:text-3xl">
                  {user?.name || "Unknown User"}
                </h2>
              </div>

              <div className="flex flex-col gap-3 text-muted-foreground sm:gap-5">
                <div className="flex items-center gap-3 rounded-full bg-secondary px-4 py-2 sm:gap-4 sm:px-6 sm:py-3">
                  <Mail size={18} className="shrink-0 sm:size-5" />
                  <p className="truncate text-sm sm:text-base">{user!.email}</p>
                </div>

                <div className="flex items-center gap-3 rounded-full bg-secondary px-4 py-2 sm:gap-4 sm:px-6 sm:py-3">
                  <Calendar size={18} className="shrink-0 sm:size-5" />
                  <p className="text-sm text-muted-foreground sm:text-base">
                    {dayjs(
                      new Date(user!.createdAt).toLocaleDateString()
                    ).format("MMMM DD, YYYY")}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                <Link
                  to={"/user/settings"}
                  className="flex-center flex-1 cursor-pointer gap-2 rounded-full bg-secondary py-2 text-center text-xs text-muted-foreground transition-all duration-200 hover:text-foreground sm:py-3 sm:text-sm"
                >
                  <Pencil size={18} className="sm:size-5" />
                  Edit Profile
                </Link>

                <AlertDialog open={open} onOpenChange={setOpen}>
                  <AlertDialogTrigger asChild>
                    <button className="flex-center flex-1 cursor-pointer gap-2 rounded-full bg-destructive/15 py-2 text-center text-xs text-destructive transition-all duration-200 hover:text-destructive sm:py-3 sm:text-sm">
                      <LogOut size={18} className="sm:size-5" />
                      Logout
                    </button>
                  </AlertDialogTrigger>

                  <AlertDialogContent className="bg-card text-foreground">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Logout</AlertDialogTitle>
                      <AlertDialogDescription className="text-muted-foreground">
                        Are you sure you want to logout?
                      </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter className="border-0 bg-card">
                      <AlertDialogCancel className="cursor-pointer text-muted-foreground hover:text-foreground">
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
