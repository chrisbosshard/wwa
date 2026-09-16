import Breadcrumb, { type BreadcrumbItem } from "@elements/Breadcrumb/Breadcrumb";

type Props = {
  breadcrumbs: BreadcrumbItem[];
  children?: React.ReactNode;
};

const MainCutout = ({ breadcrumbs, children }: Props) => {
  return (
    <section className="relative z-10 -mt-[16rem] min-h-[16rem] bg-[linear-gradient(to_bottom,transparent_7rem,white_7rem)]">
      <div className="relative z-[1] mx-auto max-w-[77rem] px-4 pt-8 md:px-8 md:pt-10">
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
