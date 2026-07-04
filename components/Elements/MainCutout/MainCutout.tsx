import Breadcrumb, { type BreadcrumbItem } from "@elements/Breadcrumb/Breadcrumb";

type Props = {
  breadcrumbs: BreadcrumbItem[];
  icon?: string;
  children?: React.ReactNode;
};

const MainCutout = ({ breadcrumbs, icon, children }: Props) => {
  return (
    <section className={`main-cutout${icon ? " main-cutout--with-icon" : ""}`}>
      {icon ? (
        <div className="subpage-corner-icon-anchor">
          <div className="main-cutout-inner">
            <img src={`/${icon}`} alt="" className="subpage-corner-icon" aria-hidden="true" />
          </div>
        </div>
      ) : null}
      <div className="main-cutout-inner main-cutout-overlap">
        <Breadcrumb items={breadcrumbs} />
      </div>
      <div className="main-cutout-body">
        <div className="main-cutout-inner">{children}</div>
      </div>
    </section>
  );
};

export default MainCutout;
