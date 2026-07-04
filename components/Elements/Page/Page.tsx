// IMPORT BASICS
import React, { useContext } from "react";

// IMPORT COMPONENTS
import Link from "next/link";

// IMPORT CUSTOM COMPONENTS
import Hero from "@sections/Hero/Hero";

// TYPE
type Props = {
  children: React.ReactNode;
  title: string;
  image: string;
};

// *****************************************************
// ANMELDEN
// *****************************************************
const Register = (props: Props) => {
  // PROPS
  const { children, title, image } = props;

  // RENDER
  return (
    <div className="flex flex-col items-center">
      <Hero />
      <div className="mx-8 grid w-full max-w-[1200px] grid-cols-12 p-4">
        <div className="relative col-span-12 sm:col-span-3">
          <img src={image} className="mx-auto mb-12 aspect-square h-auto w-4/5" alt="icon" />
        </div>
        <div className="relative col-span-12 flex flex-col items-center sm:col-span-9">
          <div className="relative mb-12 flex w-full flex-row items-center">
            <h1>{title}</h1>
            <div className="ml-8 hidden cursor-pointer rounded-3xl border-2 border-gold-300 px-4 py-2 text-sm font-bold text-gold-300 hover:bg-gold-300 hover:text-darkblue-300 lg:block">
              <Link className="link" href="/" passHref>
                Zurück
              </Link>
            </div>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Register;
