import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type TextFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  multiline?: boolean;
  className?: string;
  rows?: number;
};

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Field = React.forwardRef<HTMLInputElement, TextFieldProps>(({ className, label, multiline, rows, id, ...props }, ref) => {
  const fieldId = id || label.toLowerCase().replace(/\s+/g, "-");

  if (multiline) {
    return (
      <div className={cn("space-y-2", className)}>
        <Label htmlFor={fieldId}>{label}</Label>
        <textarea
          id={fieldId}
          ref={ref as unknown as React.Ref<HTMLTextAreaElement>}
          rows={rows || 4}
          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          {...(props as unknown as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={fieldId}>{label}</Label>
      <Input id={fieldId} ref={ref} {...props} />
    </div>
  );
});

Field.displayName = "Field";
