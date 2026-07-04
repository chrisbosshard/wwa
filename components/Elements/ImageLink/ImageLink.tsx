// IMPORT PACKAGES
import Link from "next/link";

// TYPES
type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string;
  link: string;
  image1: string;
  image2: string;
  title: string;
  text: string;
};

// *****************************************************
// IMAGE LINK COMPONENT
// *****************************************************
export const ImageLink = (props: Props) => {
  // PROPS
  const { link, image1, image2, title, text } = props;

  // *****************************************************

  // RENDER
  return (
    <Link href={link} passHref className="group">
      <div className="px-12 mb-4">
        <img src={image1} className="block group-hover:hidden" alt="icon" />
        <img src={image2} className="hidden group-hover:block" alt="icon" />
      </div>
      <p className="text-lg text-white font-bold mb-4">{title}</p>
      <p className="text-gold-300 leading-snug">{text}</p>
    </Link>
  );
};
