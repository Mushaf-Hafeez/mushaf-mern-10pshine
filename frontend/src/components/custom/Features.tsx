import { features } from "../../constants/contant"
import Feature from "./Feature"

const Features = () => {
  return (
    <section className="col-center h-screen w-full gap-8 border border-green-500 py-10">
      {/* headings */}
      <h6 className="text-sm font-semibold tracking-[3px] text-purple-300">
        UNCOMPROMISING TOOLS
      </h6>
      <h2 className="text-center text-5xl font-bold text-neutral-200">
        Engineered for Clarity
      </h2>

      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 p-4 md:grid-cols-2">
        {features.map((feature) => (
          <Feature
            key={feature.id}
            title={feature.title}
            icon={feature.icon}
            description={feature.description}
          />
        ))}
      </div>
    </section>
  )
}

export default Features
