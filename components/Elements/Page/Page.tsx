import React from "react";
import Hero from "@sections/Hero/Hero";
import MainCutout from "@elements/MainCutout/MainCutout";
import type { BreadcrumbItem } from "@elements/Breadcrumb/Breadcrumb";

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
        <h1 className="main-cutout-heading">{title}</h1>
        {children}
      </MainCutout>
    </>
  );
};

export default Page;
