import React from "react";
import { cn } from "@/lib/utils";

type Props = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: React.ReactNode;
  ref?: React.Ref<HTMLInputElement>;
};

export function CheckboxField({ label, className, id, ref, ...props }: Props) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "group flex cursor-pointer items-start gap-3 text-base leading-normal text-[#575656]",
        className,
      )}
    >
      <input type="checkbox" id={id} ref={ref} className="sr-only" {...props} />
      <span
        aria-hidden
        className={cn(
          "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded border-2 transition-colors",
          "border-[#C5C8C8] bg-white group-has-[:checked]:border-caritas-red group-has-[:checked]:bg-caritas-red",
        )}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className="h-3.5 w-3.5 scale-0 text-white transition-transform group-has-[:checked]:scale-100"
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </span>
      <span>{label}</span>
    </label>
  );
}
