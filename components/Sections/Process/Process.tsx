import { CheckIcon } from "@heroicons/react/24/solid";
import { cn } from "@/lib/utils";

type Props = {
  step: number;
};

const STEPS = [
  "KulturLegi",
  "Kinder hinzufügen",
  "Wünsche auswählen",
  "Familienangaben",
  "Bemerkungen",
];

function normalizeStep(step: number) {
  if (step === 1.5) return 1;
  return Math.ceil(step);
}

function getStepState(stepNumber: number, step: number): "completed" | "current" | "upcoming" {
  const active = normalizeStep(step);
  if (stepNumber < active) return "completed";
  if (stepNumber === active) return "current";
  return "upcoming";
}

export function Process({ step }: Props) {
  const active = normalizeStep(step);
  const lineInset = `calc(100% / ${STEPS.length * 2})`;

  return (
    <nav aria-label="Anmelde-Schritte" className="mb-12 mt-10 md:mb-14 md:mt-12">
      <ol className="grid grid-cols-5 gap-x-1 sm:gap-x-2">
        {STEPS.map((label, index) => {
          const stepNumber = index + 1;
          const state = getStepState(stepNumber, step);

          return (
            <li
              key={label}
              className="flex flex-col items-center justify-end self-end text-center"
              aria-current={state === "current" ? "step" : undefined}
            >
              <span
                className={cn(
                  "text-[0.625rem] font-medium uppercase tracking-wide sm:text-xs",
                  state === "upcoming" ? "text-[#999999]" : "text-[#666666]",
                )}
              >
                Schritt {stepNumber}
              </span>

              <span
                className={cn(
                  "mt-1 line-clamp-2 text-[0.6875rem] font-semibold leading-snug sm:text-xs md:text-sm",
                  state === "current" && "text-[#242424]",
                  state === "completed" && "text-[#333333]",
                  state === "upcoming" && "text-[#999999]",
                )}
              >
                {label}
              </span>

              <span className="sr-only">
                {state === "current" && `(aktuell, Schritt ${active} von ${STEPS.length})`}
                {state === "completed" && "(abgeschlossen)"}
                {state === "upcoming" && "(ausstehend)"}
              </span>
            </li>
          );
        })}
      </ol>

      <div className="relative mt-2 flex w-full items-center justify-between gap-1 sm:mt-2.5 sm:gap-2">
        <div
          aria-hidden
          className="pointer-events-none absolute h-px bg-[#e0e0e0]"
          style={{ left: lineInset, right: lineInset, top: "50%" }}
        />

        {STEPS.map((label, index) => {
          const stepNumber = index + 1;
          const state = getStepState(stepNumber, step);

          return (
            <div key={label} className="relative z-10 flex min-w-0 flex-1 justify-center px-0.5 sm:px-1">
              <span
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 sm:h-8 sm:w-8 md:h-9 md:w-9",
                  state === "current" && "border-caritas-red bg-caritas-red",
                  state === "completed" && "border-[#172b3f] bg-[#172b3f]",
                  state === "upcoming" && "border-[#d0d0d0] bg-white",
                )}
              >
                {state === "completed" && <CheckIcon className="h-3.5 w-3.5 text-white sm:h-4 sm:w-4" aria-hidden />}
                {state === "current" && (
                  <span className="h-2 w-2 rounded-full bg-white sm:h-2.5 sm:w-2.5" aria-hidden />
                )}
              </span>
            </div>
          );
        })}
      </div>
    </nav>
  );
}
