import Link from "next/link";
import clsx from "clsx";

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
  const className = props.className || "";
  const children = props.children || "";
  const onClick = props.onClick || null;
  const { innerLink, externalLink } = props;
  const color = props.color || "primary";
  const size = props.size || "normal";

  const handleClick = () => {
    if (onClick) onClick();
  };

  const clsStyle =
    "mx-4 cursor-pointer rounded-md flex font-semibold justify-center items-center sm:auto sm:whitespace-nowrap transition-colors";
  const clsColor =
    color === "outline"
      ? "text-caritas-red border-2 border-caritas-red bg-white hover:bg-caritas-red hover:text-white"
      : color === "darkblue"
        ? "text-white bg-caritas-gray-800 border-2 border-caritas-gray-800 hover:bg-caritas-gray-700"
        : "text-white bg-caritas-red border-2 border-caritas-red hover:bg-caritas-red-dark hover:border-caritas-red-dark";
  const clsSize = size === "normal" ? "py-3 px-8 text-base" : "py-2 px-4 text-sm";
  const cls = clsx(clsStyle, clsColor, clsSize, className);

  return (
    <>
      {innerLink && (
        <Link href={innerLink} onClick={() => handleClick()} className={cls}>
          {children}
        </Link>
      )}
      {externalLink && (
        <a href={externalLink} onClick={() => handleClick()} className={cls} target="_blank" rel="noreferrer">
          {children}
        </a>
      )}
      {!innerLink && !externalLink && (
        <button {...props} onClick={() => handleClick()} className={cls}>
          {children}
        </button>
      )}
    </>
  );
};
