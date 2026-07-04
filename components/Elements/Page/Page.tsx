import React from "react";
import Hero from "@sections/Hero/Hero";
import MainCutout from "@elements/MainCutout/MainCutout";
import type { BreadcrumbItem } from "@elements/Breadcrumb/Breadcrumb";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  title: string;
  breadcrumbs?: BreadcrumbItem[];
  image?: string;
};

const Page = ({ children, title, breadcrumbs, image }: Props) => {
  const items: BreadcrumbItem[] = breadcrumbs ?? [{ label: title }];

  return (
    <>
      <Hero withCutout />
      <MainCutout breadcrumbs={items} icon={image}>
        <h1
          className={cn(
            "mb-6 font-sans text-[2rem] font-bold leading-tight text-[#333333] md:mb-8 md:text-[2.5rem] md:leading-[1.15]",
            image && "pr-[clamp(4.5rem,10vw,7.5rem)]",
          )}
        >
          {title}
        </h1>
        {children}
      </MainCutout>
    </>
  );
};

export default Page;
