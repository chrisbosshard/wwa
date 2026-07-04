// IMPORT PACKAGES
import { useState } from "react";
import clsx from "clsx";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { ChevronDoubleRightIcon } from "@heroicons/react/24/outline";

// TYPES
type Props = {
  updateChallenge?: any;
  className?: string;
  color?: string;
  hover?: boolean;
  shadow?: boolean;
  icon?: string;
  placeholder?: string;
  inline?: any;
};

// *************************************************
// Text Field Component
// *************************************************
export const TextFieldChallenge = (props: Props) => {
  // PROPS
  const { updateChallenge, icon, placeholder, inline } = props; // HOC to Challenge
  const className = props.className || "";
  const hover = props.hover || false;
  const shadow = props.shadow || false;
  const color = props.color || "white";

  // STATE
  const [value, setValue] = useState("");

  // FUNCTIONS
  // *************************************************
  // Handle Change
  // *************************************************
  const handleChange = (e: any) => {
    const { value } = e.target;
    setValue(value);
    if (updateChallenge) updateChallenge(value); //updateHOC to update CHallenge
  };

  // *************************************************
  // Handle Key Down
  // *************************************************
  const handleSubmit = (event: any) => {
    event.preventDefault();
    if (inline) inline();
  };

  // CALCULATIONS
  let cls = "rounded-xl p-4 placeholder-gray-300";

  // Shadow
  if (shadow) cls += " shadow-xl";

  // Color
  if (color === "white") cls += " bg-white";
  if (color === "gray") cls += " bg-gray-100";

  // Icon
  if (icon) cls += " pl-14";

  // CLASSES
  cls = clsx(cls, className); // prettier-ignore

  // *************************************************

  // RENDER
  return (
    <div className="relative w-full ">
      {icon === "search" && (
        <MagnifyingGlassIcon
          className="absolute left-4 top-1/2 h-6 w-6 -translate-y-1/2 text-gray-300"
          aria-hidden="true"
        />
      )}
      <form onSubmit={handleSubmit}>
        <input
          className={cls}
          value={value}
          onChange={(e) => handleChange(e)}
          placeholder={placeholder}
        />
        {inline && value !== "" && (
          <div className="absolute right-4 top-1/2 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-primary-300 transition-all duration-300 hover:bg-black">
            <ChevronDoubleRightIcon
              className="h-5 w-5 text-white"
              aria-hidden="true"
              onClick={() => inline()}
            />
          </div>
        )}
      </form>
    </div>
  );
};
