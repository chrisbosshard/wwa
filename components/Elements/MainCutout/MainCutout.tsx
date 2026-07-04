import Breadcrumb, { type BreadcrumbItem } from "@elements/Breadcrumb/Breadcrumb";

type Props = {
  breadcrumbs: BreadcrumbItem[];
  icon?: string;
  children?: React.ReactNode;
};

const MainCutout = ({ breadcrumbs, icon, children }: Props) => {
  return (
    <section className="relative z-10 -mt-[16rem]">
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-1/2 top-[7rem] -z-0 -ml-[50vw] w-screen bg-white"
      />

      <div className="relative z-[1] mx-auto max-w-[77rem] px-4 pt-8 md:px-8 md:pt-10">
      {icon ? (
        <div className="pointer-events-none absolute right-8 top-8">
          <div className="relative z-[1] mx-auto flex max-w-[77rem] justify-end px-4 md:px-8">
            <img
              src={`/${icon}`}
              alt=""
              className="aspect-square w-[clamp(4.25rem,9vw,7rem)] object-contain"
              aria-hidden="true"
            />
          </div>
        </div>
      ) : null}
        <Breadcrumb items={breadcrumbs} />
      </div>
      <div className="relative z-[1] pb-10 pt-2 md:pb-12">

        <div className="relative z-[1] mx-auto max-w-[77rem] px-4 md:px-8">
        {children}
        </div>
      </div>
    </section>
  );
};

export default MainCutout;
