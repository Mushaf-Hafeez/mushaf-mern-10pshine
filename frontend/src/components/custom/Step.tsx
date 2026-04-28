import type { StepItem } from "@/constants/contant"

type StepProps = Omit<StepItem, "id">

const Step = ({ step, title, description }: StepProps) => {
  return (
    <div className="group col-center gap-2">
      <div className="flex-center rounded-full bg-neutral-800/30 px-6 py-5 text-center font-semibold text-primary outline outline-primary group-hover:scale-105 group-hover:bg-primary/10 group-hover:transition-all group-hover:duration-300">
        {step}
      </div>
      <h3 className="text-md font-semibold md:text-lg">{title}</h3>
      <p className="text-center">{description}</p>
    </div>
  )
}

export default Step
