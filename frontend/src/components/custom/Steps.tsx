import { steps } from "@/constants/contant"
import Step from "./Step"

const Steps = () => {
  return (
    <section className="flex-center h-full w-full px-4 py-10">
      <div className="mx-auto col-center w-5xl gap-10 rounded-2xl bg-secondary/30 px-8 py-10 outline outline-border backdrop-blur-md md:py-20">
        <h2 className="text-center text-xl font-bold text-foreground md:text-3xl">
          Three steps to mastery
        </h2>
        <div className="space-y-6 md:flex-center">
          {steps.map((step) => (
            <Step
              key={step.id}
              step={step.step}
              title={step.title}
              description={step.description}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Steps
