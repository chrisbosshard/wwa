import { cn } from "@/lib/utils";

type Props = {
  html: string;
  className?: string;
};

function normalizeLegacyCmsColors(html: string) {
  return html
    .replace(/color:\s*#f8eac5/gi, "color: #444444")
    .replace(/color:\s*#F8EAC5/gi, "color: #444444")
    .replace(/color:\s*rgb\(\s*248\s*,\s*234\s*,\s*197\s*\)/gi, "color: #444444")
    .replace(/\btext-gold-300\b/g, "");
}

const CmsHtml = ({ html, className }: Props) => {
  if (!html?.trim()) return null;

  return (
    <div
      className={cn("cms-html", className)}
      dangerouslySetInnerHTML={{ __html: normalizeLegacyCmsColors(html) }}
    />
  );
};

export default CmsHtml;
