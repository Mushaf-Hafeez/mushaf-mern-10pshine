import {
  PencilLine,
  ShieldCheck,
  Search,
  Sparkles,
  FileText,
  CircleUserRound,
  Settings,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

export interface FeatureItem {
  id: number
  title: string
  description: string
  icon: LucideIcon
}

export const features: FeatureItem[] = [
  {
    id: 1,
    title: "Rich text editing",
    description:
      "Full Markdown support, seamless tables, and code syntax highlighting. Your content looks stunning without effort.",
    icon: PencilLine,
  },
  {
    id: 2,
    title: "Secure notes",
    description:
      "End-to-end encryption by default. Your ideas remain private, protected by enterprise-grade security protocols.",
    icon: ShieldCheck,
  },
  {
    id: 3,
    title: "Fast search",
    description:
      "Instant, deep-indexed retrieval. Find any thought in milliseconds across thousands of entries.",
    icon: Search,
  },
  {
    id: 4,
    title: "Clean UI",
    description:
      'A distractions-free interface that adapts to your rhythm. Experience the "Focus Shroud" where everything but the text fades away.',
    icon: Sparkles,
  },
]

export interface StepItem {
  id: number
  step: string
  title: string
  description: string
}

export const steps: StepItem[] = [
  {
    id: 1,
    step: "01",
    title: "Sign up",
    description:
      "Join the collective in seconds. No complex onboarding required.",
  },
  {
    id: 2,
    step: "02",
    title: "Create notes",
    description:
      "Start typing in our zero-distraction editor. Everything is autosaved.",
  },
  {
    id: 3,
    step: "03",
    title: "Stay organized",
    description:
      "Leverage asymmetric tags and nested collections to find focus.",
  },
]

export interface LinkItem {
  name: string
  href: string
}

// Static link data with no actual navigation
export const productLinks: LinkItem[] = [
  { name: "Features", href: "#" },
  { name: "Security", href: "#" },
  { name: "Releases", href: "#" },
  { name: "Templates", href: "#" },
]

export const companyLinks: LinkItem[] = [
  { name: "About Us", href: "#" },
  { name: "Journal", href: "#" },
  { name: "Contact", href: "#" },
  { name: "Privacy", href: "#" },
]

export const legalLinks: LinkItem[] = [
  { name: "Terms of Service", href: "#" },
  { name: "Privacy Policy", href: "#" },
  { name: "Cookie Settings", href: "#" },
]

export interface SidebarLink {
  title: string
  icon: LucideIcon
  path: string
}

export const sidebarLinks: SidebarLink[] = [
  { title: "Notes", icon: FileText, path: "/user/notes" },
  { title: "Profile", icon: CircleUserRound, path: "/user/profile" },
  { title: "Settings", icon: Settings, path: "/user/settings" },
]
