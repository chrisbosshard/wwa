"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export type FilterSelectOption = {
  value: string;
  label: string;
};

type FilterSelectProps = {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: FilterSelectOption[];
  allLabel?: string;
  className?: string;
};

export function FilterSelect({
  label,
  value,
  onValueChange,
  options,
  allLabel = "Filter entfernen",
  className,
}: FilterSelectProps) {
  const selectedLabel =
    value === "all" ? "-" : options.find((option) => option.value === value)?.label ?? "-";

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <span className="pl-6 text-sm leading-none text-caritas-grey">{label}</span>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger
          className={cn(
            "h-12 rounded-full border-0 bg-white px-6 text-base font-normal text-caritas-gray-800",
            "shadow-regio-pill transition-shadow hover:shadow-regio-pill-hover",
            "focus:ring-2 focus:ring-caritas-regio-red/15 focus:ring-offset-0",
            "[&>svg]:h-4 [&>svg]:w-4 [&>svg]:text-caritas-grey [&>svg]:opacity-100",
            value === "all" && "[&>span]:text-caritas-grey",
          )}
        >
          <SelectValue>{selectedLabel}</SelectValue>
        </SelectTrigger>
        <SelectContent
          className={cn(
            "overflow-hidden rounded-2xl border-0 bg-white p-1 shadow-regio-pill",
            "text-base text-caritas-gray-800",
          )}
        >
          <SelectItem
            value="all"
            className="rounded-xl py-2.5 pl-5 pr-4 text-caritas-grey focus:bg-caritas-gray-50 focus:text-caritas-gray-800 data-[state=checked]:bg-caritas-gray-50 data-[state=checked]:font-medium [&>span:first-child]:hidden"
          >
            {allLabel}
          </SelectItem>
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="rounded-xl py-2.5 pl-5 pr-4 focus:bg-caritas-gray-50 focus:text-caritas-gray-800 data-[state=checked]:bg-caritas-gray-50 data-[state=checked]:font-medium [&>span:first-child]:hidden"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export const AGE_FILTER_OPTIONS: FilterSelectOption[] = [...Array(14)].map((_, index) => {
  const year = index + 1;
  return {
    value: String(year),
    label: index === 0 ? "Bis 1 Jahr" : `Bis ${year} Jahre`,
  };
});
