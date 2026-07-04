import * as React from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  errors?: {
    [key: string]: {
      message?: string;
      type?: string | number;
    };
  };
  type: string;
  className?: string;
};

export const Error = (props: Props) => {
  const { errors, type, className } = props;
  const cls = twMerge("px-1 text-xs text-red-400", className);
  if (!errors || !errors[type] || !errors[type].message) return null;
  return <p className={cls}>{errors[type].message}</p>;
};
