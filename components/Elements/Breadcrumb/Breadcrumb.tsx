import Link from "next/link";
import { ChevronRightIcon, HomeIcon } from "@heroicons/react/24/outline";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type Props = {
  items: BreadcrumbItem[];
};

const Breadcrumb = ({ items }: Props) => {
  return (
    <nav
      className="relative z-[2] mb-8 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] md:mb-10 [&::-webkit-scrollbar]:hidden"
      aria-label="Breadcrumb"
    >
      <ol className="flex min-h-[30px] items-center whitespace-nowrap text-sm tracking-[0.1rem] text-[#242424] md:text-[0.875rem]">
        <li className="flex items-center">
          <Link
            href="/"
            className="inline-flex h-[30px] w-[30px] items-center justify-center text-[#242424] transition-colors hover:text-caritas-red"
            aria-label="Startseite"
          >
            <HomeIcon className="h-4 w-4" aria-hidden="true" />
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex items-center">
            <ChevronRightIcon className="mx-3 h-4 w-4 shrink-0 text-[#242424]" aria-hidden="true" />
            {item.href ? (
              <Link
                href={item.href}
                className="inline-flex h-[30px] items-center text-[#242424] no-underline transition-colors hover:text-caritas-red hover:underline"
              >
                {item.label}
              </Link>
            ) : (
              <span className="inline-flex h-[30px] items-center pr-8 text-[#242424]" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
