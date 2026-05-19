import { Switch } from "@/components/ui/switch"
import { useTheme } from "@/components/theme-provider"

const ModeToggle = () => {
  const { theme, setTheme } = useTheme()

  const isDark = theme === "dark"

  const toggleTheme = (checked: boolean) => {
    setTheme(checked ? "dark" : "light")
  }

  return (
    <div className="flex items-center gap-2">
      <Switch
        checked={isDark}
        onCheckedChange={toggleTheme}
        aria-label="Toggle theme"
      />
    </div>
  )
}

export default ModeToggle
