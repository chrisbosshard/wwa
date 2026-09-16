import { cn } from "@/lib/utils";
import { cmsAlphaList } from "@/lib/ui-classes";

type Props = {
  html: string;
  className?: string;
};

function normalizeLegacyCmsColors(html: string) {
  return html
    .replace(/color:\s*#f8eac5/gi, "color: #575656")
    .replace(/color:\s*#F8EAC5/gi, "color: #575656")
    .replace(/color:\s*rgb\(\s*248\s*,\s*234\s*,\s*197\s*\)/gi, "color: #575656")
    .replace(/\btext-gold-300\b/g, "");
}

const pillBadgeSpanRegex =
  /<span([^>]*)>\s*([a-z])\s*<\/span>\s*/gi;

function isPillBadgeSpan(spanAttributes: string) {
  return /border|radius|inline-block|display:\s*block|width:|height:/i.test(spanAttributes);
}

function stripPillBadges(html: string) {
  return html.replace(pillBadgeSpanRegex, (match, attributes) => {
    return isPillBadgeSpan(attributes) ? "" : match;
  });
}

const pillParagraphRegex =
  /<p([^>]*)>\s*<span([^>]*)>\s*([a-z])\s*<\/span>\s*([\s\S]*?)<\/p>/gi;

function stripListItemLayoutClasses(html: string) {
  return html.replace(/<li(\s[^>]*)?>/gi, (match, attributes = "") => {
    if (!attributes) return match;

    const next = attributes
      .replace(/\sstyle="[^"]*display\s*:\s*flex[^"]*"/gi, "")
      .replace(/\b(?:inline-)?flex\b/g, "")
      .replace(/\bgap-[^\s"]+/g, "")
      .replace(/\bitems-[^\s"]+/g, "")
      .replace(/\s+/g, " ")
      .replace(/\sclass="\s*"/gi, "")
      .trimEnd();

    return `<li${next}>`;
  });
}

function normalizeCmsLists(html: string) {
  const withoutInlineBadges = stripListItemLayoutClasses(stripPillBadges(html));

  const pillParagraphs = [...withoutInlineBadges.matchAll(pillParagraphRegex)].filter((match) =>
    isPillBadgeSpan(match[2]),
  );

  if (pillParagraphs.length >= 2) {
    const listItems = pillParagraphs.map((match) => `<li>${match[4].trim()}</li>`).join("");
    const listHtml = `<ol class="${cmsAlphaList}">${listItems}</ol>`;

    const firstStart = pillParagraphs[0].index ?? 0;
    const lastMatch = pillParagraphs[pillParagraphs.length - 1];
    const lastEnd = (lastMatch.index ?? 0) + lastMatch[0].length;

    return withoutInlineBadges.slice(0, firstStart) + listHtml + withoutInlineBadges.slice(lastEnd);
  }

  return withoutInlineBadges;
}

function normalizeCmsHtml(html: string) {
  return normalizeCmsLists(normalizeLegacyCmsColors(html));
}

const CmsHtml = ({ html, className }: Props) => {
  if (!html?.trim()) return null;

  return (
    <div
      className={cn("cms-html", className)}
      dangerouslySetInnerHTML={{ __html: normalizeCmsHtml(html) }}
    />
  );
};

export default CmsHtml;
