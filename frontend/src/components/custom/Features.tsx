import { features } from "../../constants/contant"
import Feature from "./Feature"

const Features = () => {
  return (
    <section className="col-center h-full w-full gap-4 py-10 md:gap-8">
      {/* headings */}
      <h6 className="text-sm font-semibold tracking-[3px] text-primary">
        UNCOMPROMISING TOOLS
      </h6>
      <h2 className="text-center text-3xl font-bold text-foreground md:text-5xl">
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
