import React from "react";
import Hero from "@sections/Hero/Hero";
import MainCutout from "@elements/MainCutout/MainCutout";
import type { BreadcrumbItem } from "@elements/Breadcrumb/Breadcrumb";

type Props = {
  children: React.ReactNode;
  title: string;
  breadcrumbs?: BreadcrumbItem[];
};

const Page = ({ children, title, breadcrumbs }: Props) => {
  const items: BreadcrumbItem[] = breadcrumbs ?? [{ label: title }];

  return (
    <>
      <Hero withCutout />
      <MainCutout breadcrumbs={items}>
        <h1 className="mb-6 font-sans text-[2rem] font-bold leading-tight text-[#242424] md:mb-8 md:text-[2.5rem] md:leading-[1.15]">
          {title}
        </h1>
        {children}
      </MainCutout>
    </>
  );
};

export default Page;
