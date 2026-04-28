import { PencilLine, ShieldCheck, Search, Sparkles } from "lucide-react"
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
