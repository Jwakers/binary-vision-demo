import { QRA_STEPS, QRAStep } from "@/constants";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { Fragment } from "react/jsx-runtime";

export default function ProgressIndicator({
  activeStep,
}: {
  activeStep: QRAStep | null;
}) {
  const steps = Object.entries(QRA_STEPS);

  return (
    <div className="bg-background text-foreground inline-flex justify-center rounded-[20px] px-8 py-5 shadow-xl">
      <ol className="flex w-auto gap-12.5 font-bold">
        {steps.map(([step, label], index) => (
          <Fragment key={step}>
            <li className="relative" data-animate>
              <span>{label}</span>
              <div
                aria-hidden
                className={cn(
                  "bg-accent absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 transition-transform duration-700 ease-in-out",
                  activeStep === step && "scale-x-100"
                )}
              />
            </li>
            {index < steps.length - 1 && <ArrowRight data-animate />}
          </Fragment>
        ))}
      </ol>
    </div>
  );
}
