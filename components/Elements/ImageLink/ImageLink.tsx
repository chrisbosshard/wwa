import Link from "next/link";

type Props = {
  link: string;
  image1: string;
  image2: string;
  title: string;
  text: string;
};

export const ImageLink = ({ link, image1, image2, title, text }: Props) => {
  return (
    <Link
      href={link}
      className="group flex h-full flex-col rounded-lg border border-gray-200 bg-white p-6 no-underline transition-all duration-200 hover:-translate-y-0.5 hover:border-caritas-red hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
    >
      <div className="mb-4 h-16">
        <img src={image1} className="block max-h-16 w-auto group-hover:hidden" alt="" />
        <img src={image2} className="hidden max-h-16 w-auto group-hover:block" alt="" />
      </div>
      <h3 className="mb-3 text-lg font-bold text-caritas-gray-800">{title}</h3>
      <p className="mb-4 flex-1 text-[0.9375rem] leading-relaxed text-caritas-gray-400">{text}</p>
      <span className="text-sm font-semibold text-caritas-red after:content-['_→']">Mehr erfahren</span>
    </Link>
  );
};
