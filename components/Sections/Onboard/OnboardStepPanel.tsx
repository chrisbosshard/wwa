import { cn } from "@/lib/utils";

export const onboardStepTitle = "mb-2 text-xl font-bold text-[#242424] md:text-2xl";
export const onboardStepDescription = "mb-8 text-base leading-relaxed text-[#575656] md:text-[1.0625rem]";
export const onboardFormFields = "flex w-full flex-col gap-4";
export const onboardFormActions = "flex w-full flex-col items-center gap-4 pt-8 md:pt-10";
export const onboardStepNav =
  "mt-8 flex w-full flex-row flex-wrap items-center justify-center gap-4 md:mt-10 md:gap-6";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export function OnboardStepPanel({ children, className }: Props) {
  return (
    <div
      className={cn(
        "w-full rounded-2xl border border-[#EBE9E9] bg-white px-6 py-8 shadow-sm sm:px-8 sm:py-10 md:px-10",
        className,
      )}
    >
      {children}
    </div>
  );
}
