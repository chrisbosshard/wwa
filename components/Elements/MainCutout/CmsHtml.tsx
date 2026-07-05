import { cn } from "@/lib/utils";

type Props = {
  html: string;
  className?: string;
};

const CmsHtml = ({ html, className }: Props) => {
  if (!html?.trim()) return null;

  return <div className={cn("cms-html", className)} dangerouslySetInnerHTML={{ __html: html }} />;
};

export default CmsHtml;
