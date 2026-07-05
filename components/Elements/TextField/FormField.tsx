import React from "react";
import { Field } from "@elements/TextField/TextField";
import { Error } from "@elements/TextField/Error";
import { cn } from "@/lib/utils";

type FieldErrors = {
  [key: string]: {
    message?: string;
    type?: string | number;
  };
};

const errorSpaceClass = "min-h-[1.125rem]";

type Props = React.ComponentProps<typeof Field> & {
  name: string;
  errors?: FieldErrors;
  reserveErrorSpace?: boolean;
  ref?: React.Ref<HTMLInputElement>;
};

export function FormField({ name, errors, reserveErrorSpace, className, ref, ...fieldProps }: Props) {
  return (
    <div className={cn("w-full", className)}>
      <Field ref={ref} name={name} id={fieldProps.id ?? name} {...fieldProps} />
      <div className={reserveErrorSpace ? errorSpaceClass : undefined}>
        <Error errors={errors} type={name} />
      </div>
    </div>
  );
}
