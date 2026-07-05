"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  innerLink?: string;
  externalLink?: string;
  color?: string;
  size?: string;
};

export const Button = (props: Props) => {
  const {
    className,
    children = "",
    onClick = null,
    innerLink,
    externalLink,
    color = "primary",
    size = "normal",
    ...rest
  } = props;

  const handleClick = () => {
    if (onClick) onClick();
  };

  const clsStyle =
    "mx-4 inline-flex cursor-pointer rounded-full font-semibold justify-center items-center whitespace-nowrap transition-colors";
  const clsColor =
    color === "outline"
      ? "text-caritas-red border-2 border-caritas-red bg-white hover:bg-caritas-red hover:text-white"
      : color === "darkblue"
        ? "text-white bg-caritas-gray-800 border-2 border-caritas-gray-800 hover:bg-caritas-gray-700"
        : "text-white bg-caritas-red border-2 border-caritas-red hover:bg-caritas-red-dark hover:border-caritas-red-dark";
  const clsSize = size === "normal" ? "py-3 px-8 text-base" : "py-2 px-4 text-sm";
  const clsDisabled =
    "disabled:cursor-not-allowed disabled:border-[#d0d0d0] disabled:bg-[#d0d0d0] disabled:text-white disabled:hover:border-[#d0d0d0] disabled:hover:bg-[#d0d0d0] disabled:hover:text-white";
  const cls = cn(clsStyle, clsColor, clsSize, clsDisabled, className);

  return (
    <>
      {innerLink && (
        <Link href={innerLink} onClick={onClick ? () => handleClick() : undefined} className={cls}>
          {children}
        </Link>
      )}
      {externalLink && (
        <a href={externalLink} onClick={onClick ? () => handleClick() : undefined} className={cls} target="_blank" rel="noreferrer">
          {children}
        </a>
      )}
      {!innerLink && !externalLink && (
        <button
          {...rest}
          type={rest.type ?? "button"}
          onClick={onClick ? () => handleClick() : undefined}
          className={cls}
        >
          {children}
        </button>
      )}
    </>
  );
};
