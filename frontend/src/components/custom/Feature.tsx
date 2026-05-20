import type { FeatureItem } from "@/constants/contant"

type FeatureProps = Omit<FeatureItem, "id">

const Feature = ({ icon: Icon, title, description }: FeatureProps) => {
  return (
    <div className="space-y-4 rounded-2xl bg-secondary/30 p-8 outline outline-border backdrop-blur-md transition-all duration-300 hover:bg-secondary/25">
      <Icon className="text-primary" size={32} />
      <h3 className="text-xl font-bold md:text-2xl">{title}</h3>
      <p>{description}</p>
    </div>
  )
}

export default Feature
